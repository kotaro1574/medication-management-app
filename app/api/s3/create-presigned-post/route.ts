import { NextRequest, NextResponse } from "next/server"
import {
  DetectFacesCommand,
  RekognitionClient,
} from "@aws-sdk/client-rekognition"
import { S3Client } from "@aws-sdk/client-s3"
import { createPresignedPost } from "@aws-sdk/s3-presigned-post"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"

const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
}

const requestSchema = z.object({
  type: z.string(),
  base64Data: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const _request = await request.json()
    const { type, base64Data } = requestSchema.parse(_request)

    const rekognitionClient = new RekognitionClient({
      region: process.env.AWS_REGION,
      credentials,
    })

    const response = await rekognitionClient.send(
      new DetectFacesCommand({
        Image: {
          Bytes: Buffer.from(base64Data, "base64"),
        },
        Attributes: ["ALL"],
      })
    )

    if (response.FaceDetails && response.FaceDetails.length !== 1) {
      console.log(`画像内に顔は${response.FaceDetails.length}個存在します。`)
      return NextResponse.json(
        { error: "顔が1つだけ写っている画像をご用意ください。" },
        { status: 400 }
      )
    }

    const key = uuidv4()
    const client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: credentials,
    })
    const { url, fields } = await createPresignedPost(client, {
      Bucket: process.env.AMPLIFY_BUCKET ?? "",
      Key: key,
      Conditions: [
        ["content-length-range", 0, 10485760], // up to 10 MB
        ["starts-with", "$Content-Type", type],
      ],
      Fields: {
        "Content-Type": type,
      },
    })

    return NextResponse.json({ url, fields, key })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    } else {
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      )
    }
  }
}
