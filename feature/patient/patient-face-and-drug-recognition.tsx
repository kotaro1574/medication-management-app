"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { createDrugHistory } from "@/actions/drugHistory/create-drug-history"
import { patentsDrugRecognition } from "@/actions/patients/patents-drug-recognition"
import { patentsFaceRecognition } from "@/actions/patients/patents-face-recognition"
import { PatientFaceAndDrugRecognitionCamera } from "@/feature/patient/patient-face-and-drug-recognition-camera"
import { CameraType } from "react-camera-pro"
import { FacingMode } from "react-camera-pro/dist/components/Camera/types"

import { Database } from "@/types/schema.gen"
import { Icons } from "@/components/ui/icons"
import { useToast } from "@/components/ui/use-toast"

export function PatientFaceAndDrugRecognition() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [patent, setPatent] = useState<Pick<
    Database["public"]["Tables"]["patients"]["Row"],
    "id" | "last_name" | "first_name"
  > | null>(null)
  const [isDrugRecognition, setIsDrugRecognition] = useState<boolean>(false)
  const [errorCount, setErrorCount] = useState<number>(0)
  const [facingMode, setFacingMode] = useState<FacingMode>("user")
  const cameraRef = useRef<CameraType>(null)
  const { toast } = useToast()

  const onReset = useCallback(() => {
    setPatent(null)
    setIsDrugRecognition(false)
    setError(null)
    setErrorCount(0)
    if (cameraRef.current && facingMode === "environment") {
      setFacingMode("user")
      cameraRef.current.switchCamera()
    }
  }, [facingMode])

  // 顔認識処理
  const handleFaceRecognition = async (base64Data: string) => {
    try {
      const response = await patentsFaceRecognition({
        imageSrc: base64Data,
      })
      if (response.success) {
        setPatent(response.data)
        setError(null)
        const successSound = new Audio("/success-sound.mp3")
        successSound.play()
        setTimeout(() => {
          if (cameraRef.current && facingMode === "user") {
            setFacingMode("environment")
            cameraRef.current.switchCamera()
          }
        }, 1000)
      } else {
        throw new Error(response.error)
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      }
      const errorSound = new Audio("/error-sound.mp3")
      errorSound.play()
    } finally {
      setLoading(false)
    }
  }

  // 薬認識処理
  const handleDrugRecognition = async (base64Data: string) => {
    try {
      const response = await patentsDrugRecognition({
        imageSrc: base64Data,
        patent: patent!,
      })
      if (response.success) {
        setIsDrugRecognition(true)
        setError(null)
        const successSound = new Audio("/success-sound.mp3")
        successSound.play()
        toast({ title: response.message })

        setTimeout(() => {
          setPatent(null)
          setIsDrugRecognition(false)
          setErrorCount(0)
          if (cameraRef.current && facingMode === "environment") {
            setFacingMode("user")
            cameraRef.current.switchCamera()
          }
        }, 5000)
      } else {
        setErrorCount((prev) => prev + 1)
        throw new Error(response.error)
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      }
      const errorSound = new Audio("/error-sound.mp3")
      errorSound.play()
      // エラーが発生した場合に2秒遅延させる処理を追加
      await new Promise((resolve) => setTimeout(resolve, 2000))
    } finally {
      setLoading(false)
    }
  }

  const onRecognition = async () => {
    if (!cameraRef.current) return
    const imageSrc = cameraRef.current.takePhoto()

    if (typeof imageSrc !== "string") return

    const base64Data = imageSrc.split(",")[1]

    setLoading(true) // 開始時にローディング状態に設定

    if (!patent) {
      await handleFaceRecognition(base64Data)
    } else {
      await handleDrugRecognition(base64Data)
    }
  }

  const onSwitchCamera = () => {
    if (cameraRef.current) {
      setFacingMode((prev) => (prev === "user" ? "environment" : "user"))
      cameraRef.current.switchCamera()
    }
  }

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
          onReset()
        }, 8000)
      })()
    }
  }, [errorCount, facingMode, patent?.id, toast, onReset])

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
        facingMode={facingMode}
      />

      <div className="relative mt-4 flex w-full items-center justify-center">
        {patent && (
          <button
            onClick={onReset}
            className="absolute left-2 top-0 text-xs text-[#A4A4A4] hover:text-[#A4A4A4]/60"
            disabled={loading}
          >
            認証やり直し
          </button>
        )}
        <button
          onClick={onRecognition}
          className="text-[#D9D9D9] active:text-red-600 md:hover:text-red-600"
          disabled={loading || isDrugRecognition}
        >
          <Icons.shutter />
        </button>
        <button
          className="absolute right-2 top-0 text-[#000000] hover:text-[#000000]/60"
          onClick={onSwitchCamera}
          disabled={loading}
        >
          <Icons.switch />
        </button>
      </div>
    </div>
  )
}
