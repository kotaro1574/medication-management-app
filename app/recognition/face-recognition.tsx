"use client"

import { useCallback, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Webcam from "react-webcam"

import { Button } from "@/components/ui/button"

export function FaceRecognition() {
  const [loading, setLoading] = useState(false)
  const webcamRef = useRef<Webcam>(null)
  const router = useRouter()

  const onRecognition = useCallback(async () => {
    try {
      const imageSrc = webcamRef.current?.getScreenshot()?.split(",")[1] ?? ""
      if (!imageSrc) return

      setLoading(true)

      const res = await fetch("/api/rekognition/search-faces-by-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageSrc }),
      })

      const data = await res.json()

      if (res.ok) {
        router.push(`/patients/${data.patients.id}`)
      } else {
        console.error(data.error)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [router, webcamRef])

  return (
    <div>
      <Webcam
        className="rounded-md"
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
      />
      <Button disabled={loading} className="mt-4" onClick={onRecognition}>
        {loading ? "Loading..." : "顔認証を開始する"}
      </Button>
    </div>
  )
}
