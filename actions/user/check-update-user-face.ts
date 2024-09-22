"use server"

import { SupabaseClient } from "@supabase/supabase-js"

import { Database } from "@/types/schema.gen"
import { checkFaceImageExists, deleteImage } from "@/lib/aws/utils"

export async function checkUpdateUserFace(
  supabase: SupabaseClient<Database>,
  userId: string,
  facilityId: string,
  faceImageIds: string[]
) {
  try {
    const checkUserFacePromises = faceImageIds.map(async (faceImageId) => {
      const faceId = await checkFaceImageExists(
        faceImageId,
        process.env.USER_FACES_BUCKET ?? ""
      )

      if (!faceId) return

      const { data: userFace, error: userFaceError } = await supabase
        .from("user_faces")
        .select("user_id")
        .eq("face_id", faceId)
        .single()

      if (userFaceError) {
        throw new Error("ユーザーの顔情報の取得に失敗しました")
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, name")
        .eq("facility_id", facilityId)
        .eq("id", userFace.user_id)
        .single()

      if (profileError) return

      if (profile.id !== userId) {
        throw new Error(`同じ顔データが既に登録されています。: ${profile.name}`)
      }
    })

    await Promise.all(checkUserFacePromises)
  } catch (error) {
    await deleteImage(faceImageIds, process.env.USER_FACES_BUCKET ?? "")
    if (error instanceof Error) {
      throw new Error(error.message)
    }
  }
}
