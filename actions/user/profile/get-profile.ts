"use server"

import { SupabaseClient } from "@supabase/supabase-js"

import { Database } from "@/types/schema.gen"

type ProfileSelect = keyof Database["public"]["Tables"]["profiles"]["Row"] | "*"

export async function getProfile(
  supabase: SupabaseClient<Database>,
  userId: string,
  select: ProfileSelect = "*"
): Promise<Partial<Database["public"]["Tables"]["profiles"]["Row"]>> {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select(select)
    .eq("id", userId)
    .single()

  if (error) {
    throw new Error(
      `プロフィールデータの取得時にエラーが発生しました: ${error.message}`
    )
  }

  return profile
}
