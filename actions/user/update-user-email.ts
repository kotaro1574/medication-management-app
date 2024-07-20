"use server"

import { ActionResult } from "@/types/action"
import { createClient } from "@/lib/supabase/server"

type Props = {
  email: string
}

export async function updateUserEmail({ email }: Props): Promise<ActionResult> {
  const supabase = createClient()

  const { error } = await supabase.auth.updateUser(
    { email },
    { emailRedirectTo: process.env.NEXT_PUBLIC_URL + "/user" }
  )

  if (error) {
    return { success: false, error: error.message }
  }
  return { success: true, message: "メールアドレスを更新しました" }
}
