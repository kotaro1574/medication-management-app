"use server"

import { SupabaseClient } from "@supabase/supabase-js"

import { Database } from "@/types/schema.gen"
import { checkFaceImageExists, deleteImage } from "@/lib/aws/utils"

import { getUser } from "../user/get-user"
import { getProfile } from "../user/profile/get-profile"

export async function checkPatientFace(
  supabase: SupabaseClient<Database>,
  faceImageIds: string[]
): Promise<void> {
  try {
    const checkPatientFacePromises = faceImageIds.map(async (faceImageId) => {
      const faceId = await checkFaceImageExists(
        faceImageId,
        process.env.PATIENT_FACES_BUCKET ?? ""
      )

      if (!faceId) return

      const user = await getUser(supabase)

      const { facility_id } = await getProfile(supabase, user.id)

      const { data: patientFaces } = await supabase
        .from("patient_faces")
        .select("patient_id")
        .eq("face_id", faceId)
        .single()

      if (!facility_id || !patientFaces) return

      const { data } = await supabase
        .from("patients")
        .select("id, last_name, first_name")
        .eq("facility_id", facility_id)
        .eq("id", patientFaces.patient_id)
        .single()

      if (data) {
        throw new Error(
          `同じ顔データが既に登録されています。: ${data.last_name} ${data.first_name}`
        )
      }
    })

    await Promise.all(checkPatientFacePromises)
  } catch (error) {
    await deleteImage(faceImageIds, process.env.PATIENT_FACES_BUCKET ?? "")
    if (error instanceof Error) {
      throw new Error(error.message)
    }
  }
}
