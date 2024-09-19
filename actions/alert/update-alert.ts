"use server"

import { SupabaseClient } from "@supabase/supabase-js"

import { Database } from "@/types/schema.gen"

export async function updateAlert(
  supabase: SupabaseClient<Database>,
  alertsData: Database["public"]["Tables"]["alerts"]["Insert"]
): Promise<void> {
  const { error } = await supabase.from("alerts").upsert(alertsData)
  if (error) {
    throw new Error(
      `アラートデータの更新時にエラーが発生しました: ${error.message}`
    )
  }
}
