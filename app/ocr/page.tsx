"use client"

import { useCallback, useRef, useState } from "react"
import Webcam from "react-webcam"

import { Button } from "@/components/ui/button"

export default function OCRPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const webcamRef = useRef<Webcam>(null)

  const onOCR = useCallback(async () => {
    try {
      const base64_image =
        webcamRef.current?.getScreenshot()?.split(",")[1] ?? ""
      if (!base64_image) return

      setLoading(true)

      const res = await fetch("/api/chat-with-vision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ base64_image: base64_image }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage(data.response.message.content)
      } else {
        console.error(data.error)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [webcamRef])

  console.log("test3")

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          画像からテキストを抽出する
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
