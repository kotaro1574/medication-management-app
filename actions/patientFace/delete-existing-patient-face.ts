"use server"

import { SupabaseClient } from "@supabase/supabase-js"

import { Database } from "@/types/schema.gen"
import { deleteFace, deleteImage } from "@/lib/aws/utils"

export async function deleteExistingPatientFace(
  supabase: SupabaseClient<Database>,
  patientId: string
): Promise<void> {
  const { data: patientFaces, error: facesError } = await supabase
    .from("patient_faces")
    .select("id, face_id, image_id")
    .eq("patient_id", patientId)

  if (facesError) {
    throw new Error("顔情報の取得に失敗しました")
  }

  const patientFaceIds = patientFaces.map((patientFace) => patientFace.face_id)
  const patientImageIds = patientFaces.map(
    (patientFace) => patientFace.image_id
  )

  await deleteFace(process.env.PATIENT_FACES_BUCKET ?? "", patientFaceIds)
  await deleteImage(patientImageIds, process.env.PATIENT_FACES_BUCKET ?? "")

  const { error: patientFacesError } = await supabase
    .from("patient_faces")
    .delete()
    .in(
      "id",
      patientFaces.map((patientFace) => patientFace.id)
    )
  if (patientFacesError) {
    throw new Error("顔情報の削除に失敗しました")
  }
}
