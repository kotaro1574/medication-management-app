"use server"

import { ActionResult } from "@/types/action"
import { createClient } from "@/lib/supabase/server"

type Props = {
  name: string
  facilityId: string
}

export async function createGroup({
  name,
  facilityId,
}: Props): Promise<ActionResult> {
  try {
    const supabase = createClient()
    const { error } = await supabase.from("groups").insert({
      name,
      facility_id: facilityId,
    })

    if (error) {
      throw new Error(
        `グループの作成時にエラーが発生しました: ${error.message}`
      )
    }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
  }
  return { success: true, message: "グループを作成しました" }
}
