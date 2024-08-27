"use server"

import { revalidatePath } from "next/cache"

import { ActionResult } from "@/types/action"
import { Database } from "@/types/schema.gen"
import { createClient } from "@/lib/supabase/server"

import { ocrAzureComputerVision } from "../ocr/azure-computer-vision"

export async function patentsDrugRecognition({
  imageSrc,
  patent,
}: {
  imageSrc: string
  patent: Pick<
    Database["public"]["Tables"]["patients"]["Row"],
    "id" | "last_name" | "first_name"
  >
}): Promise<ActionResult> {
  try {
    const detectedText = await ocrAzureComputerVision({ image: imageSrc })

    console.log(detectedText)

    const isPatentNameIncluded =
      detectedText.includes(patent.last_name) &&
      detectedText.includes(patent.first_name)

    if (!isPatentNameIncluded) {
      throw new Error("服薬者の名前が含まれていません")
    }

    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("ユーザーが見つかりません")
    }

    const { error } = await supabase.from("drug_histories").insert({
      patient_id: patent.id,
      user_id: user.id,
      medication_auth_result: "success",
    })

    if (error) {
      throw error.message
    }

    revalidatePath("/patients", "page")
    revalidatePath("/patients/[id]", "page")
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "薬の認識に失敗しました",
    }
  }
  return {
    success: true,
    message: "薬の認証完了",
  }
}
