"use server"

import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"

import { ActionResult } from "@/types/action"
import { Database } from "@/types/schema.gen"
import { createClient } from "@/lib/supabase/server"

import { deleteAlerts } from "../alert/delete-alerts"
import { updateAlert } from "../alert/update-alert"
import { deleteDrugs } from "../drug/delete-drug"
import { getProfile } from "../profile/get-profile"
import { getUser } from "../user/get-user"
import { updatePatientFace } from "./update-patient-face"

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
    const user = await getUser(supabase)
    const { facility_id } = await getProfile(supabase, user.id, "facility_id")

    // 患者情報を更新
    const { error } = await supabase
      .from("patients")
      .update({
        last_name: lastName,
        first_name: firstName,
        birthday,
        care_level: careLevel,
        disability_classification: disabilityClassification,
        group_id: groupId,
        facility_id: facility_id,
        gender,
      })
      .eq("id", patientId)

    if (error) {
      throw new Error("患者の更新に失敗しました")
    }

    // アラート情報を更新
    const updateAlertsPromises = alerts.map(async (alert) => {
      updateAlert(supabase, {
        id: alert.id ?? uuidv4(),
        name: alert.name,
        patient_id: patientId,
        hour: Number(alert.hour),
        minute: Number(alert.minute),
        repeat_setting: alert.repeatStetting,
        date: alert.date?.toISOString() ?? null,
        is_alert_enabled: alert.isAlertEnabled,
      })
    })
    await Promise.all(updateAlertsPromises)

    // 顔画像の更新があれば更新
    if (faceImages.length > 0) {
      await updatePatientFace(supabase, patientId, faceImages)
    }

    // 削除対象の服用薬を削除
    if (deleteDrugIds.length > 0) {
      await deleteDrugs(supabase, deleteDrugIds)
    }

    // 削除対象のアラートを削除
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
