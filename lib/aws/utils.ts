import {
  DeleteFacesCommand,
  IndexFacesCommand,
  SearchFacesByImageCommand,
} from "@aws-sdk/client-rekognition"
import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import { createPresignedPost } from "@aws-sdk/s3-presigned-post"
import { v4 as uuidv4 } from "uuid"

import { rekognitionClient, s3Client } from "@/lib/aws/aws-clients"

export async function checkFaceImageExists(imageId: string, bucket: string) {
  const res = await rekognitionClient.send(
    new SearchFacesByImageCommand({
      CollectionId: bucket,
      Image: {
        S3Object: {
          Bucket: bucket,
          Name: imageId,
        },
      },
      MaxFaces: 1,
      FaceMatchThreshold: 95,
    })
  )

  const faceExists =
    res.FaceMatches && res.FaceMatches.length > 0 ? true : false

  if (faceExists) {
    await deleteImage(imageId, bucket)
    throw new Error("コレクション内に同じ顔データが既に存在します。")
  }
}

export async function IndexFaces(imageId: string, bucket: string) {
  const indexFaceRes = await rekognitionClient.send(
    new IndexFacesCommand({
      CollectionId: bucket,
      ExternalImageId: imageId,
      Image: {
        S3Object: {
          Bucket: bucket,
          Name: imageId,
        },
      },
    })
  )

  if (!indexFaceRes.FaceRecords || indexFaceRes.FaceRecords.length === 0) {
    await deleteImage(imageId, process.env.FACES_BUCKET ?? "")
    throw new Error("画像内に顔が見つかりませんでした")
  }

  const faceIds = indexFaceRes.FaceRecords.map(
    (record) => record.Face?.FaceId ?? ""
  )

  if (indexFaceRes.FaceRecords.length > 1) {
    await deleteImage(imageId, process.env.FACES_BUCKET ?? "")
    await deleteFace(process.env.FACES_BUCKET ?? "", faceIds)
    throw new Error("画像内に顔が1つではありません")
  }

  return faceIds[0]
}

// Rekognitionコレクションから顔データを削除する関数
export async function deleteFace(bucket: string, faceIds: string[]) {
  try {
    await rekognitionClient.send(
      new DeleteFacesCommand({
        CollectionId: bucket,
        FaceIds: faceIds,
      })
    )
  } catch (error) {
    console.error("Failed to delete face from collection", error)
  }
}

// S3から画像を削除する関数
export async function deleteImage(key: string, bucket: string) {
  try {
    const deleteParams = {
      Bucket: bucket,
      Key: key,
    }
    await s3Client.send(new DeleteObjectCommand(deleteParams))
  } catch (error) {
    console.error("Failed to delete image from S3", error)
  }
}

// 画像をS3にアップロードするためのプリサインドURLを取得する関数
export async function getPresignedUrl(fileType: string, bucket: string) {
  const key = uuidv4()
  const { url, fields } = await createPresignedPost(s3Client, {
    Bucket: bucket,
    Key: key,
    Conditions: [
      ["content-length-range", 0, 104857600], // 最大10MB
      ["starts-with", "$Content-Type", fileType],
    ],
    Fields: {
      "Content-Type": fileType,
    },
  })
  return { url, fields, key }
}

// 顔画像をS3にアップロードする関数
export async function uploadFaceImage(faceImage: File) {
  const {
    url: faceUrl,
    fields: faceFields,
    key: imageId,
  } = await getPresignedUrl(faceImage.type, process.env.FACES_BUCKET ?? "")

  const newFormData = new FormData()
  Object.entries(faceFields).forEach(([key, value]) => {
    newFormData.append(key, value as string)
  })
  newFormData.append("file", faceImage)

  const uploadResponse = await fetch(faceUrl, {
    method: "POST",
    body: newFormData,
  })

  if (!uploadResponse.ok) {
    throw new Error("S3への画像アップロードに失敗しました。")
  }

  return imageId
}

// 薬画像をS3にアップロードする関数
export async function drugImagesUpload(drugImages: File[]): Promise<string[]> {
  const imageIds: string[] = []

  for (const drugImage of drugImages) {
    const {
      url: drugUrl,
      fields: drugFields,
      key: imageId,
    } = await getPresignedUrl(drugImage.type, process.env.DRUGS_BUCKET ?? "")

    const drugFormData = new FormData()
    Object.entries(drugFields).forEach(([key, value]) => {
      drugFormData.append(key, value as string)
    })
    drugFormData.append("file", drugImage)

    const drugUploadResponse = await fetch(drugUrl, {
      method: "POST",
      body: drugFormData,
    })

    if (!drugUploadResponse.ok) {
      throw new Error("S3への薬画像アップロードに失敗しました。")
    }

    imageIds.push(imageId)
  }

  return imageIds
}
