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
  faceData,
}: {
  id: string
  faceData: {
    faceId: string
    imageId: string
  }
}): Promise<Result> {
  try {
    deleteImage(faceData.imageId, process.env.FACES_BUCKET ?? "")
    deleteFace(process.env.FACES_BUCKET ?? "", [faceData.faceId])

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
