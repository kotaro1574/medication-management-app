import { DeleteFacesCommand } from "@aws-sdk/client-rekognition"
import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import { createPresignedPost } from "@aws-sdk/s3-presigned-post"
import { v4 as uuidv4 } from "uuid"

import { rekognitionClient, s3Client } from "@/lib/aws/aws-clients"

// Rekognitionコレクションから顔データを削除する関数
export async function deleteFace(collectionId: string, faceIds: string[]) {
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
export async function deleteImage(key: string) {
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
export async function getPresignedUrl(fileType: string) {
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
