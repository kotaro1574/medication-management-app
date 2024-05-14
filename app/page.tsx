"use client"

import { useCallback, useRef, useState } from "react"
import { AspectRatio } from "@radix-ui/react-aspect-ratio"
import { Icon } from "@radix-ui/react-select"
import Webcam from "react-webcam"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"

const FACING_MODE_USER = "user"
const FACING_MODE_ENVIRONMENT = "environment"

export default function TopPage() {
  const webcamRef = useRef<Webcam>(null)

  const [facingMode, setFacingMode] = useState(FACING_MODE_USER)

  let videoConstraints: MediaTrackConstraints = {
    facingMode: facingMode,
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
    <div className="flex flex-col items-center p-4">
      <AspectRatio ratio={343 / 600} className="relative">
        <Webcam
          className="rounded-[24px]"
          style={{
            height: "100%",
            width: "100%",
            objectFit: "cover",
          }}
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          screenshotQuality={1}
        />

        <p className="text-md absolute top-[24px] w-full text-center font-semibold">
          服薬者の撮影をしてください。
        </p>
        <div className="absolute inset-x-2 bottom-2 space-y-2">
          <div className="flex items-center gap-4 rounded-2xl bg-[#A4A4A4]/40 px-2 py-2.5">
            <div className="flex size-10 items-center justify-center rounded-full bg-white">
              <Icons.user />
            </div>
            <p className="text-xl">服薬者の名前が入ります</p>
          </div>
          <div className="flex items-center gap-4 rounded-2xl bg-[#A4A4A4]/40 px-2 py-2.5">
            <div className="flex size-10 items-center justify-center rounded-full bg-white">
              <Icons.drug />
            </div>
            <p className="text-xl">薬の名前が入ります</p>
          </div>
        </div>
      </AspectRatio>

      <div className="relative mt-4 flex w-full items-center justify-center">
        <button onClick={onRecognition}>
          <Icons.shutter />
        </button>
        <button className="absolute right-2 top-0" onClick={handleClick}>
          <Icons.switch />
        </button>
      </div>
    </div>
  )
}
