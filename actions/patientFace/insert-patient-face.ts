"use server"

import { SupabaseClient } from "@supabase/supabase-js"

import { Database } from "@/types/schema.gen"

export async function insertPatientFace(
  supabase: SupabaseClient<Database>,
  face: { faceId: string; imageId: string },
  patientId: string
): Promise<void> {
  const { error } = await supabase.from("patient_faces").insert({
    patient_id: patientId,
    face_id: face.faceId,
    image_id: face.imageId,
  })

  if (error) {
    throw new Error(`顔データの挿入時にエラーが発生しました: ${error.message}`)
  }
}
