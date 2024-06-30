import { ReactNode, useCallback, useRef, useState } from "react"
import { patientFormSchema } from "@/feature/patient/schema"
import { UseFormReturn } from "react-hook-form"
import Webcam from "react-webcam"
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

type Props = {
  trigger: ReactNode
  form: UseFormReturn<z.infer<typeof patientFormSchema>>
}

const FACING_MODE_USER = "user"
const FACING_MODE_ENVIRONMENT = "environment"

export function PatientFacesWebcamDialog({ trigger, form }: Props) {
  const webcamRef = useRef<Webcam>(null)
  const [facingMode, setFacingMode] = useState(FACING_MODE_USER)
  const [progress, setProgress] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const onGetFaceImages = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (!imageSrc) return
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

    const file = convertBase64ToFile(imageSrc, `faceImage_${description}.jpeg`)
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

  let videoConstraints: MediaTrackConstraints = {
    facingMode: facingMode,
  }

  const onSwitch = useCallback(() => {
    setFacingMode((prevState) =>
      prevState === FACING_MODE_USER
        ? FACING_MODE_ENVIRONMENT
        : FACING_MODE_USER
    )
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
          <Webcam
            className="rounded-[24px]"
            style={{
              height: "calc(100vh - 300px)",
              width: "100%",
              objectFit: "cover",
            }}
            audio={false}
            videoConstraints={videoConstraints}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            screenshotQuality={1}
          />
          <div className="relative mt-4 flex w-full items-center justify-center">
            <button
              onClick={onGetFaceImages}
              className="text-[#D9D9D9] hover:text-red-600"
              disabled={progress === 100}
            >
              <Icons.shutter />
            </button>
            <button
              className="absolute right-2 top-0 text-[#D9D9D9] hover:text-[#D9D9D9]/90"
              onClick={onSwitch}
            >
              <Icons.switch />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
