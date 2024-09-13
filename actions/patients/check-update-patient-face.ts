"use server"

import { SupabaseClient } from "@supabase/supabase-js"

import { Database } from "@/types/schema.gen"
import { checkFaceImageExists, deleteImage } from "@/lib/aws/utils"

export async function checkUpdatePatientFace(
  supabase: SupabaseClient<Database>,
  patientId: string,
  facilityId: string,
  faceImageIds: string[]
) {
  const checkPatientFacePromises = faceImageIds.map(async (faceImageId) => {
    const faceId = await checkFaceImageExists(
      faceImageId,
      process.env.PATIENT_FACES_BUCKET ?? ""
    )

    if (!faceId) return

    const { data: patientFace, error: patientFaceError } = await supabase
      .from("patient_faces")
      .select("patient_id")
      .eq("face_id", faceId)
      .single()

    if (patientFaceError) {
      throw new Error("患者の顔情報の取得に失敗しました")
    }

    const { data: patient, error: patientError } = await supabase
      .from("patients")
      .select("id, last_name, first_name")
      .eq("facility_id", facilityId)
      .eq("id", patientFace.patient_id)
      .single()

    if (patientError) {
      throw new Error("患者の取得に失敗しました")
    }

    console.log(patient)

    if (patient.id !== patientId) {
      await deleteImage([faceImageId], process.env.PATIENT_FACES_BUCKET ?? "")
      throw new Error(
        `同じ顔データが既に登録されています。: ${patient.last_name} ${patient.first_name}`
      )
    }
  })

  await Promise.all(checkPatientFacePromises)
}
