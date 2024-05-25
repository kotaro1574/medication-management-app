"use server"

import { ActionResult } from "@/types/action"
import { Database } from "@/types/schema.gen"
import {
  IndexFaces,
  checkFaceImageExists,
  deleteFace,
  deleteImage,
  drugImagesUpload,
  uploadFaceImage,
} from "@/lib/aws/utils"
import { createClient } from "@/lib/supabase/server"

type Props = {
  formData: FormData
  name: string
  birthday: string
  careLevel: Database["public"]["Enums"]["care_level_enum"]
  groupId: string
  gender: Database["public"]["Enums"]["gender_enum"]
}

export async function createPatient({
  formData,
  name,
  birthday,
  careLevel,
  groupId,
  gender,
}: Props): Promise<ActionResult> {
  try {
    const faceImage = formData.get("faceImage") as File
    const drugImages = formData.getAll("drugImages") as File[]

    // faceImageの処理
    const faceImageId = await uploadFaceImage(faceImage)

    // 顔画像が既に存在するかどうかをチェック
    await checkFaceImageExists(faceImageId, process.env.FACES_BUCKET ?? "")

    // // AWS Rekognition を呼び出して画像内の顔をインデックスに登録
    const faceId = await IndexFaces(faceImageId, process.env.FACES_BUCKET ?? "")

    const supabase = createClient()

    const { data } = await supabase.auth.getUser()

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("facility_id")
      .eq("id", data.user?.id ?? "")
      .single()

    if (profileError) {
      await deleteImage(faceImageId, process.env.FACES_BUCKET ?? "")
      await deleteFace(process.env.FACES_BUCKET ?? "", [faceId])
      throw new Error(
        `プロフィールデータの取得時にエラーが発生しました: ${profileError.message}`
      )
    }

    const { data: patient, error: patientError } = await supabase
      .from("patients")
      .insert({
        name,
        image_id: faceImageId,
        face_id: faceId,
        birthday,
        care_level: careLevel,
        group_id: groupId,
        facility_id: profile.facility_id,
        gender,
      })
      .select("id")
      .single()

    if (patientError) {
      await deleteImage(faceImageId, process.env.FACES_BUCKET ?? "")
      await deleteFace(process.env.FACES_BUCKET ?? "", [faceId])
      throw new Error(
        `患者データの挿入時にエラーが発生しました: ${patientError.message}`
      )
    }

    // 服薬画像の処理
    const drugImageIds = await drugImagesUpload(drugImages)

    const { error: drugsError } = await supabase.from("drugs").insert(
      drugImageIds.map((drugImageId) => ({
        patient_id: patient.id,
        image_id: drugImageId,
      }))
    )

    if (drugsError) {
      drugImageIds.forEach((drugImageId) => {
        deleteImage(drugImageId, process.env.DRUGS_BUCKET ?? "")
      })
      throw new Error(
        `服薬画像の挿入時にエラーが発生しました: ${drugsError.message}`
      )
    }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
  }
  return { success: true, message: "患者が作成されました" }
}
