"use client"

import { useCallback, useRef, useState } from "react"
import dynamic from "next/dynamic"
import Webcam from "react-webcam"

import { Icons } from "@/components/ui/icons"
import { Skeleton } from "@/components/ui/skeleton"

const DynamicPatientFaceAndDrugRecognitionWebcam = dynamic(
  () => import("@/feature/patient/patient-face-and-drug-recognition-webcam"),
  {
    loading: () => (
      <Skeleton className="h-[600px] w-[343px] rounded-[24px] sm:w-[500px] md:w-[600px]" />
    ),
    ssr: false,
  }
)

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
    <div className="p-4">
      <div className="mx-auto max-w-[343px] sm:max-w-[500px] md:max-w-[600px]">
        <DynamicPatientFaceAndDrugRecognitionWebcam
          videoConstraints={videoConstraints}
          webcamRef={webcamRef}
        />

        <div className="relative mt-4 flex w-full items-center justify-center">
          <button onClick={onRecognition}>
            <Icons.shutter />
          </button>
          <button className="absolute right-2 top-0" onClick={handleClick}>
            <Icons.switch />
          </button>
        </div>
      </div>
    </div>
  )
}
