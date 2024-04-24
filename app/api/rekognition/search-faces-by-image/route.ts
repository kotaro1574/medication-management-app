import { NextRequest, NextResponse } from "next/server"
import { SearchFacesByImageCommand } from "@aws-sdk/client-rekognition"

import { rekognitionClient } from "@/lib/aws/aws-clients"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json()

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

    const faceId = response.FaceMatches?.[0]?.Face?.FaceId

    if (!faceId) {
      return NextResponse.json(
        { error: "No face matches found" },
        { status: 404 }
      )
    }

    const supabase = createClient()

    const { data, error } = await supabase
      .from("patients")
      .select("id, name, face_ids")
      .filter("face_ids", "cs", `{${faceId}}`)
      .single()

    if (error) {
      throw error
    }

    if (!data) {
      return NextResponse.json(
        { error: "No matching patients found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ patients: data }, { status: 200 })
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
