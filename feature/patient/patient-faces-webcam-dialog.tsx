import { ReactNode, useCallback, useRef, useState } from "react"
import { createPatientFormSchema } from "@/feature/patient/schema"
import { UseFormReturn } from "react-hook-form"
import Webcam from "react-webcam"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Icons } from "@/components/ui/icons"
import { Progress } from "@/components/ui/progress"

type Props = {
  trigger: ReactNode
  form: UseFormReturn<z.infer<typeof createPatientFormSchema>>
}

const FACING_MODE_USER = "user"
const FACING_MODE_ENVIRONMENT = "environment"

export function PatientFacesWebcamDialog({ trigger, form }: Props) {
  const webcamRef = useRef<Webcam>(null)
  const [facingMode, setFacingMode] = useState(FACING_MODE_USER)
  const [progress, setProgress] = useState(0)

  const onGetFaceImages = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()?.split(",")[1] ?? ""
    if (!imageSrc) return

    const currentFaceImages = form.getValues("faceImages")
    form.setValue("faceImages", [...currentFaceImages, imageSrc])
    setProgress((prevState) => prevState + 20)
  }, [form])

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
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
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
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              閉じる
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
