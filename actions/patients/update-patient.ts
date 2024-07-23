"use server"

import { revalidatePath } from "next/cache"
import { SupabaseClient } from "@supabase/supabase-js"

import { ActionResult } from "@/types/action"
import { Database } from "@/types/schema.gen"
import {
  IndexFaces,
  deleteFace,
  deleteImage,
  uploadFaceImage,
} from "@/lib/aws/utils"
import { createClient } from "@/lib/supabase/server"

type Props = {
  formData: FormData
  lastName: string
  firstName: string
  birthday: string
  careLevel: Database["public"]["Enums"]["care_level_enum"]
  disabilityClassification: Database["public"]["Enums"]["disability_classification_enum"]
  groupId: string
  gender: Database["public"]["Enums"]["gender_enum"]
  patientId: string
  deleteDrugIds: string[]
}

async function getUser(supabase: SupabaseClient<Database>): Promise<string> {
  const { data } = await supabase.auth.getUser()
  const userId = data?.user?.id
  if (!userId) {
    throw new Error("ユーザー情報の取得に失敗しました")
  }
  return userId
}

async function getProfile(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<string> {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("facility_id")
    .eq("id", userId)
    .single()
  if (error) {
    throw new Error("施設情報の取得に失敗しました")
  }
  return profile.facility_id
}

async function updatePatientInfo(
  supabase: SupabaseClient<Database>,
  patientId: string,
  updates: Partial<Database["public"]["Tables"]["patients"]["Row"]>
): Promise<void> {
  const { error } = await supabase
    .from("patients")
    .update(updates)
    .eq("id", patientId)
  if (error) {
    throw new Error("患者の更新に失敗しました")
  }
}

async function handleFaceImages(
  supabase: SupabaseClient<Database>,
  patientId: string,
  faceImages: File[]
): Promise<void> {
  const { data: faces, error: facesError } = await supabase
    .from("faces")
    .select("id, face_id, image_id")
    .eq("patient_id", patientId)

  if (facesError) {
    throw new Error("顔情報の取得に失敗しました")
  }

  const faceIds = faces.map((face) => face.face_id)
  const imageIds = faces.map((face) => face.image_id)

  await deleteFace(process.env.FACES_BUCKET ?? "", faceIds)
  await deleteImage(imageIds, process.env.FACES_BUCKET ?? "")

  const { error } = await supabase
    .from("faces")
    .delete()
    .in(
      "id",
      faces.map((face) => face.id)
    )
  if (error) {
    throw new Error("顔情報の削除に失敗しました")
  }

  const faceImageIds = await uploadFaceImage(faceImages)
  const newFaces = await IndexFaces(
    faceImageIds,
    process.env.FACES_BUCKET ?? ""
  )
  const newFaceIds = newFaces.map((face) => face.faceId)

  await updatePatientInfo(supabase, patientId, {
    image_id: faceImageIds[0],
    face_ids: newFaceIds,
  })

  const { error: faceError } = await supabase.from("faces").insert(
    newFaces.map((face) => ({
      patient_id: patientId,
      face_id: face.faceId,
      image_id: face.imageId,
    }))
  )

  if (faceError) {
    await deleteImage(faceImageIds, process.env.FACES_BUCKET ?? "")
    await deleteFace(process.env.FACES_BUCKET ?? "", newFaceIds)
    throw new Error("新しい顔情報の挿入に失敗しました")
  }
}

async function deleteDrugs(
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

export async function updatePatient({
  patientId,
  formData,
  lastName,
  firstName,
  birthday,
  careLevel,
  disabilityClassification,
  groupId,
  gender,
  deleteDrugIds,
}: Props): Promise<ActionResult> {
  try {
    const faceImages = formData.getAll("faceImages") as File[]

    const supabase = createClient()
    const userId = await getUser(supabase)
    const facilityId = await getProfile(supabase, userId)

    await updatePatientInfo(supabase, patientId, {
      last_name: lastName,
      first_name: firstName,
      birthday,
      care_level: careLevel,
      disability_classification: disabilityClassification,
      group_id: groupId,
      facility_id: facilityId,
      gender,
    })

    if (faceImages.length > 0) {
      await handleFaceImages(supabase, patientId, faceImages)
    }

    if (deleteDrugIds.length > 0) {
      await deleteDrugs(supabase, deleteDrugIds)
    }

    revalidatePath("/patients", "page")
    revalidatePath("/patients/[id]", "page")
    revalidatePath("/patients/[id]/edit", "page")
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
  }
  return { success: true, message: "患者を編集しました" }
}
