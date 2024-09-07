import { ReactNode, useCallback, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { faceLogin } from "@/actions/auth/face-login"
import { generateCustomToken } from "@/actions/auth/generate-custom-token"
import { CameraType } from "react-camera-pro/dist/components/Camera/types"

import { createClient } from "@/lib/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Icons } from "@/components/ui/icons"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"

const DynamicCamera = dynamic(() => import("@/components/ui/camera"), {
  loading: () => (
    <Skeleton className="h-[calc(100vh_-_300px)]  w-full rounded-[24px] sm:max-w-[500px] md:max-w-[600px]" />
  ),
  ssr: false,
})

type Props = {
  trigger: ReactNode
}

export function FaceLoginCameraDialog({ trigger }: Props) {
  const cameraRef = useRef<CameraType>(null)
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const onGetFaceImages = async () => {
    try {
      if (!cameraRef.current) return
      const imageSrc = cameraRef.current.takePhoto()

      if (typeof imageSrc !== "string") return

      const base64Data = imageSrc.split(",")[1]

      const response = await faceLogin({
        imageSrc: base64Data,
      })

      if (response.success) {
        const { accessToken, refreshToken } = await generateCustomToken(
          response.id
        )

        if (!accessToken || !refreshToken) {
          throw new Error("トークンの生成に失敗しました")
        }

        const supabase = createClient()
        // Supabaseセッションを設定
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })

        if (error) {
          throw error
        }

        toast({ title: response.message })
        router.push("/")
        router.refresh()
      } else {
        throw new Error(response.error)
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({ title: error.message, variant: "destructive" })
      }
    }
  }

  const onSwitchCamera = useCallback(() => {
    if (!cameraRef.current) return
    cameraRef.current.switchCamera()
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        asChild
        onClick={() => {
          setIsOpen(true)
        }}
      >
        {trigger}
      </DialogTrigger>
      <DialogContent
        className="bg-[#F5F5F5]"
        style={{
          width: "calc(100% - 32px)",
        }}
        isClose={false}
      >
        <DialogHeader className="space-y-4">
          <DialogTitle>正面を向いて撮影してください</DialogTitle>
        </DialogHeader>
        <div>
          <div
            style={{
              height: "calc(100vh - 300px)",
            }}
          >
            <DynamicCamera cameraRef={cameraRef} />
          </div>
          <div className="relative mt-4 flex w-full items-center justify-center">
            <button
              onClick={onGetFaceImages}
              className="text-[#D9D9D9] hover:text-red-600"
            >
              <Icons.shutter />
            </button>
            <button
              className="absolute right-2 top-0 text-[#D9D9D9] hover:text-[#D9D9D9]/90"
              onClick={onSwitchCamera}
            >
              <Icons.switch />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
