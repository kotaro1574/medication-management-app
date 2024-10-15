"use server"

import { PLAN_LIMITS } from "@/lib/constants/plan-limits"
import { createClient } from "@/lib/supabase/server"

import { getUser } from "../user/get-user"
import { getProfile } from "../user/profile/get-profile"

export async function patientPlanLimitsValidation() {
  try {
    const supabase = createClient()
    const user = await getUser(supabase)
    const profile = await getProfile(supabase, user.id)

    const { data: facility, error: facilityError } = await supabase
      .from("facilities")
      .select("plan")
      .eq("id", profile?.facility_id ?? "")
      .single()

    if (facilityError) {
      throw new Error(
        `プランの取得時にエラーが発生しました: ${facilityError.message}`
      )
    }

    const { data: patients, error: patientsError } = await supabase
      .from("patients")
      .select("id")
      .eq("facility_id", profile?.facility_id ?? "")

    if (patientsError) {
      throw new Error(
        `患者の取得時にエラーが発生しました: ${patientsError.message}`
      )
    }

    const plan = facility.plan
    const planLimits = PLAN_LIMITS[plan]

    if (!planLimits) {
      throw new Error(`無効なプランです: ${plan}`)
    }

    const patientsNumber = patients.length

    if (patientsNumber >= planLimits.patientLimit) {
      return {
        success: false,
        error: `患者数が制限を超えています。現在の患者数: ${patientsNumber}人, ${plan}の制限: ${planLimits.patientLimit}人`,
      }
    }

    return {
      success: true,
      message: "プラン制限内です",
    }
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
