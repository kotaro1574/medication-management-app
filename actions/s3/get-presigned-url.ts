"use server"

import { createPresignedPost } from "@aws-sdk/s3-presigned-post"
import { v4 as uuidv4 } from "uuid"

import { s3Client } from "@/lib/aws/aws-clients"

// 画像をS3にアップロードするためのプリサインドURLを取得する関数
export async function getPresignedUrl(fileType: string, bucket: string) {
  const key = uuidv4()

  const { url, fields } = await createPresignedPost(s3Client, {
    Bucket: bucket,
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
