"use server"

import { GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

import { s3Client } from "@/lib/aws/aws-clients"

const Bucket = process.env.AMPLIFY_BUCKET

export async function getS3Data(key: string) {
  const command = new GetObjectCommand({ Bucket, Key: key })
  const src = await getSignedUrl(s3Client, command, { expiresIn: 3600 })

  return { src }
}