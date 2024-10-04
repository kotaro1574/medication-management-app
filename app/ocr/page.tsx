"use client"

import { useRef, useState } from "react"
import dynamic from "next/dynamic"
import NextImage from "next/image"
import { CameraType } from "react-camera-pro"

import { Icons } from "@/components/ui/icons"
import { Skeleton } from "@/components/ui/skeleton"

const DynamicCamera = dynamic(() => import("@/components/ui/camera"), {
  loading: () => (
    <Skeleton className="h-[calc(100vh_-_300px)]  w-full rounded-[24px] sm:max-w-[500px] md:max-w-[600px]" />
  ),
  ssr: false,
})

export default function OCRPage() {
  const cameraRef = useRef<CameraType>(null)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [denoiseImageSrc, setDenoiseImageSrc] = useState<string | null>(null)
  const [isCamBtnPressed, setIsCamBtnPressed] = useState<boolean>(false)

  // 画像のノイズを除去する関数
  const denoiseImage = (base64Data: string): Promise<string> => {
    return new Promise((resolve) => {
      const image = new Image()
      image.src = `data:image/jpeg;base64,${base64Data}`

      image.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        // canvasのサイズを画像と同じに設定
        canvas.width = image.width
        canvas.height = image.height

        if (!ctx) {
          throw new Error("キャンバスコンテキストはサポートされていません")
        }

        // 画像をcanvasに描画
        ctx.drawImage(image, 0, 0, image.width, image.height)

        // 画像データを取得
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

        // 簡単なノイズ除去：例えばガウスぼかしを適用
        // ここでノイズ除去アルゴリズムを適用する
        // 例として、各ピクセルを周囲の平均値にする簡単な平均フィルタを適用
        const newImageData = ctx.createImageData(imageData)
        const { data, width, height } = imageData

        for (let y = 1; y < height - 1; y++) {
          for (let x = 1; x < width - 1; x++) {
            for (let c = 0; c < 4; c++) {
              // RGBA各チャンネルについて
              const i = (y * width + x) * 4 + c
              newImageData.data[i] =
                (data[i] +
                  data[(y * width + (x - 1)) * 4 + c] +
                  data[(y * width + (x + 1)) * 4 + c] +
                  data[((y - 1) * width + x) * 4 + c] +
                  data[((y + 1) * width + x) * 4 + c]) /
                5 // 5ピクセルの平均
            }
          }
        }

        // ノイズ除去後のデータをcanvasに描画
        ctx.putImageData(newImageData, 0, 0)

        // canvasからbase64に変換して結果を返す
        resolve(canvas.toDataURL().split(",")[1])
      }
    })
  }

  const onClick = async () => {
    setIsCamBtnPressed(true)
    if (cameraRef.current) {
      const imageSrc = cameraRef.current.takePhoto()
      if (typeof imageSrc !== "string") return
      setImageSrc(imageSrc.split(",")[1])

      const denoiseImageSrc = await denoiseImage(imageSrc.split(",")[1])
      setDenoiseImageSrc(denoiseImageSrc)
    }
    setTimeout(() => {
      setIsCamBtnPressed(false)
    }, 1500);
  }

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          OCR
        </h1>
        <button onClick={onClick} className={`text-[#D9D9D9]  md:hover:text-red-600 ${isCamBtnPressed ? "text-red-600" : ""}`}>
          <Icons.shutter />
        </button>
      </div>

      <div className="relative">
        <div
          style={{
            height: "calc(100vh - 200px)",
          }}
        >
          <DynamicCamera cameraRef={cameraRef} facingMode="environment" />
        </div>
      </div>
      {imageSrc && (
        <NextImage
          src={`data:image/jpeg;base64,${imageSrc}`}
          width={300}
          height={300}
          alt={""}
        />
      )}
      {denoiseImageSrc && (
        <NextImage
          src={`data:image/jpeg;base64,${denoiseImageSrc}`}
          width={300}
          height={300}
          alt={""}
        />
      )}
    </section>
  )
}
