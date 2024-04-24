import { NextResponse } from "next/server"
import { GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

import { s3Client } from "@/lib/aws/aws-clients"

const Bucket = process.env.AMPLIFY_BUCKET

export async function GET(_: Request, { params }: { params: { key: string } }) {
  console.log(params.key)
  const command = new GetObjectCommand({ Bucket, Key: params.key })
  const src = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
  console.log(src)
  return NextResponse.json({ src })
}
