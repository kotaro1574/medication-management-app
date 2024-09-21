"use server"

import { revalidatePath } from "next/cache"

import { ActionResult } from "@/types/action"
import { createClient } from "@/lib/supabase/server"

import { setLoginInfo } from "../cookie/set-login-info"
import { getUser } from "./get-user"
import { updateUserFace } from "./update-user-face"

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
    const user = await getUser(supabase)

    const faceImages = formData.getAll("faceImages") as File[]

    if (faceImages.length > 0) {
      await updateUserFace(supabase, user.id, faceImages)
    }

    // TODO: nameの編集が必要なくなったら削除
    const { error } = await supabase
      .from("profiles")
      .update({
        name,
      })
      .eq("id", user.id)

    if (error) {
      throw new Error(
        `ユーザー情報の更新時にエラーが発生しました: ${error.message}`
      )
    }

    // TODO: 必要なくなったら削除
    await setLoginInfo({ id: user.id, name })

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
