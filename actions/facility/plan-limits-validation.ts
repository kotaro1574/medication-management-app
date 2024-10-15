"use server"

import { PLAN_LIMITS } from "@/lib/constants/plan-limits"
import { createClient } from "@/lib/supabase/server"

type Props = {
  facilityId: string
  plan: string
}

export async function planLimitsValidation({ facilityId, plan }: Props) {
  try {
    const planLimits = PLAN_LIMITS[plan]

    const supabase = createClient()

    const { data: patients, error: patientsError } = await supabase
      .from("patients")
      .select("id")
      .eq("facility_id", facilityId)

    if (patientsError) {
      throw new Error(
        `施設の取得時にエラーが発生しました: ${patientsError.message}`
      )
    }

    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id")
      .eq("facility_id", facilityId)

    if (profilesError) {
      throw new Error(
        `プロフィールの取得時にエラーが発生しました: ${profilesError.message}`
      )
    }

    const patientsNumber = patients.length
    const userNumber = profiles.length

    if (patientsNumber >= planLimits.patientLimit) {
      return {
        success: false,
        error: `患者数が制限を超えています。現在の患者数: ${patientsNumber}人, ${plan}の制限: ${planLimits.patientLimit}人`,
      }
    }

    if (userNumber >= planLimits.userLimit) {
      return {
        success: false,
        error: `ユーザー数が制限を超えています。現在のユーザー数: ${userNumber}人, ${plan}の制限: ${planLimits.userLimit}人`,
      }
    }

    return { success: true, message: "プラン制限内です" }
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      }
    }
    return { success: false, error: "不明なエラーが発生しました" }
  }
}
