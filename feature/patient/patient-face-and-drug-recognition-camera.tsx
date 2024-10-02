"use client"

import { RefObject } from "react"
import dynamic from "next/dynamic"
import { CameraType } from "react-camera-pro"
import { FacingMode } from "react-camera-pro/dist/components/Camera/types"

import { Icons } from "@/components/ui/icons"
import { Skeleton } from "@/components/ui/skeleton"

const DynamicCamera = dynamic(() => import("@/components/ui/camera"), {
  loading: () => (
    <Skeleton className="h-[calc(100vh_-_300px)]  w-full rounded-[24px] sm:max-w-[500px] md:max-w-[600px]" />
  ),
  ssr: false,
})

type Props = {
  cameraRef: RefObject<CameraType>
  lastName: string
  firstName: string
  isFaceRecognition: boolean
  isDrugRecognition: boolean
  loading: boolean
  error: string | null
  errorCount: number
  facingMode: FacingMode
}

export function PatientFaceAndDrugRecognitionCamera({
  cameraRef,
  lastName,
  firstName,
  isFaceRecognition,
  isDrugRecognition,
  errorCount,
  error,
  loading,
  facingMode,
}: Props) {
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
    if (isRecognition) return "rgba(88, 105, 193, 0.6)"
    if (isError) return "rgba(181, 15, 15, 0.6)"
    return "rgba(163, 163, 163, 0.4)"
  }

  console.log(
    "isFaceRecognition",
    getBackgroundColor(isFaceRecognition, isError)
  )
  console.log(
    "isDrugRecognition",
    getBackgroundColor(isDrugRecognition, isError)
  )

  return (
    <div className="relative">
      <div
        style={{
          height: "calc(100vh - 200px)",
        }}
      >
        <DynamicCamera cameraRef={cameraRef} facingMode={facingMode} />
      </div>

      <p className="text-md absolute top-[24px] w-full text-center font-semibold">
        {loading ? "認証中..." : recognitionDescription}
      </p>
      {error && (
        <p className="text-md absolute top-[56px] w-full text-center font-semibold text-[#FF0000]">
          {error} {isFaceRecognition && `: ${errorCount}/5`}
        </p>
      )}

      {isFaceRecognition && (
        <div
          className="absolute w-full"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="mx-2 h-[140px] border-[1.5px] border-[#FFCA0E]" />
          <p className="mt-1 text-center text-xs font-semibold text-[#FFCA0E]">
            ここに名前を置いて撮影してください
          </p>
        </div>
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
          {isFaceRecognition && (
            <p className="text-xl">
              {lastName} {firstName}
            </p>
          )}
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
          {isDrugRecognition && (
            <p className="text-xl">
              {lastName} {firstName}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
