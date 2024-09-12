"use server"

import { revalidatePath } from "next/cache"

import { Database } from "@/types/schema.gen"
import { IndexFaces, uploadImages } from "@/lib/aws/utils"
import { createClient } from "@/lib/supabase/server"

import { insertAlert } from "../alert/insert-alert"
import { insertPatientFace } from "../patientFace/insert-patient-face"
import { getProfile } from "../profile/get-profile"
import { getUser } from "../user/get-user"
import { checkPatientFace } from "./check-patient-face"
import { insertPatient } from "./insert-patient"

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
    const supabase = createClient()
    const faceImages = formData.getAll("faceImages") as File[]

    // s3に顔画像をアップロード
    const faceImageIds = await uploadImages(
      faceImages,
      process.env.PATIENT_FACES_BUCKET ?? ""
    )

    // 顔画像が既に登録されている患者がいないかチェック
    await checkPatientFace(supabase, faceImageIds)

    // チェックがOKなら顔情報をRekognitionに登録
    const faces = await IndexFaces(
      faceImageIds,
      process.env.PATIENT_FACES_BUCKET ?? ""
    )

    const user = await getUser(supabase)
    const { facility_id } = await getProfile(supabase, user.id)

    // 患者情報を登録
    const patient = await insertPatient(supabase, {
      last_name: lastName,
      first_name: firstName,
      image_id: faceImageIds[0],
      birthday,
      care_level: careLevel,
      disability_classification: disabilityClassification,
      group_id: groupId,
      facility_id: facility_id ?? "",
      gender,
    })

    const patientId = patient.id ?? ""

    // 患者の顔情報を登録
    const insertPatientFacesPromise = faces.map(async (face) => {
      await insertPatientFace(supabase, face, patientId)
    })
    await Promise.all(insertPatientFacesPromise)

    // アラートを登録
    const insertAlertsPromise = alerts.map(async (_alert) => {
      const alert = {
        name: _alert.name,
        patient_id: patientId,
        hour: Number(_alert.hour),
        minute: Number(_alert.minute),
        repeat_setting: _alert.repeatStetting,
        date: _alert.date?.toISOString() ?? null,
        is_alert_enabled: _alert.isAlertEnabled,
      }
      await insertAlert(supabase, alert)
    })
    await Promise.all(insertAlertsPromise)

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
