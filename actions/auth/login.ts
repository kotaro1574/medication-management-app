"use server"

import { cookies } from "next/headers"

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

export async function login({
  email,
  password,
}: {
  email: string
  password: string
}): Promise<Result> {
  try {
    const supabase = createClient()

    const { data: userData, error: userError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      })

    if (userError) {
      return { success: false, error: userError.message }
    }

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userData.user?.id ?? "")
      .single()

    if (profileError) {
      return { success: false, error: profileError.message }
    }

    cookies().set(
      `login-info-${userData.user.id}`,
      JSON.stringify({ name: profileData.name, email, password }),
      {
        path: "/",
        httpOnly: true,
        secure: true,
        maxAge: 20 * 60 * 60, // 20 hours in seconds
      }
    )
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
  }
  return { success: true, message: "ログイン完了" }
}
