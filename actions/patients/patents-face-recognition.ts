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
  let result: Result = { success: false, error: "エラーが発生しました" }

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

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("ユーザーが見つかりません")
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("facility_id")
      .eq("id", user.id)
      .single()

    if (profileError) {
      throw profileError
    }

    const { data: patientFaces, error: faceError } = await supabase
      .from("patient_faces")
      .select("patient_id")
      .eq("face_id", faceId)
      .single()

    if (faceError) {
      throw faceError
    }

    const { data, error } = await supabase
      .from("patients")
      .select("id, last_name, first_name")
      .eq("facility_id", profile.facility_id)
      .eq("id", patientFaces.patient_id)
      .single()

    if (error) {
      throw error
    }

    if (!data) {
      throw new Error("一致する患者が見つかりません")
    }

    result = {
      success: true,
      message: "服薬者の顔認証完了",
      data,
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("There are no faces in the image")) {
        result = { success: false, error: "画像内に顔が見つかりません" }
      } else {
        result = { success: false, error: error.message }
      }
    }
  }

  return result
}
