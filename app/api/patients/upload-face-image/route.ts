import { NextRequest, NextResponse } from "next/server"
import { DetectFacesCommand } from "@aws-sdk/client-rekognition"
import { createPresignedPost } from "@aws-sdk/s3-presigned-post"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"

import { rekognitionClient, s3Client } from "@/lib/aws/aws-clients"
import { toBase64 } from "@/lib/utils"

// 画像から単一の顔を検出する関数
async function detectSingleFace(base64Data: string) {
  const { FaceDetails } = await rekognitionClient.send(
    new DetectFacesCommand({
      Image: { Bytes: Buffer.from(base64Data, "base64") },
      Attributes: ["ALL"],
    })
  )

  if (!FaceDetails || FaceDetails.length !== 1) {
    throw new Error(
      `画像に含まれる顔の数が1ではありません: 現在の顔の数 = ${
        FaceDetails?.length || 0
      }`
    )
  }
}

// 画像をS3にアップロードするためのプリサインドURLを取得する関数
async function getPresignedUrl(fileType: string) {
  const key = uuidv4()
  const { url, fields } = await createPresignedPost(s3Client, {
    Bucket: process.env.AMPLIFY_BUCKET ?? "",
    Key: key,
    Conditions: [
      ["content-length-range", 0, 10485760], // 最大10MB
      ["starts-with", "$Content-Type", fileType],
    ],
    Fields: {
      "Content-Type": fileType,
    },
  })
  return { url, fields, key }
}

// リクエストのバリデーションスキーマ
const requestSchema = z.object({
  imageFile: z.instanceof(File),
})

// POSTハンドラー
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json()
    const { imageFile } = requestSchema.parse(reqBody)

    const base64Data = await toBase64(imageFile)
    await detectSingleFace(base64Data)

    const { url, fields, key } = await getPresignedUrl(imageFile.type)

    const formData = new FormData()
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value as string)
    })
    formData.append("file", imageFile)

    // S3に画像をアップロード
    const uploadResponse = await fetch(url, {
      method: "POST",
      body: formData,
    })

    if (!uploadResponse.ok) {
      throw new Error("S3への画像アップロードに失敗しました。")
    }

    return NextResponse.json({ key }, { status: 200 })
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "予期せぬエラーが発生しました"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
