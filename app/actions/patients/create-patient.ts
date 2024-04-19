"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { IndexFacesCommand } from "@aws-sdk/client-rekognition"

import { rekognitionClient } from "@/lib/aws/aws-clients"
import { createClient } from "@/lib/supabase/server"

export async function createPatient({
  image_id,
  name,
}: {
  image_id: string
  name: string
}) {
  try {
    // AWS Rekognition を呼び出して画像内の顔をインデックスに登録
    const response = await rekognitionClient.send(
      new IndexFacesCommand({
        CollectionId: process.env.AMPLIFY_BUCKET,
        ExternalImageId: image_id,
        Image: {
          S3Object: {
            Bucket: process.env.AMPLIFY_BUCKET,
            Name: image_id,
          },
        },
      })
    )

    const faceId = response.FaceRecords?.[0]?.Face?.FaceId

    if (!faceId) {
      throw new Error("画像内に顔が見つかりませんでした")
    }

    const supabase = createClient()

    const { error } = await supabase.from("patients").insert({
      name,
      image_id,
      face_id: faceId,
    })

    if (error) {
      throw new Error(
        `患者データの挿入時にエラーが発生しました: ${error.message}`
      )
    }

    revalidatePath("/")
    redirect("/")
  } catch (err) {
    console.error("患者の作成に失敗しました:", err)
    redirect("/error")
  }
}
