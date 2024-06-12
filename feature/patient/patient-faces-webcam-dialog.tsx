import { ReactNode, useRef } from "react"
import Webcam from "react-webcam"

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

type Props = {
  trigger: ReactNode
}

export function PatientFacesWebcamDialog({ trigger }: Props) {
  const webcamRef = useRef<Webcam>(null)
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>顔写真を撮影</DialogTitle>
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
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            screenshotQuality={1}
          />
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
