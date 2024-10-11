"use server"

import { revalidatePath } from "next/cache"

import { ActionResult } from "@/types/action"
import { Database } from "@/types/schema.gen"
import { createClient } from "@/lib/supabase/server"

type Props = Database["public"]["Tables"]["facilities"]["Insert"]

export async function createFacility({
  name_jp,
  name_en,
  email,
  plan,
}: Props): Promise<ActionResult> {
  try {
    const supabase = createClient()
    const { error } = await supabase.from("facilities").insert({
      name_jp,
      name_en,
      email,
      plan,
    })

    if (error) {
      throw new Error(`施設の作成時にエラーが発生しました: ${error.message}`)
    }

    revalidatePath("/facilities")
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
  }
  return { success: true, message: "施設を作成しました" }
}
