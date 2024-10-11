"use server"

import { revalidatePath } from "next/cache"

import { ActionResult } from "@/types/action"
import { Database } from "@/types/schema.gen"
import { createClient } from "@/lib/supabase/server"

type Props = Database["public"]["Tables"]["facilities"]["Update"]

export async function updateFacility({
  id,
  name_jp,
  name_en,
  email,
  plan,
}: Props): Promise<ActionResult> {
  try {
    if (!id) {
      throw new Error("施設のIDが見つかりません")
    }
    const supabase = createClient()

    const { error } = await supabase
      .from("facilities")
      .update({
        name_jp,
        name_en,
        email,
        plan,
      })
      .eq("id", id)

    if (error) {
      throw new Error(`施設の更新時にエラーが発生しました: ${error.message}`)
    }

    revalidatePath("/facilities")
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
  }
  return { success: true, message: "施設を更新しました" }
}
