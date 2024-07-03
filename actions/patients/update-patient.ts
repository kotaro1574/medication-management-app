"use server"

import { ActionResult } from "@/types/action"
import { Database } from "@/types/schema.gen"
import {
  IndexFaces,
  deleteFace,
  deleteImage,
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
  patientId: string
  deleteDrugIds: string[]
}

export async function updatePatient({
  patientId,
  formData,
  lastName,
  firstName,
  birthday,
  careLevel,
  groupId,
  gender,
  deleteDrugIds,
}: Props): Promise<ActionResult> {
  try {
    const faceImages = formData.getAll("faceImages") as File[]
    const drugImages = formData.getAll("drugImages") as File[]

    const supabase = createClient()

    const { data } = await supabase.auth.getUser()
    const userId = data?.user?.id

    if (!userId) {
      throw new Error("ユーザー情報の取得に失敗しました")
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("facility_id")
      .eq("id", userId)
      .single()

    if (profileError) {
      throw new Error("施設情報の取得に失敗しました")
    }

    const { error: patientError } = await supabase
      .from("patients")
      .update({
        last_name: lastName,
        first_name: firstName,
        birthday,
        care_level: careLevel,
        group_id: groupId,
        facility_id: profile.facility_id,
        gender,
      })
      .eq("id", patientId)

    if (patientError) {
      throw new Error("患者の更新に失敗しました")
    }

    if (faceImages.length > 0) {
      // DBから既存の顔情報を削除
      const { data: faces, error: facesError } = await supabase
        .from("faces")
        .select("id, face_id, image_id")
        .eq("patient_id", patientId)

      if (facesError) {
        throw new Error("顔情報の取得に失敗しました")
      }

      const { error } = await supabase
        .from("faces")
        .delete()
        .in(
          "id",
          faces.map((face) => face.id)
        )

      if (error) {
        throw new Error("顔情報の削除に失敗しました")
      }

      const faceIds = faces.map((face) => face.face_id)
      const imageIds = faces.map((face) => face.image_id)

      // AWS Rekognition から既存の顔データを削除
      await deleteFace(process.env.FACES_BUCKET ?? "", faceIds)
      // s3 から既存の顔画像を削除
      await deleteImage(imageIds, process.env.FACES_BUCKET ?? "")

      const faceImageIds = await uploadFaceImage(faceImages)

      const newFaces = await IndexFaces(
        faceImageIds,
        process.env.FACES_BUCKET ?? ""
      )
      const newFaceIds = newFaces.map((face) => face.faceId)

      const { error: patientError } = await supabase
        .from("patients")
        .update({
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
        .eq("id", patientId)

      if (patientError) {
        await deleteImage(faceImageIds, process.env.FACES_BUCKET ?? "")
        await deleteFace(process.env.FACES_BUCKET ?? "", newFaceIds)
        throw new Error("患者の更新に失敗しました")
      }

      const { error: faceError } = await supabase.from("faces").insert(
        newFaces.map((face) => ({
          patient_id: patientId,
          face_id: face.faceId,
          image_id: face.imageId,
        }))
      )

      if (faceError) {
        await deleteImage(faceImageIds, process.env.FACES_BUCKET ?? "")
        await deleteFace(process.env.FACES_BUCKET ?? "", newFaceIds)
        throw new Error("新しい顔情報の挿入に失敗しました")
      }
    }

    if (drugImages.length > 0) {
      // 薬の画像をアップロード
      // 画像のURLを取得
      // 画像のURLをDBに保存
    }

    if (deleteDrugIds.length > 0) {
      await deleteImage(deleteDrugIds, process.env.DRUGS_BUCKET ?? "")
      const { error: drugError } = await supabase
        .from("drugs")
        .delete()
        .in("id", deleteDrugIds)

      if (drugError) {
        throw new Error("服用薬の削除に失敗しました")
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
  }
  return { success: true, message: "患者を編集しました" }
}
