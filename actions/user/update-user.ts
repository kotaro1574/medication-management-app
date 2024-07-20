"use server"

import { revalidatePath } from "next/cache"

import { ActionResult } from "@/types/action"
import { createClient } from "@/lib/supabase/server"

type Props = {
  id: string
  name: string
}

export async function updateUser({ id, name }: Props): Promise<ActionResult> {
  try {
    const supabase = createClient()
    const { error } = await supabase
      .from("profiles")
      .update({
        name,
      })
      .eq("id", id)

    if (error) {
      throw new Error(
        `ユーザー情報の更新時にエラーが発生しました: ${error.message}`
      )
    }

    revalidatePath("/", "layout")
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
  }
  return { success: true, message: "ユーザー情報を更新しました" }
}
