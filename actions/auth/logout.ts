"use server"

import { createClient } from "@/lib/supabase/server"

type Result =
  | {
      success: true
      message: string
    }
  | {
      success: false
      error: string
    }

export async function logout(): Promise<Result> {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      await supabase.auth.signOut()
    }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
  }
  return { success: true, message: "ログアウトしました" }
}
