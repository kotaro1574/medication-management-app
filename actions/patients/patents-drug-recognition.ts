"use server"

import Vision from "@google-cloud/vision"

import { ActionResult } from "@/types/action"

export async function patentsDrugRecognition({
  imageSrc,
  patentName,
}: {
  imageSrc: string
  patentName: string
}): Promise<ActionResult> {
  try {
    const client = new Vision.ImageAnnotatorClient({
      credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS ?? ""),
    })

    const [result] = await client.textDetection({
      image: { content: imageSrc },
    })
    const detectedText = result.textAnnotations?.[0]?.description

    if (!detectedText) {
      throw new Error("テキストが検出されませんでした")
    }

    const isPatentNameIncluded = detectedText.includes(patentName)

    console.log(detectedText)

    if (!isPatentNameIncluded) {
      throw new Error("服薬者の名前が含まれていません")
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "薬の認識に失敗しました",
    }
  }
  return {
    success: true,
    message: "薬の認識完了",
  }
}
