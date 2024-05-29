"use client"

import { RefObject } from "react"
import Webcam from "react-webcam"

import { Icons } from "@/components/ui/icons"

type Props = {
  videoConstraints: MediaTrackConstraints
  webcamRef: RefObject<Webcam>
  patientName: string | null
  isDrugRecognition: boolean
  loading: boolean
  error: string | null
}

export default function PatientFaceAndDrugRecognitionWebcam({
  videoConstraints,
  webcamRef,
  patientName,
  isDrugRecognition,
  error,
  loading,
}: Props) {
  const isFaceRecognition = !!patientName
  const isError = !!error

  const recognitionDescription =
    !isFaceRecognition && !isDrugRecognition
      ? "服薬者の撮影をしてください。"
      : isFaceRecognition && !isDrugRecognition
      ? "薬の撮影をしてください"
      : "認証完了"

  const getBackgroundColor = (
    isRecognition: boolean,
    isError: boolean
  ): string => {
    if (isError) return "rgba(181, 15, 15, 0.6)"
    if (isRecognition && !isError) return "rgba(88, 105, 193, 0.6)"
    return "rgba(163, 163, 163, 0.4)"
  }

  return (
    <div className="relative">
      <Webcam
        className="rounded-[24px]"
        style={{
          height: "calc(100vh - 120px - 44px)",
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
        {loading ? "認証中..." : recognitionDescription}
      </p>
      {error && (
        <p className="text-md absolute top-[56px] w-full text-center font-semibold text-[#FF0000]">
          {error}
        </p>
      )}
      <div className="absolute inset-x-2 bottom-2 space-y-2">
        <div
          style={{
            backgroundColor: getBackgroundColor(isFaceRecognition, isError),
          }}
          className="flex items-center gap-4 rounded-2xl px-2 py-2.5 backdrop-blur-sm"
        >
          <div className="flex size-10 items-center justify-center rounded-full bg-white">
            <Icons.user />
          </div>
          {patientName && <p className="text-xl">{patientName}</p>}
        </div>
        <div
          style={{
            backgroundColor: getBackgroundColor(isDrugRecognition, isError),
          }}
          className="flex items-center gap-4 rounded-2xl bg-[#A4A4A4]/40 px-2 py-2.5"
        >
          <div className="flex size-10 items-center justify-center rounded-full bg-white">
            <Icons.drug />
          </div>
          {isDrugRecognition && <p className="text-xl">{patientName}</p>}
        </div>
      </div>
    </div>
  )
}
