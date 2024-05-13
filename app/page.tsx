"use client"

import { useCallback, useRef, useState } from "react"
import Webcam from "react-webcam"

import { Button } from "@/components/ui/button"

const FACING_MODE_USER = "user"
const FACING_MODE_ENVIRONMENT = "environment"

export default function TopPage() {
  const webcamRef = useRef<Webcam>(null)

  const [facingMode, setFacingMode] = useState(FACING_MODE_USER)

  let videoConstraints: MediaTrackConstraints = {
    facingMode: facingMode,
    width: 270,
    height: 480,
  }

  const handleClick = useCallback(() => {
    setFacingMode((prevState) =>
      prevState === FACING_MODE_USER
        ? FACING_MODE_ENVIRONMENT
        : FACING_MODE_USER
    )
  }, [])

  const onRecognition = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()?.split(",")[1] ?? ""
    if (!imageSrc) return
    console.log(imageSrc)
  }, [webcamRef])

  return (
    <div>
      <Webcam
        className="webcam"
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        screenshotQuality={1}
      />
      <Button variant={"outline"} onClick={handleClick}>
        Switch camera
      </Button>

      <Button className="mt-4" onClick={onRecognition}>
        顔認証
      </Button>
    </div>
  )
}
