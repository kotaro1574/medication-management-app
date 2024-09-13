"use server"

import { SupabaseClient } from "@supabase/supabase-js"

import { Database } from "@/types/schema.gen"
import {
  IndexFaces,
  deleteFace,
  deleteImage,
  uploadImages,
} from "@/lib/aws/utils"

export async function updatePatientFace(
  supabase: SupabaseClient<Database>,
  patientId: string,
  faceImages: File[]
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

  const faceImageIds = await uploadImages(
    faceImages,
    process.env.PATIENT_FACES_BUCKET ?? ""
  )
  const newFaces = await IndexFaces(
    faceImageIds,
    process.env.PATIENT_FACES_BUCKET ?? ""
  )
  const newFaceIds = newFaces.map((face) => face.faceId)

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
    await deleteImage(faceImageIds, process.env.PATIENT_FACES_BUCKET ?? "")
    await deleteFace(process.env.PATIENT_FACES_BUCKET ?? "", newFaceIds)
    throw new Error("新しい顔情報の挿入に失敗しました")
  }
}
