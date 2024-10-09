"use server"

import { revalidatePath } from "next/cache"

import { ActionResult } from "@/types/action"
import { createClient } from "@/lib/supabase/server"

export async function deleteFacility({
  id,
}: {
  id: string
}): Promise<ActionResult> {
  try {
    const supabase = createClient()
    const { error } = await supabase.from("facilities").delete().eq("id", id)

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath("/facilities")
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
  }
  return { success: true, message: "施設を削除しました" }
}
