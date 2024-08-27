"use server"

import Vision from "@google-cloud/vision"

export async function ocrGoogleCloudVision({
  image,
}: {
  image: string
}): Promise<string> {
  const client = new Vision.ImageAnnotatorClient({
    credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS ?? ""),
  })

  const [result] = await client.textDetection({
    image: { content: image },
  })
  const detectedText = result.textAnnotations?.[0]?.description

  if (!detectedText) {
    throw new Error("テキストが検出されませんでした")
  }

  return detectedText
}
