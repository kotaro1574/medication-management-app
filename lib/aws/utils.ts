import { getPresignedUrl } from "@/actions/s3/get-presigned-url"
import {
  DeleteFacesCommand,
  IndexFacesCommand,
  SearchFacesByImageCommand,
} from "@aws-sdk/client-rekognition"
import { DeleteObjectCommand } from "@aws-sdk/client-s3"

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

  const faceId = res.FaceMatches?.[0]?.Face?.FaceId

  return faceId ?? null

  // const faceExists =
  //   res.FaceMatches && res.FaceMatches.length > 0 ? true : false

  // if (faceExists) {
  //   await deleteImage([imageId], bucket)
  //   throw new Error("コレクション内に同じ顔データが既に存在します。")
  // }
}

export async function IndexFaces(
  imageIds: string[],
  bucket: string
): Promise<{ faceId: string; imageId: string }[]> {
  const faces: { faceId: string; imageId: string }[] = []

  for (const imageId of imageIds) {
    const indexFaceRes = await rekognitionClient.send(
      new IndexFacesCommand({
        CollectionId: bucket,
        ExternalImageId: imageId,
        MaxFaces: 1,
        Image: {
          S3Object: {
            Bucket: bucket,
            Name: imageId,
          },
        },
      })
    )

    if (!indexFaceRes.FaceRecords || indexFaceRes.FaceRecords.length === 0) {
      await deleteImage([imageId], bucket)
      throw new Error("顔が見つからない画像が含まれています。")
    }

    const faceId = indexFaceRes.FaceRecords[0].Face?.FaceId

    if (!faceId) {
      await deleteImage([imageId], bucket)
      throw new Error("顔データの登録に失敗しました")
    }

    faces.push({ faceId, imageId })
  }

  return faces
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
export async function deleteImage(faceImageIds: string[], bucket: string) {
  for (const faceImageId of faceImageIds) {
    try {
      const deleteParams = {
        Bucket: bucket,
        Key: faceImageId,
      }
      await s3Client.send(new DeleteObjectCommand(deleteParams))
    } catch (error) {
      console.error("Failed to delete image from S3", error)
    }
  }
}

// 顔画像をS3にアップロードする関数
export async function uploadFaceImage(faceImages: File[]): Promise<string[]> {
  const imageIds: string[] = new Array(faceImages.length).fill("")

  const uploadPromises = faceImages.map(async (faceImage, index) => {
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
      throw new Error(`S3への画像アップロードに失敗しました。Index: ${index}`)
    }

    imageIds[index] = imageId // インデックスを使用して格納する
  })

  await Promise.all(uploadPromises)

  return imageIds
}

// 薬画像をS3にアップロードする関数
export async function drugImagesUpload(drugImages: File[]): Promise<string[]> {
  const imageIds: string[] = []

  for (const drugImage of drugImages) {
    const {
      url: drugUrl,
      fields: drugFields,
      key: imageId,
    } = await getPresignedUrl(
      drugImage.type,
      process.env.NEXT_PUBLIC_DRUGS_BUCKET ?? ""
    )

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
