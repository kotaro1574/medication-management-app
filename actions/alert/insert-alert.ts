"use server"

import { SupabaseClient } from "@supabase/supabase-js"

import { Database } from "@/types/schema.gen"

export async function insertAlert(
  supabase: SupabaseClient<Database>,
  alert: Database["public"]["Tables"]["alerts"]["Insert"]
): Promise<void> {
  const { error } = await supabase.from("alerts").insert(alert)

  if (error) {
    throw new Error(
      `アラートデータの挿入時にエラーが発生しました: ${error.message}`
    )
  }
}
