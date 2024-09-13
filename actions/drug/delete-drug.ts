"use server"

import { SupabaseClient } from "@supabase/supabase-js"

import { Database } from "@/types/schema.gen"
import { deleteImage } from "@/lib/aws/utils"

export async function deleteDrugs(
  supabase: SupabaseClient<Database>,
  deleteDrugIds: string[]
): Promise<void> {
  const { data: drugs, error: drugsError } = await supabase
    .from("drugs")
    .select("image_id")
    .in("id", deleteDrugIds)

  if (drugsError) {
    throw new Error("服用薬の取得に失敗しました")
  }

  const drugImageIds = drugs.map((drug) => drug.image_id)
  await deleteImage(drugImageIds, process.env.DRUGS_BUCKET ?? "")

  const { error: drugError } = await supabase
    .from("drugs")
    .delete()
    .in("id", deleteDrugIds)

  if (drugError) {
    throw new Error("服用薬の削除に失敗しました")
  }
}
