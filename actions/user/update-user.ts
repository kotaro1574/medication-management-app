"use server"

import { revalidatePath } from "next/cache"

import { ActionResult } from "@/types/action"
import {
  IndexFaces,
  deleteFace,
  deleteImage,
  uploadFaceImage,
} from "@/lib/aws/utils"
import { createClient } from "@/lib/supabase/server"

import { setLoginInfo } from "../cookie/set-login-info"

type Props = {
  name: string
  email: string
  formData: FormData
}

export async function updateUser({
  name,
  email,
  formData,
}: Props): Promise<ActionResult> {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("ユーザーが見つかりません")
    }

    const faceImages = formData.getAll("faceImages") as File[]

    const { data: userFaces, error: userFacesError } = await supabase
      .from("user_faces")
      .select("*")
      .eq("user_id", user.id)

    if (userFacesError) {
      throw new Error(
        `ユーザーの顔情報の取得時にエラーが発生しました: ${userFacesError.message}`
      )
    }

    const faceIds = userFaces.map((userFace) => userFace.face_id)
    const imageIds = userFaces.map((userFace) => userFace.image_id)

    await deleteFace(process.env.USER_FACES_BUCKET ?? "", faceIds)
    await deleteImage(imageIds, process.env.USER_FACES_BUCKET ?? "")

    const { error: deleteUserFaceError } = await supabase
      .from("user_faces")
      .delete()
      .in(
        "id",
        userFaces.map((userFace) => userFace.id)
      )

    if (deleteUserFaceError) {
      throw new Error(
        `ユーザーの顔情報の削除時にエラーが発生しました: ${deleteUserFaceError.message}`
      )
    }

    const userFaceImageIds = await uploadFaceImage(
      faceImages,
      process.env.USER_FACES_BUCKET ?? ""
    )

    const newFaces = await IndexFaces(
      userFaceImageIds,
      process.env.USER_FACES_BUCKET ?? ""
    )

    const { error } = await supabase
      .from("profiles")
      .update({
        name,
        image_id: userFaceImageIds[0],
      })
      .eq("id", user.id)

    if (error) {
      throw new Error(
        `ユーザー情報の更新時にエラーが発生しました: ${error.message}`
      )
    }

    await setLoginInfo({ id: user.id, name })

    const { error: userFaceError } = await supabase.from("user_faces").insert(
      newFaces.map((face) => ({
        user_id: user.id,
        face_id: face.faceId,
        image_id: face.imageId,
      }))
    )

    if (userFaceError) {
      await deleteImage(userFaceImageIds, process.env.USER_FACES_BUCKET ?? "")
      await deleteFace(
        process.env.USER_FACES_BUCKET ?? "",
        newFaces.map((face) => face.faceId)
      )
      throw new Error(
        `ユーザーの顔情報の挿入時にエラーが発生しました: ${userFaceError.message}`
      )
    }

    if (email !== user.email) {
      const { error: emailError } = await supabase.auth.updateUser(
        { email },
        { emailRedirectTo: process.env.NEXT_PUBLIC_URL + "/user" }
      )

      if (emailError) {
        throw new Error(
          `メールアドレスの更新時にエラーが発生しました: ${emailError.message}`
        )
      }

      return { success: true, message: "メールが送信されました。" }
    }

    revalidatePath("/", "layout")
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
  }
  return { success: true, message: "ユーザー情報を更新しました" }
}
