"use server"

import { revalidatePath } from "next/cache"

import { ActionResult } from "@/types/action"
import { createClient } from "@/lib/supabase/server"

export async function deleteGroup({
  id,
}: {
  id: string
}): Promise<ActionResult> {
  try {
    const supabase = createClient()
    const { error } = await supabase.from("groups").delete().eq("id", id)

    if (error) {
      if (
        error.message ===
        `update or delete on table "groups" violates foreign key constraint "fk_group" on table "patients"`
      ) {
        throw new Error("グループに所属している患者がいるため削除できません")
      }
      throw new Error(error.message)
    }

    revalidatePath("/groups")
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
  }
  return { success: true, message: "グループを削除しました" }
}
