"use server"

import { revalidatePath } from "next/cache"

import { ActionResult } from "@/types/action"
import { createClient } from "@/lib/supabase/server"

import { getProfile } from "../profile/get-profile"
import { getUser } from "./get-user"
import { updateUserFace } from "./update-user-face"

type Props = {
  formData: FormData
}

export async function updateUser({ formData }: Props): Promise<ActionResult> {
  try {
    const faceImages = formData.getAll("faceImages") as File[]

    const supabase = createClient()
    const user = await getUser(supabase)
    const { facility_id } = await getProfile(supabase, user.id, "facility_id")

    if (faceImages.length > 0) {
      await updateUserFace(supabase, user.id, facility_id ?? "", faceImages)
    }

    revalidatePath("/", "layout")
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
  }
  return { success: true, message: "ユーザー情報を更新しました" }
}
