"use server"

import { revalidatePath } from "next/cache"
import { SupabaseClient } from "@supabase/supabase-js"

import { ActionResult } from "@/types/action"
import { Database } from "@/types/schema.gen"
import { createClient } from "@/lib/supabase/server"

async function getUser(supabase: SupabaseClient<Database>): Promise<string> {
  const { data } = await supabase.auth.getUser()
  const userId = data?.user?.id
  if (!userId) {
    throw new Error("ユーザー情報の取得に失敗しました")
  }
  return userId
}

type Props = {
  drugImageIds: string[]
  patientId: string
}

export async function createDrug({
  drugImageIds,
  patientId,
}: Props): Promise<ActionResult> {
  try {
    const supabase = createClient()
    const userId = await getUser(supabase)

    const { error } = await supabase.from("drugs").insert(
      drugImageIds.map((drugImageId) => ({
        patient_id: patientId,
        image_id: drugImageId,
        user_id: userId,
      }))
    )

    if (error) {
      throw new Error(
        `服薬画像の挿入時にエラーが発生しました: ${error.message}`
      )
    }

    revalidatePath("/patients/[id]", "page")
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
  }
  return { success: true, message: "服薬画像の登録が完了しました" }
}
