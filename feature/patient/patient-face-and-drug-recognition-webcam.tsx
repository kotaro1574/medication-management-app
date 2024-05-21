"use client"

import { RefObject } from "react"
import Webcam from "react-webcam"

import { Icons } from "@/components/ui/icons"

type Props = {
  videoConstraints: MediaTrackConstraints
  webcamRef: RefObject<Webcam>
  patientName: string | null
  loading: boolean
  faceError: string | null
}

export default function PatientFaceAndDrugRecognitionWebcam({
  videoConstraints,
  webcamRef,
  patientName,
  faceError,
  loading,
}: Props) {
  const recongitionDescription = !patientName
    ? "服薬者の撮影をしてください。"
    : "薬の撮影をしてください"

  const getBackgroundColor = (
    value: string | null,
    error: string | null
  ): string => {
    if (error) return "rgba(181, 15, 15, 0.6)"
    if (value && !error) return "rgba(88, 105, 193, 0.6)"
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
        {loading ? "認証中..." : recongitionDescription}
      </p>
      {faceError && (
        <p className="text-md absolute top-[56px] w-full text-center font-semibold text-[#FF0000]">
          {faceError}
        </p>
      )}
      <div className="absolute inset-x-2 bottom-2 space-y-2">
        <div
          style={{
            backgroundColor: getBackgroundColor(patientName, faceError),
          }}
          className="flex items-center gap-4 rounded-2xl px-2 py-2.5 backdrop-blur-sm"
        >
          <div className="flex size-10 items-center justify-center rounded-full bg-white">
            <Icons.user />
          </div>
          <p className="text-xl">
            {!patientName ? "患者の名前が入ります" : patientName}
          </p>
        </div>
        <div className="flex items-center gap-4 rounded-2xl bg-[#A4A4A4]/40 px-2 py-2.5">
          <div className="flex size-10 items-center justify-center rounded-full bg-white">
            <Icons.drug />
          </div>
          <p className="text-xl">薬の名前が入ります</p>
        </div>
      </div>
    </div>
  )
}
