"use client"

import { useCallback, useEffect, useRef, useState, useTransition } from "react"
import { createDrugHistory } from "@/actions/drugHistory/create-drug-history"
import { patentsDrugRecognition } from "@/actions/patients/patents-drug-recognition"
import { patentsFaceRecognition } from "@/actions/patients/patents-face-recognition"
import { PatientFaceAndDrugRecognitionCamera } from "@/feature/patient/patient-face-and-drug-recognition-camera"
import { set } from "date-fns"
import { CameraType } from "react-camera-pro"

import { Database } from "@/types/schema.gen"
import { Icons } from "@/components/ui/icons"
import { useToast } from "@/components/ui/use-toast"

export function PatientFaceAndDrugRecognition() {
  const [loading, startTransaction] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [patent, setPatent] = useState<Pick<
    Database["public"]["Tables"]["patients"]["Row"],
    "id" | "last_name" | "first_name"
  > | null>(null)
  const [isDrugRecognition, setIsDrugRecognition] = useState<boolean>(false)
  const [errorCount, setErrorCount] = useState<number>(0)
  const cameraRef = useRef<CameraType>(null)
  const { toast } = useToast()

  const onReset = useCallback(() => {
    setPatent(null)
    setIsDrugRecognition(false)
    setError(null)
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
            setTimeout(() => {
              if (cameraRef.current) {
                cameraRef.current.switchCamera()
              }
            }, 1000)
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
            toast({ title: response.message })

            setTimeout(() => {
              setPatent(null)
              setIsDrugRecognition(false)
              setErrorCount(0)
            }, 5000)
          } else {
            setError(response.error)
            setErrorCount((prev) => prev + 1)
            errorSound.play()
          }
        }
      })()
    })
  }, [patent, toast])

  const onSwitchCamera = useCallback(() => {
    if (cameraRef.current) {
      cameraRef.current.switchCamera()
    }
  }, [])

  useEffect(() => {
    if (errorCount === 5 && patent?.id) {
      ;(async () => {
        const response = await createDrugHistory({
          patientId: patent.id,
          medicationAuthResult: "failure",
        })
        if (response.success) {
          setError(response.message)
        } else {
          setError(response.error)
        }

        setTimeout(() => {
          setPatent(null)
          setError(null)
          setIsDrugRecognition(false)
          setErrorCount(0)
        }, 8000)
      })()
    }
  }, [errorCount, patent?.id, toast])

  return (
    <div className="mx-auto w-full sm:max-w-[500px] md:max-w-[600px]">
      <PatientFaceAndDrugRecognitionCamera
        cameraRef={cameraRef}
        lastName={patent?.last_name ?? ""}
        firstName={patent?.first_name ?? ""}
        isFaceRecognition={!!patent}
        isDrugRecognition={isDrugRecognition}
        loading={loading}
        error={error}
        errorCount={errorCount}
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
          onClick={onSwitchCamera}
        >
          <Icons.switch />
        </button>
      </div>
    </div>
  )
}
