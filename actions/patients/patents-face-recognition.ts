"use server"

import { SearchFacesByImageCommand } from "@aws-sdk/client-rekognition"

import { rekognitionClient } from "@/lib/aws/aws-clients"
import { createClient } from "@/lib/supabase/server"

type Result =
  | {
      success: true
      message: string
      name: string
    }
  | {
      success: false
      error: string
    }

export async function patentsFaceRecognition({
  imageSrc,
}: {
  imageSrc: string
}): Promise<Result> {
  try {
    const response = await rekognitionClient.send(
      new SearchFacesByImageCommand({
        CollectionId: process.env.AMPLIFY_BUCKET,
        Image: {
          Bytes: Buffer.from(imageSrc, "base64"),
        },
        MaxFaces: 1,
        FaceMatchThreshold: 95, // 顔の一致スコアのしきい値
      })
    )

    const faceId = response.FaceMatches?.[0]?.Face?.FaceId

    if (!faceId) {
      throw new Error("No face matches found")
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
      throw new Error("No matching patients found")
    }

    return { success: true, message: "Face Recognition", name: data.name ?? "" }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
  }
  return { success: false, error: "An unknown error occurred" }
}
