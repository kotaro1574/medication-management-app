"use server"

import { SupabaseClient, User } from "@supabase/supabase-js"

import { Database } from "@/types/schema.gen"

export async function getUser(
  supabase: SupabaseClient<Database>
): Promise<User> {
  const { data } = await supabase.auth.getUser()
  const user = data?.user
  if (!user) {
    throw new Error("ユーザー情報の取得に失敗しました")
  }
  return user
}
