"use server"

import { SupabaseClient } from "@supabase/supabase-js"

import { Database } from "@/types/schema.gen"
import {
  IndexFaces,
  deleteFace,
  deleteImage,
  uploadImages,
} from "@/lib/aws/utils"

import { deleteExistingUserFace } from "./delete-existing-user-face"

export async function updateUserFace(
  supabase: SupabaseClient<Database>,
  userId: string,
  faceImages: File[]
): Promise<void> {
  const faceImageIds = await uploadImages(
    faceImages,
    process.env.USER_FACES_BUCKET ?? ""
  )

  // TODO: checkUpdateUserFaceの実装

  const newFaces = await IndexFaces(
    faceImageIds,
    process.env.USER_FACES_BUCKET ?? ""
  )

  await deleteExistingUserFace(supabase, userId)

  const { error } = await supabase
    .from("profiles")
    .update({
      image_id: faceImageIds[0],
    })
    .eq("id", userId)

  if (error) {
    throw new Error(
      `ユーザー情報の更新時にエラーが発生しました: ${error.message}`
    )
  }

  const { error: userFaceError } = await supabase.from("user_faces").insert(
    newFaces.map((face) => ({
      user_id: userId,
      face_id: face.faceId,
      image_id: face.imageId,
    }))
  )

  if (userFaceError) {
    await deleteImage(faceImageIds, process.env.USER_FACES_BUCKET ?? "")
    await deleteFace(
      process.env.USER_FACES_BUCKET ?? "",
      newFaces.map((face) => face.faceId)
    )
    throw new Error(
      `ユーザーの顔情報の挿入時にエラーが発生しました: ${userFaceError.message}`
    )
  }
}
