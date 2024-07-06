"use client"

import { useCallback, useRef, useState, useTransition } from "react"
import dynamic from "next/dynamic"
import { patentsDrugRecognition } from "@/actions/patients/patents-drug-recognition"
import { patentsFaceRecognition } from "@/actions/patients/patents-face-recognition"
import { CameraType } from "react-camera-pro"
import { FacingMode } from "react-camera-pro/dist/components/Camera/types"

import { Database } from "@/types/schema.gen"
import { Icons } from "@/components/ui/icons"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"

const DynamicPatientFaceAndDrugRecognitionWebcam = dynamic(
  () => import("@/feature/patient/patient-face-and-drug-recognition-webcam"),
  {
    loading: () => (
      <Skeleton className="h-[calc(100vh_-_120px_-_44px)]  w-full rounded-[24px] sm:max-w-[500px] md:max-w-[600px]" />
    ),
    ssr: false,
  }
)

const FACING_MODE_USER = "user"
const FACING_MODE_ENVIRONMENT = "environment"

export default function TopPage() {
  const [loading, startTransaction] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [patent, setPatent] = useState<Pick<
    Database["public"]["Tables"]["patients"]["Row"],
    "id" | "last_name" | "first_name"
  > | null>(null)
  const [isDrugRecognition, setIsDrugRecognition] = useState<boolean>(false)
  const cameraRef = useRef<CameraType>(null)
  const [facingMode, setFacingMode] = useState<FacingMode>(FACING_MODE_USER)
  const { toast } = useToast()

  const onReset = useCallback(() => {
    setPatent(null)
    setIsDrugRecognition(false)
    setError(null)
  }, [])

  const handleClick = useCallback(() => {
    setFacingMode((prevState) =>
      prevState === FACING_MODE_USER
        ? FACING_MODE_ENVIRONMENT
        : FACING_MODE_USER
    )
  }, [])

  const onRecognition = useCallback(() => {
    if (!cameraRef.current) return
    const imageSrc = cameraRef.current.takePhoto()

    if (typeof imageSrc !== "string") return

    const base64Data = imageSrc.split(",")[1]

    const successSound = new Audio("/success-sound.mp3")
    const errorSound = new Audio("/error-sound.mp3")

    startTransaction(() => {
      ;(async () => {
        if (!patent) {
          const response = await patentsFaceRecognition({
            imageSrc: base64Data,
          })
          if (response.success) {
            setPatent(response.data)
            setError(null)
            successSound.play()
          } else {
            setError(response.error)
            errorSound.play()
          }
        } else {
          const response = await patentsDrugRecognition({
            imageSrc: base64Data,
            patent: patent,
          })
          if (response.success) {
            setIsDrugRecognition(true)
            setError(null)
            successSound.play()
            toast({ description: response.message })

            setTimeout(() => {
              setPatent(null)
              setIsDrugRecognition(false)
            }, 5000)
          } else {
            setError(response.error)
            errorSound.play()
          }
        }
      })()
    })
  }, [patent, toast])

  return (
    <section className="px-4 py-[60px]">
      <div className="mx-auto w-full sm:max-w-[500px] md:max-w-[600px]">
        <DynamicPatientFaceAndDrugRecognitionWebcam
          facingMode={facingMode}
          cameraRef={cameraRef}
          lastName={patent?.last_name ?? ""}
          firstName={patent?.first_name ?? ""}
          isFaceRecognition={!!patent}
          isDrugRecognition={isDrugRecognition}
          loading={loading}
          error={error}
        />

        <div className="relative mt-4 flex w-full items-center justify-center">
          {patent && (
            <button
              onClick={onReset}
              className="absolute left-2 top-0 text-xs text-[#A4A4A4] hover:text-[#A4A4A4]/60"
            >
              認証やり直し
            </button>
          )}
          <button
            onClick={onRecognition}
            className="text-[#D9D9D9] hover:text-red-600"
          >
            <Icons.shutter />
          </button>
          <button
            className="absolute right-2 top-0 text-[#A4A4A4] hover:text-[#A4A4A4]/60"
            onClick={handleClick}
          >
            <Icons.switch />
          </button>
        </div>
      </div>
    </section>
  )
}
