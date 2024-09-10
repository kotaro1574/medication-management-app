"use server"

import { deleteFace, deleteImage } from "@/lib/aws/utils"
import { createClient } from "@/lib/supabase/server"

type Result =
  | {
      success: true
      message: string
    }
  | {
      success: false
      error: string
    }

export async function deletePatient({
  id,
  drugImageIds,
  faceData,
}: {
  id: string
  drugImageIds: string[]
  faceData: {
    faceIds: string[]
    imageIds: string[]
  }
}): Promise<Result> {
  try {
    await deleteImage(faceData.imageIds, process.env.PATIENT_FACES_BUCKET ?? "")
    await deleteImage(drugImageIds, process.env.DRUGS_BUCKET ?? "")
    await deleteFace(process.env.PATIENT_FACES_BUCKET ?? "", faceData.faceIds)

    const supabase = createClient()
    const { error } = await supabase.from("patients").delete().eq("id", id)
    if (error) {
      throw new Error("患者の削除に失敗しました")
    }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
  }
  return { success: true, message: "患者を削除しました" }
}
