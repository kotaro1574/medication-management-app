"use server"

import { SupabaseClient } from "@supabase/supabase-js"

import { Database } from "@/types/schema.gen"
import {
  IndexFaces,
  deleteFace,
  deleteImage,
  uploadImages,
} from "@/lib/aws/utils"

import { deleteExistingPatientFace } from "../patientFace/delete-existing-patient-face"
import { checkUpdatePatientFace } from "./check-update-patient-face"

export async function updatePatientFace(
  supabase: SupabaseClient<Database>,
  patientId: string,
  facilityId: string,
  faceImages: File[]
): Promise<void> {
  const faceImageIds = await uploadImages(
    faceImages,
    process.env.PATIENT_FACES_BUCKET ?? ""
  )

  await checkUpdatePatientFace(supabase, patientId, facilityId, faceImageIds)

  const newFaces = await IndexFaces(
    faceImageIds,
    process.env.PATIENT_FACES_BUCKET ?? ""
  )

  await deleteExistingPatientFace(supabase, patientId)

  const { error: patientsError } = await supabase
    .from("patients")
    .update({
      image_id: faceImageIds[0],
    })
    .eq("id", patientId)

  if (patientsError) {
    throw new Error("患者の更新に失敗しました")
  }

  const { error: faceError } = await supabase.from("patient_faces").insert(
    newFaces.map((face) => ({
      patient_id: patientId,
      face_id: face.faceId,
      image_id: face.imageId,
    }))
  )

  if (faceError) {
    const newFaceIds = newFaces.map((face) => face.faceId)
    await deleteImage(faceImageIds, process.env.PATIENT_FACES_BUCKET ?? "")
    await deleteFace(process.env.PATIENT_FACES_BUCKET ?? "", newFaceIds)
    throw new Error("新しい顔情報の挿入に失敗しました")
  }
}
