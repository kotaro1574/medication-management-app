"use server"

import { SupabaseClient } from "@supabase/supabase-js"

import { Database } from "@/types/schema.gen"

export async function deleteAlerts(
  supabase: SupabaseClient<Database>,
  deleteAlertIds: string[]
): Promise<void> {
  const { error } = await supabase
    .from("alerts")
    .delete()
    .in("id", deleteAlertIds)
  if (error) {
    throw new Error("アラートの削除に失敗しました")
  }
}
