import { ReactNode, useCallback, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { CameraType } from "react-camera-pro/dist/components/Camera/types"
import { UseFormReturn } from "react-hook-form"
import { z } from "zod"

import { convertBase64ToFile } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Icons } from "@/components/ui/icons"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"

import { updateUserFormSchema } from "./schema"

const DynamicCamera = dynamic(() => import("@/components/ui/camera"), {
  loading: () => (
    <Skeleton className="h-[calc(100vh_-_300px)]  w-full rounded-[24px] sm:max-w-[500px] md:max-w-[600px]" />
  ),
  ssr: false,
})

type Props = {
  trigger: ReactNode
  form: UseFormReturn<z.infer<typeof updateUserFormSchema>>
}

export function UserFacesCameraDialog({ trigger, form }: Props) {
  const cameraRef = useRef<CameraType>(null)
  const [progress, setProgress] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const onGetFaceImages = useCallback(() => {
    if (!cameraRef.current) return
    const imageSrc = cameraRef.current.takePhoto()

    if (typeof imageSrc !== "string") return

    const base64Data = imageSrc.split(",")[1]

    const description =
      progress === 0
        ? "center"
        : progress === 20
        ? "right"
        : progress === 40
        ? "left"
        : progress === 60
        ? "up"
        : progress === 80
        ? "down"
        : ""

    const file = convertBase64ToFile(
      base64Data,
      `faceImage_${description}.jpeg`
    )
    const currentFaceImages = form.getValues("faceImages")
    form.setValue("faceImages", [...currentFaceImages, file])
    setProgress((prevState) => {
      const newProgress = prevState + 20
      if (newProgress >= 100) {
        setTimeout(() => setIsOpen(false), 2000) // 2秒遅延してダイアログを閉じる
      }
      return newProgress
    })
  }, [form, progress])

  const onSwitchCamera = useCallback(() => {
    if (!cameraRef.current) return
    cameraRef.current.switchCamera()
  }, [])

  const description =
    progress === 0
      ? "正面を向いて撮影してください"
      : progress === 20
      ? "少し右を向いて撮影してください"
      : progress === 40
      ? "少し左を向いて撮影してください"
      : progress === 60
      ? "少し上を向いて撮影してください"
      : progress === 80
      ? "少し下を向いて撮影してください"
      : "撮影が完了しました"

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        asChild
        onClick={() => {
          setIsOpen(true)
          if (progress === 100) {
            form.setValue("faceImages", [])
            setProgress(0)
          }
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
          <DialogTitle>{description}</DialogTitle>
          <Progress value={progress} />
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
              disabled={progress === 100}
            >
              <Icons.shutter />
            </button>
            <button
              className="absolute right-2 top-0 text-[#000000] hover:text-[#000000]/60"
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
