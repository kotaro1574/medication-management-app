"use client"

import { useCallback, useRef, useState } from "react"
import Webcam from "react-webcam"

import { Button } from "@/components/ui/button"

export function FaceRecognition() {
  const [loading, setLoading] = useState(false)
  const webcamRef = useRef<Webcam>(null)

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
      console.log(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [webcamRef])

  return (
    <div>
      <Webcam
        className="rounded-md"
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
      />
      <Button disabled={loading} className="mt-4" onClick={onRecognition}>
        {loading ? "Loading..." : "Recognize"}
      </Button>
    </div>
  )
}
