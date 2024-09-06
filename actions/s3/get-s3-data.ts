"use server"

import { GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

import { s3Client } from "@/lib/aws/aws-clients"

export async function getS3Data(key: string | null, bucket: string) {
  if (!key) {
    return { url: "" }
  }

  const command = new GetObjectCommand({ Bucket: bucket, Key: key })
  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 })

  return { url }
}
