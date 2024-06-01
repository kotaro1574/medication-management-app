"use server"

import { SearchFacesByImageCommand } from "@aws-sdk/client-rekognition"

import { Database } from "@/types/schema.gen"
import { rekognitionClient } from "@/lib/aws/aws-clients"
import { createClient } from "@/lib/supabase/server"

type Result =
  | {
      success: true
      message: string
      data: Pick<
        Database["public"]["Tables"]["patients"]["Row"],
        "id" | "last_name" | "first_name"
      >
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
        CollectionId: process.env.FACES_BUCKET,
        Image: {
          Bytes: Buffer.from(imageSrc, "base64"),
        },
        MaxFaces: 1,
        FaceMatchThreshold: 95, // 顔の一致スコアのしきい値
      })
    )

    const faceId = response.FaceMatches?.[0]?.Face?.FaceId

    if (!faceId) {
      throw new Error("一致する顔が見つかりません")
    }

    const supabase = createClient()

    const { data, error } = await supabase
      .from("patients")
      .select("id, last_name, first_name")
      .eq("face_id", faceId)
      .single()

    if (error) {
      throw error
    }

    if (!data) {
      throw new Error("一致する患者が見つかりません")
    }

    return {
      success: true,
      message: "服薬者の顔認証完了",
      data,
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("There are no faces in the image")) {
        return { success: false, error: "画像内に顔が見つかりません" }
      } else {
        return { success: false, error: error.message }
      }
    }
  }
  return { success: false, error: "エラーが発生しました" }
}
