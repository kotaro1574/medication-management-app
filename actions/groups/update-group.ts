"use server"

import { revalidatePath } from "next/cache"

import { ActionResult } from "@/types/action"
import { createClient } from "@/lib/supabase/server"

type Props = {
  name: string
  id: string
}

export async function updateGroup({ name, id }: Props): Promise<ActionResult> {
  try {
    const supabase = createClient()
    const { error } = await supabase
      .from("groups")
      .update({ name })
      .eq("id", id)

    if (error) {
      throw new Error(
        `グループの更新時にエラーが発生しました: ${error.message}`
      )
    }

    revalidatePath("/groups")
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
  }
  return { success: true, message: "グループを更新しました" }
}
