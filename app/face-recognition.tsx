"use client"

import { useCallback, useRef } from "react"
import Webcam from "react-webcam"

import { Button } from "@/components/ui/button"

export function FaceRecognition() {
  const webcamRef = useRef<Webcam>(null)

  const onCapture = useCallback(() => {
    const imageSrc = webcamRef?.current?.getScreenshot() ?? ""
    console.log(imageSrc)
  }, [webcamRef])
  return (
    <div>
      <Webcam
        className="rounded-md"
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
      />
      <Button className="mt-4" onClick={onCapture}>
        顔認証
      </Button>
    </div>
  )
}
