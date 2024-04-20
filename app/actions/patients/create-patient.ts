"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import {
  DetectFacesCommand,
  IndexFacesCommand,
} from "@aws-sdk/client-rekognition"
import { createPresignedPost } from "@aws-sdk/s3-presigned-post"
import { v4 as uuidv4 } from "uuid"

import { rekognitionClient, s3Client } from "@/lib/aws/aws-clients"
import { createClient } from "@/lib/supabase/server"

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

export async function createPatient({
  formData,
  base64Data,
  name,
}: {
  formData: FormData
  base64Data: string
  name: string
}) {
  try {
    const imageFile = formData.get("imageFile") as File

    await detectSingleFace(base64Data)

    const { url, fields, key } = await getPresignedUrl(imageFile.type)

    const newFormData = new FormData()
    Object.entries(fields).forEach(([key, value]) => {
      newFormData.append(key, value as string)
    })
    newFormData.append("file", imageFile)

    // S3に画像をアップロード
    const uploadResponse = await fetch(url, {
      method: "POST",
      body: newFormData,
    })

    if (!uploadResponse.ok) {
      throw new Error("S3への画像アップロードに失敗しました。")
    }

    // AWS Rekognition を呼び出して画像内の顔をインデックスに登録
    const response = await rekognitionClient.send(
      new IndexFacesCommand({
        CollectionId: process.env.AMPLIFY_BUCKET,
        ExternalImageId: key,
        Image: {
          S3Object: {
            Bucket: process.env.AMPLIFY_BUCKET,
            Name: key,
          },
        },
      })
    )

    const faceId = response.FaceRecords?.[0]?.Face?.FaceId

    if (!faceId) {
      throw new Error("画像内に顔が見つかりませんでした")
    }

    const supabase = createClient()

    const { error } = await supabase.from("patients").insert({
      name,
      image_id: key,
      face_ids: [faceId],
    })

    if (error) {
      throw new Error(
        `患者データの挿入時にエラーが発生しました: ${error.message}`
      )
    }
  } catch (err) {
    console.error("患者の作成に失敗しましたerror:", err)
    redirect("/error")
  }

  revalidatePath("/patients")
  redirect("/patients")
}
