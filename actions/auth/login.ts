"use server"

import { cookies } from "next/headers"

import { createClient } from "@/lib/supabase/server"

import { setLoginInfo } from "../cookie/set-login-info"

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
  id,
  password,
}: {
  id: string
  password: string
}): Promise<Result> {
  try {
    const supabase = createClient()

    const { data: userData, error: userError } =
      await supabase.auth.signInWithPassword({
        email: `${id}@example.com`,
        password,
      })

    if (userError) {
      return { success: false, error: userError.message }
    }

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", userData.user.id)
      .single()

    if (profileError) {
      return { success: false, error: profileError.message }
    }

    await setLoginInfo({
      id,
      name: profileData.name,
      password,
    })
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
  }
  return { success: true, message: "ログイン完了" }
}
