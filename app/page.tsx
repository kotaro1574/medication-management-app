"use client"

import { useCallback, useRef, useState, useTransition } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { patentsDrugRecognition } from "@/actions/patients/patents-drug-recognition"
import { patentsFaceRecognition } from "@/actions/patients/patents-face-recognition"
import Webcam from "react-webcam"

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
  const [patent, setPatent] = useState<{
    name: string
    id: string
  } | null>(null)
  const [isDrugRecognition, setIsDrugRecognition] = useState<boolean>(false)
  const webcamRef = useRef<Webcam>(null)
  const [facingMode, setFacingMode] = useState(FACING_MODE_USER)
  const { toast } = useToast()

  const successSound = new Audio("/success-sound.mp3")
  const errorSound = new Audio("/error-sound.mp3")

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

    startTransaction(() => {
      ;(async () => {
        if (!patent) {
          const response = await patentsFaceRecognition({ imageSrc })
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
            imageSrc,
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
    <div className="p-4">
      <div className="mx-auto w-full sm:max-w-[500px] md:max-w-[600px]">
        <DynamicPatientFaceAndDrugRecognitionWebcam
          videoConstraints={videoConstraints}
          webcamRef={webcamRef}
          patientName={patent?.name ?? null}
          isDrugRecognition={isDrugRecognition}
          loading={loading}
          error={error}
        />

        <div className="relative mt-4 flex w-full items-center justify-center">
          <button
            onClick={onRecognition}
            className="text-[#D9D9D9] hover:text-red-600"
          >
            <Icons.shutter />
          </button>
          <button
            className="absolute right-2 top-0 text-[#D9D9D9] hover:text-[#D9D9D9]/90"
            onClick={handleClick}
          >
            <Icons.switch />
          </button>
        </div>
      </div>
    </div>
  )
}
