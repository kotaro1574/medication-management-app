"use server"

import { ActionResult } from "@/types/action"
import { Database } from "@/types/schema.gen"
import {
  IndexFaces,
  deleteFace,
  deleteImage,
  drugImagesUpload,
  uploadFaceImage,
} from "@/lib/aws/utils"
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

    // faceImageの処理
    const faceImageIds = await uploadFaceImage(faceImages)

    // // AWS Rekognition を呼び出して画像内の顔をインデックスに登録
    const faces = await IndexFaces(faceImageIds, process.env.FACES_BUCKET ?? "")
    const faceIds = faces.map((face) => face.faceId)

    const supabase = createClient()

    const { data } = await supabase.auth.getUser()
    const userId = data?.user?.id

    if (!userId) {
      await deleteImage(faceImageIds, process.env.FACES_BUCKET ?? "")
      await deleteFace(process.env.FACES_BUCKET ?? "", faceIds)
      throw new Error("ユーザー情報の取得に失敗しました")
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("facility_id")
      .eq("id", userId)
      .single()

    if (profileError) {
      await deleteImage(faceImageIds, process.env.FACES_BUCKET ?? "")
      await deleteFace(process.env.FACES_BUCKET ?? "", faceIds)
      throw new Error(
        `プロフィールデータの取得時にエラーが発生しました: ${profileError.message}`
      )
    }

    const { data: patient, error: patientError } = await supabase
      .from("patients")
      .insert({
        last_name: lastName,
        first_name: firstName,
        image_id: faceImageIds[0],
        face_ids: faceIds,
        birthday,
        care_level: careLevel,
        group_id: groupId,
        facility_id: profile.facility_id,
        gender,
      })
      .select("id")
      .single()

    if (patientError) {
      await deleteImage(faceImageIds, process.env.FACES_BUCKET ?? "")
      await deleteFace(process.env.FACES_BUCKET ?? "", faceIds)
      throw new Error(
        `患者データの挿入時にエラーが発生しました: ${patientError.message}`
      )
    }

    // 顔データの処理
    const { error: faceError } = await supabase.from("faces").insert(
      faces.map((face) => ({
        patient_id: patient.id,
        face_id: face.faceId,
        image_id: face.imageId,
      }))
    )

    if (faceError) {
      await deleteImage(faceImageIds, process.env.FACES_BUCKET ?? "")
      await deleteFace(process.env.FACES_BUCKET ?? "", faceIds)
      throw new Error(
        `顔データの挿入時にエラーが発生しました: ${faceError.message}`
      )
    }

    // 服薬画像の処理
    if (drugImages.length > 0) {
      const drugImageIds = await drugImagesUpload(drugImages)

      const { error: drugsError } = await supabase.from("drugs").insert(
        drugImageIds.map((drugImageId) => ({
          patient_id: patient.id,
          image_id: drugImageId,
          user_id: userId,
        }))
      )

      if (drugsError) {
        await deleteImage(drugImageIds, process.env.DRUGS_BUCKET ?? "")
        throw new Error(
          `服薬画像の挿入時にエラーが発生しました: ${drugsError.message}`
        )
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
  }
  return { success: true, message: "患者が作成されました" }
}
