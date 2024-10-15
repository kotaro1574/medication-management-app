"use server"

import { PLAN_LIMITS } from "@/lib/constants/plan-limits"
import { createClient } from "@/lib/supabase/server"

type Props = {
  facilityId: string
}

export async function userPlanLimitsValidation({ facilityId }: Props) {
  try {
    const supabase = createClient()
    const { data: facility, error: facilityError } = await supabase
      .from("facilities")
      .select("plan")
      .eq("id", facilityId)
      .single()

    if (facilityError) {
      throw new Error(
        `プランの取得時にエラーが発生しました: ${facilityError.message}`
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

    const plan = facility.plan
    const planLimits = PLAN_LIMITS[plan]

    if (!planLimits) {
      throw new Error(`無効なプランです: ${plan}`)
    }

    const usersNumber = profiles.length

    console.log("usersNumber", usersNumber)
    console.log("planLimits", planLimits)

    if (usersNumber >= planLimits.userLimit) {
      return {
        success: false,
        error: `ユーザー数が制限を超えています。現在のユーザー数: ${usersNumber}人, ${plan}の制限: ${planLimits.userLimit}人`,
      }
    }

    return {
      success: true,
      message: "プラン制限内です",
    }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: "不明なエラーが発生しました" }
  }
}
