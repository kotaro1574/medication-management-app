"use server"

import {
  DeleteFacesCommand,
  IndexFacesCommand,
} from "@aws-sdk/client-rekognition"
import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import { createPresignedPost } from "@aws-sdk/s3-presigned-post"
import { v4 as uuidv4 } from "uuid"

import { rekognitionClient, s3Client } from "@/lib/aws/aws-clients"
import { createClient } from "@/lib/supabase/server"

type Result =
  | {
      success: true
      message: string
    }
  | {
      success: false
      error: string
    }

// Rekognitionコレクションから顔データを削除する関数
async function deleteFace(collectionId: string, faceIds: string[]) {
  try {
    await rekognitionClient.send(
      new DeleteFacesCommand({
        CollectionId: collectionId,
        FaceIds: faceIds,
      })
    )
  } catch (error) {
    console.error("Failed to delete face from collection", error)
  }
}

// S3から画像を削除する関数
async function deleteImage(key: string) {
  try {
    const deleteParams = {
      Bucket: process.env.AMPLIFY_BUCKET,
      Key: key,
    }
    await s3Client.send(new DeleteObjectCommand(deleteParams))
  } catch (error) {
    console.error("Failed to delete image from S3", error)
  }
}

// 画像をS3にアップロードするためのプリサインドURLを取得する関数
async function getPresignedUrl(fileType: string) {
  const key = uuidv4()
  const { url, fields } = await createPresignedPost(s3Client, {
    Bucket: process.env.AMPLIFY_BUCKET ?? "",
    Key: key,
    Conditions: [
      ["content-length-range", 0, 104857600], // 最大10MB
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
  name,
}: {
  formData: FormData
  name: string
}): Promise<Result> {
  const imageFile = formData.get("imageFile") as File
  try {
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

    const faceIds =
      response.FaceRecords?.map((record) => record?.Face?.FaceId ?? "") ?? []

    if (!response.FaceRecords || response.FaceRecords.length === 0) {
      await deleteImage(key)
      throw new Error("画像内に顔が見つかりませんでした")
    }

    if (response.FaceRecords.length > 1) {
      await deleteImage(key)
      await deleteFace(process.env.AMPLIFY_BUCKET ?? "", faceIds)
      throw new Error("画像内に顔が1つではありません")
    }

    const supabase = createClient()

    const { error } = await supabase.from("patients").insert({
      name,
      image_id: key,
      face_ids: faceIds,
    })

    if (error) {
      await deleteImage(key)
      await deleteFace(process.env.AMPLIFY_BUCKET ?? "", faceIds)
      throw new Error(
        `患者データの挿入時にエラーが発生しました: ${error.message}`
      )
    }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
  }
  return { success: true, message: "患者が作成されました" }
}
