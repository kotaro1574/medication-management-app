"use server"

import { revalidatePath } from "next/cache"

import { ActionResult } from "@/types/action"
import { createClient } from "@/lib/supabase/server"

type Props = {
  name: string
  email: string
}

export async function updateUser({
  name,
  email,
}: Props): Promise<ActionResult> {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("ユーザーが見つかりません")
    }

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

    if (email !== user.email) {
      const { error: emailError } = await supabase.auth.updateUser({ email })

      if (emailError) {
        throw new Error(
          `メールアドレスの更新時にエラーが発生しました: ${emailError.message}`
        )
      }
    }

    revalidatePath("/", "layout")
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
  }
  return { success: true, message: "ユーザー情報を更新しました" }
}
