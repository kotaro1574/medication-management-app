import { NextRequest, NextResponse } from "next/server"
import {
  RekognitionClient,
  SearchFacesByImageCommand,
} from "@aws-sdk/client-rekognition"

const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
}

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json()

    const rekognitionClient = new RekognitionClient({
      region: process.env.AWS_REGION,
      credentials,
    })

    const response = await rekognitionClient.send(
      new SearchFacesByImageCommand({
        CollectionId: process.env.AMPLIFY_BUCKET,
        Image: {
          Bytes: Buffer.from(image, "base64"),
        },
        MaxFaces: 1,
        FaceMatchThreshold: 95, // 顔の一致スコアのしきい値
      })
    )

    return NextResponse.json({ response }, { status: 200 })
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
