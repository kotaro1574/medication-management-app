"use server"

import { revalidatePath } from "next/cache"
import { SupabaseClient } from "@supabase/supabase-js"

import { Database } from "@/types/schema.gen"
import {
  IndexFaces,
  checkFaceImageExists,
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
  alerts: {
    name: string
    hour: string
    minute: string
    repeatStetting: string | null
    date: Date | null
    isAlertEnabled: boolean
  }[]
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
    throw new Error(
      `プロフィールデータの取得時にエラーが発生しました: ${error.message}`
    )
  }
  return profile.facility_id
}

async function insertPatient(
  supabase: SupabaseClient<Database>,
  patientData: Database["public"]["Tables"]["patients"]["Insert"]
): Promise<string> {
  const { data: patient, error } = await supabase
    .from("patients")
    .insert(patientData)
    .select("id")
    .single()
  if (error) {
    throw new Error(
      `患者データの挿入時にエラーが発生しました: ${error.message}`
    )
  }
  return patient.id
}

async function insertFaces(
  supabase: SupabaseClient<Database>,
  faces: { faceId: string; imageId: string }[],
  patientId: string
): Promise<void> {
  const { error } = await supabase.from("faces").insert(
    faces.map((face) => ({
      patient_id: patientId,
      face_id: face.faceId,
      image_id: face.imageId,
    }))
  )
  if (error) {
    throw new Error(`顔データの挿入時にエラーが発生しました: ${error.message}`)
  }
}

async function insertAlerts(
  supabase: SupabaseClient<Database>,
  alertsData: Database["public"]["Tables"]["alerts"]["Insert"][]
): Promise<void> {
  const { error } = await supabase.from("alerts").insert(alertsData)
  if (error) {
    throw new Error(
      `アラートデータの挿入時にエラーが発生しました: ${error.message}`
    )
  }
}

type Result =
  | {
      success: true
      message: string
      patientId: string
    }
  | {
      success: false
      error: string
    }

export async function createPatient({
  formData,
  lastName,
  firstName,
  birthday,
  careLevel,
  disabilityClassification,
  groupId,
  gender,
  alerts,
}: Props): Promise<Result> {
  try {
    //無意味
    const faceImages = formData.getAll("faceImages") as File[]

    const faceImageIds = await uploadFaceImage(
      faceImages,
      process.env.FACES_BUCKET ?? ""
    )

    const promises = faceImageIds.map(async (faceImageId) => {
      const faceId = await checkFaceImageExists(
        faceImageId,
        process.env.FACES_BUCKET ?? ""
      )

      if (!faceId) return

      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("ユーザーが見つかりません")
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("facility_id")
        .eq("id", user.id)
        .single()

      const { data: face } = await supabase
        .from("faces")
        .select("patient_id")
        .eq("face_id", faceId)
        .single()

      if (!profile || !face) return

      const { data } = await supabase
        .from("patients")
        .select("id, last_name, first_name")
        .eq("facility_id", profile.facility_id)
        .eq("id", face.patient_id)
        .single()

      if (data) {
        await deleteImage([faceImageId], process.env.FACES_BUCKET ?? "")
        throw new Error(
          `同じ顔データが既に登録されています。: ${data.last_name} ${data.first_name}`
        )
      }
    })

    await Promise.all(promises)

    const faces = await IndexFaces(faceImageIds, process.env.FACES_BUCKET ?? "")
    const faceIds = faces.map((face) => face.faceId)

    const supabase = createClient()
    const userId = await getUser(supabase)
    const facilityId = await getProfile(supabase, userId)

    const patientId = await insertPatient(supabase, {
      last_name: lastName,
      first_name: firstName,
      image_id: faceImageIds[0],
      face_ids: faceIds,
      birthday,
      care_level: careLevel,
      disability_classification: disabilityClassification,
      group_id: groupId,
      facility_id: facilityId,
      gender,
    })

    await insertFaces(supabase, faces, patientId)

    const alertsData = alerts.map((alert) => ({
      name: alert.name,
      patient_id: patientId,
      hour: Number(alert.hour),
      minute: Number(alert.minute),
      repeat_setting: alert.repeatStetting,
      date: alert.date?.toISOString() ?? null,
      is_alert_enabled: alert.isAlertEnabled,
    }))

    await insertAlerts(supabase, alertsData)
    revalidatePath("/patients", "page")
    return { success: true, message: "患者が作成されました", patientId }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    // その他のエラーケースに対応
    return { success: false, error: "不明なエラーが発生しました。" }
  }
}
