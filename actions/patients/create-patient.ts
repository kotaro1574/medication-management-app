"use server"

import { revalidatePath } from "next/cache"
import { SupabaseClient } from "@supabase/supabase-js"

import { ActionResult } from "@/types/action"
import { Database } from "@/types/schema.gen"
import { IndexFaces, drugImagesUpload, uploadFaceImage } from "@/lib/aws/utils"
import { createClient } from "@/lib/supabase/server"

type Props = {
  formData: FormData
  lastName: string
  firstName: string
  birthday: string
  careLevel: Database["public"]["Enums"]["care_level_enum"]
  groupId: string
  gender: Database["public"]["Enums"]["gender_enum"]
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

async function insertDrugs(
  supabase: SupabaseClient<Database>,
  drugImageIds: string[],
  patientId: string,
  userId: string
): Promise<void> {
  const { error } = await supabase.from("drugs").insert(
    drugImageIds.map((drugImageId) => ({
      patient_id: patientId,
      image_id: drugImageId,
      user_id: userId,
    }))
  )
  if (error) {
    throw new Error(`服薬画像の挿入時にエラーが発生しました: ${error.message}`)
  }
}

export async function createPatient({
  formData,
  lastName,
  firstName,
  birthday,
  careLevel,
  groupId,
  gender,
}: Props): Promise<ActionResult> {
  try {
    const faceImages = formData.getAll("faceImages") as File[]
    const drugImages = formData.getAll("drugImages") as File[]

    const faceImageIds = await uploadFaceImage(faceImages)
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
      group_id: groupId,
      facility_id: facilityId,
      gender,
    })

    await insertFaces(supabase, faces, patientId)

    if (drugImages.length > 0) {
      const drugImageIds = await drugImagesUpload(drugImages)
      await insertDrugs(supabase, drugImageIds, patientId, userId)
    }

    revalidatePath("/patients", "page")
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
  }
  return { success: true, message: "患者が作成されました" }
}
