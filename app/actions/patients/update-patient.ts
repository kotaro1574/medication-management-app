"use server"

import { IndexFacesCommand } from "@aws-sdk/client-rekognition"

import { rekognitionClient } from "@/lib/aws/aws-clients"
import { deleteFace, deleteImage, getPresignedUrl } from "@/lib/aws/utils"
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

export async function updatePatient({
  formData,
  name,
  faceData,
  id,
}: {
  formData: FormData
  name: string
  id: string
  faceData: {
    faceIds: string[]
    imageId: string
  }
}): Promise<Result> {
  const imageFile = formData.get("imageFile") as File
  try {
    const { url, fields, key } = await getPresignedUrl(imageFile.type)

    const newFormData = new FormData()
    Object.entries(fields).forEach(([key, value]) => {
      newFormData.append(key, value as string)
    })
    newFormData.append("file", imageFile)

    // S3に画像をアップロード
    const uploadResponse = await fetch(url, {
      method: "POST",
      body: newFormData,
    })

    if (!uploadResponse.ok) {
      throw new Error("S3への画像アップロードに失敗しました。")
    }

    // インデックスに登録する前に既存の顔情報を削除
    await deleteImage(faceData.imageId)
    await deleteFace(process.env.AMPLIFY_BUCKET ?? "", faceData.faceIds)

    // AWS Rekognition を呼び出して画像内の顔をインデックスに登録
    const response = await rekognitionClient.send(
      new IndexFacesCommand({
        CollectionId: process.env.AMPLIFY_BUCKET,
        ExternalImageId: key,
        Image: {
          S3Object: {
            Bucket: process.env.AMPLIFY_BUCKET,
            Name: key,
          },
        },
      })
    )

    const faceIds =
      response.FaceRecords?.map((record) => record?.Face?.FaceId ?? "") ?? []

    if (!response.FaceRecords || response.FaceRecords.length === 0) {
      await deleteImage(key)
      throw new Error("画像内に顔が見つかりませんでした")
    }

    if (response.FaceRecords.length > 1) {
      await deleteImage(key)
      await deleteFace(process.env.AMPLIFY_BUCKET ?? "", faceIds)
      throw new Error("画像内に顔が1つではありません")
    }

    const supabase = createClient()

    const { error } = await supabase
      .from("patients")
      .update({
        name,
        image_id: key,
        face_ids: faceIds,
      })
      .eq("id", id)

    if (error) {
      await deleteImage(key)
      await deleteFace(process.env.AMPLIFY_BUCKET ?? "", faceIds)
      throw new Error(
        `患者データの挿入時にエラーが発生しました: ${error.message}`
      )
    }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
  }
  return { success: true, message: "患者を編集しました" }
}
