"use server"

import { revalidatePath } from "next/cache"
import { SupabaseClient } from "@supabase/supabase-js"
import { v4 as uuidv4 } from "uuid"

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
  alerts: {
    id: string | null
    name: string
    hour: string
    minute: string
    repeatStetting: string | null
    date: Date | null
    isAlertEnabled: boolean
  }[]
  deleteAlertIds: string[]
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

  const { error } = await supabase
    .from("patient_faces")
    .delete()
    .in(
      "id",
      patientFaces.map((patientFace) => patientFace.id)
    )
  if (error) {
    throw new Error("顔情報の削除に失敗しました")
  }

  const faceImageIds = await uploadFaceImage(
    faceImages,
    process.env.PATIENT_FACES_BUCKET ?? ""
  )
  const newFaces = await IndexFaces(
    faceImageIds,
    process.env.PATIENT_FACES_BUCKET ?? ""
  )
  const newFaceIds = newFaces.map((face) => face.faceId)

  await updatePatientInfo(supabase, patientId, {
    image_id: faceImageIds[0],
    face_ids: newFaceIds,
  })

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

async function updateAlerts(
  supabase: SupabaseClient<Database>,
  alertsData: Database["public"]["Tables"]["alerts"]["Insert"][]
): Promise<void> {
  const { error } = await supabase.from("alerts").upsert(alertsData)
  if (error) {
    throw new Error(
      `アラートデータの更新時にエラーが発生しました: ${error.message}`
    )
  }
}

async function deleteAlerts(
  supabase: SupabaseClient<Database>,
  deleteAlertIds: string[]
): Promise<void> {
  const { error } = await supabase
    .from("alerts")
    .delete()
    .in("id", deleteAlertIds)
  if (error) {
    throw new Error("アラートの削除に失敗しました")
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
  alerts,
  deleteAlertIds,
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

    await updateAlerts(
      supabase,
      alerts.map((alert) => ({
        id: alert.id ?? uuidv4(),
        name: alert.name,
        patient_id: patientId,
        hour: Number(alert.hour),
        minute: Number(alert.minute),
        repeat_setting: alert.repeatStetting,
        date: alert.date?.toISOString() ?? null,
        is_alert_enabled: alert.isAlertEnabled,
      }))
    )

    if (faceImages.length > 0) {
      await handleFaceImages(supabase, patientId, faceImages)
    }

    if (deleteDrugIds.length > 0) {
      await deleteDrugs(supabase, deleteDrugIds)
    }

    if (deleteAlertIds.length > 0) {
      await deleteAlerts(supabase, deleteAlertIds)
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
