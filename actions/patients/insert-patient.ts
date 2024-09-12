"use server"

import { SupabaseClient } from "@supabase/supabase-js"

import { Database } from "@/types/schema.gen"

type PatientSelect = keyof Database["public"]["Tables"]["patients"]["Row"] | "*"

export async function insertPatient(
  supabase: SupabaseClient<Database>,
  patientData: Database["public"]["Tables"]["patients"]["Insert"],
  select: PatientSelect = "*"
): Promise<Partial<Database["public"]["Tables"]["patients"]["Row"]>> {
  const { data: patient, error } = await supabase
    .from("patients")
    .insert(patientData)
    .select(select)
    .single()

  if (error) {
    throw new Error(
      `患者データの挿入時にエラーが発生しました: ${error.message}`
    )
  }

  return patient
}
