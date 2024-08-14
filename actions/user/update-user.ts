"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

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
      console.log("email", email)
      const { error: emailError } = await supabase.auth.updateUser(
        { email },
        { emailRedirectTo: process.env.NEXT_PUBLIC_URL + "/user" }
      )

      const currentPassword = JSON.parse(
        cookies().get(`login-info-${user.id}`)?.value ?? ""
      ).password

      console.log("currentPassword", currentPassword)

      cookies().set(
        `login-info-${user.id}`,
        JSON.stringify({ name, email, password: currentPassword }),
        {
          httpOnly: true,
          secure: true,
          maxAge: 20 * 60 * 60, // 20 hours in seconds
        }
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
