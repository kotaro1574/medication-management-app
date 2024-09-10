"use server"

import { SearchFacesByImageCommand } from "@aws-sdk/client-rekognition"

import { rekognitionClient } from "@/lib/aws/aws-clients"
import { createClient } from "@/lib/supabase/server"

import { generateCustomToken } from "./generate-custom-token"

type Result =
  | {
      success: true
      message: string
      accessToken: string
      refreshToken: string
    }
  | {
      success: false
      error: string
    }

export async function faceLogin({
  imageSrc,
}: {
  imageSrc: string
}): Promise<Result> {
  let result: Result = { success: false, error: "エラーが発生しました" }
  // 顔認証処理
  try {
    const response = await rekognitionClient.send(
      new SearchFacesByImageCommand({
        CollectionId: process.env.USER_FACES_BUCKET,
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

    const { data: userFace, error: userFaceError } = await supabase
      .from("user_faces")
      .select("user_id")
      .eq("face_id", faceId)
      .single()

    if (userFaceError) {
      return { success: false, error: userFaceError.message }
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userFace.user_id)
      .single()

    if (profileError) {
      return { success: false, error: profileError.message }
    }

    const { accessToken, refreshToken } = await generateCustomToken(
      userFace.user_id
    )

    if (!accessToken || !refreshToken) {
      return { success: false, error: "トークンの生成に失敗しました" }
    }

    return {
      success: true,
      message: "ログインしました",
      accessToken,
      refreshToken,
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

  return result
}
