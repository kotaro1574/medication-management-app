"use client"

import { useCallback, useRef, useState } from "react"
import Webcam from "react-webcam"

import { Button } from "@/components/ui/button"

export default function GoogleCloudVisionPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const webcamRef = useRef<Webcam>(null)

  const onOCR = useCallback(async () => {
    try {
      setLoading(true)
      const base64_image =
        webcamRef.current?.getScreenshot()?.split(",")[1] ?? ""
      if (!base64_image) return

      const response = await fetch("/api/google-cloud-vision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64_image }),
      })

      const data = await response.json()

      setMessage(data.response)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [webcamRef])

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Google Cloud VisionでOCR
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          画像からテキストを抽出するために、テキストが含まれた画像を撮影してください。
        </p>
      </div>

      <div>
        {!message ? (
          <>
            <Webcam
              className="rounded-md"
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "environment" }}
            />
            <Button disabled={loading} className="mt-4" onClick={onOCR}>
              {loading ? "Loading..." : "テキストを抽出"}
            </Button>
          </>
        ) : (
          <>
            <p className="text-xl font-bold">抽出されたテキスト👇</p>
            <p className="mt-4 max-w-[700px] text-2xl">{message}</p>
          </>
        )}
      </div>
    </section>
  )
}
