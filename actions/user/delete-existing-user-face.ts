"use server"

import { SupabaseClient } from "@supabase/supabase-js"

import { Database } from "@/types/schema.gen"
import { deleteFace, deleteImage } from "@/lib/aws/utils"

export async function deleteExistingUserFace(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<void> {
  const { data: userFaces, error: facesError } = await supabase
    .from("user_faces")
    .select("id, face_id, image_id")
    .eq("user_id", userId)

  if (facesError) {
    throw new Error("顔情報の取得に失敗しました")
  }

  if (!userFaces.length) {
    return
  }

  const userFaceIds = userFaces.map((userFace) => userFace.face_id)
  const userImageIds = userFaces.map((userFace) => userFace.image_id)

  await deleteFace(process.env.USER_FACES_BUCKET ?? "", userFaceIds)
  await deleteImage(userImageIds, process.env.USER_FACES_BUCKET ?? "")

  const { error: userFacesError } = await supabase
    .from("user_faces")
    .delete()
    .in(
      "id",
      userFaces.map((userFace) => userFace.id)
    )
  if (userFacesError) {
    throw new Error("顔情報の削除に失敗しました")
  }
}
