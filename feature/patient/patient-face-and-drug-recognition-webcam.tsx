"use client"

import { RefObject } from "react"
import Webcam from "react-webcam"

import { Icons } from "@/components/ui/icons"

type Props = {
  videoConstraints: MediaTrackConstraints
  webcamRef: RefObject<Webcam>
}

export default function PatientFaceAndDrugRecognitionWebcam({
  videoConstraints,
  webcamRef,
}: Props) {
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
    </div>
  )
}
