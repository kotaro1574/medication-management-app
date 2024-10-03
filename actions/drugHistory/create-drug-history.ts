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

export async function createDrugHistory({
  patientId,
  medicationAuthResult,
}: {
  patientId: string
  medicationAuthResult: Database["public"]["Enums"]["medication_auth_result_enum"]
}): Promise<ActionResult> {
  try {
    const supabase = createClient()
    const userId = await getUser(supabase)

    const { error } = await supabase.from("drug_histories").insert({
      patient_id: patientId,
      user_id: userId,
      medication_auth_result: medicationAuthResult,
    })

    if (error) {
      throw new Error(
        `服薬履歴の挿入時にエラーが発生しました: ${error.message}`
      )
    }

    revalidatePath("/patients", "page")
    revalidatePath("/patients/[id]", "page")
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
  }

  if (medicationAuthResult === "success") {
    return { success: true, message: "お薬認証が成功しました。" }
  } else if (medicationAuthResult === "skipped") {
    return { success: true, message: "お薬認証をスキップしました。" }
  } else {
    return {
      success: true,
      message: "お薬認証が失敗しました。はじめからやり直してください。",
    }
  }
}
