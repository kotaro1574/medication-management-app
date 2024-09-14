import { getPresignedUrl } from "@/actions/s3/get-presigned-url"
import {
  DeleteFacesCommand,
  DetectFacesCommand,
  IndexFacesCommand,
  SearchFacesByImageCommand,
} from "@aws-sdk/client-rekognition"
import { DeleteObjectCommand } from "@aws-sdk/client-s3"

import { rekognitionClient, s3Client } from "@/lib/aws/aws-clients"

// Rekognitionコレクションに顔データが存在するか確認する関数
export async function checkFaceImageExists(imageId: string, bucket: string) {
  const detectFacesRes = await rekognitionClient.send(
    new DetectFacesCommand({
      Image: {
        S3Object: {
          Bucket: bucket,
          Name: imageId,
        },
      },
    })
  )

  if (!detectFacesRes.FaceDetails || detectFacesRes.FaceDetails.length === 0) {
    throw new Error("There are no faces in the image.")
  }

  if (detectFacesRes.FaceDetails.length > 1) {
    throw new Error("The image contains more than one face.")
  }

  const searchFacesByImageRes = await rekognitionClient.send(
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

  const faceId = searchFacesByImageRes.FaceMatches?.[0]?.Face?.FaceId

  return faceId ?? null
}

// Rekognitionコレクションに顔データを登録する関数
export async function IndexFaces(
  imageIds: string[],
  bucket: string
): Promise<{ faceId: string; imageId: string }[]> {
  const faces: { faceId: string; imageId: string }[] = []

  try {
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

      if (!indexFaceRes.FaceRecords) {
        throw new Error("顔データの登録に失敗しました")
      }

      const faceId = indexFaceRes.FaceRecords[0].Face?.FaceId

      if (!faceId) {
        throw new Error("顔データの登録に失敗しました")
      }

      faces.push({ faceId, imageId })
    }
  } catch (error) {
    if (error instanceof Error) {
      deleteImage(imageIds, bucket)
      deleteFace(
        bucket,
        faces.map((face) => face.faceId)
      )
      throw new Error(error.message)
    }
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

// S3に画像をアップロードする関数
export async function uploadImages(images: File[], bucket: string) {
  const uploadPromises = images.map(async (image) => {
    const {
      url,
      fields,
      key: imageId,
    } = await getPresignedUrl(image.type, bucket)

    const formData = new FormData()
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value as string)
    })
    formData.append("file", image)

    const uploadResponse = await fetch(url, {
      method: "POST",
      body: formData,
    })

    if (!uploadResponse.ok) {
      throw new Error(`S3への画像アップロードに失敗しました。`)
    }

    return imageId
  })

  // すべての画像のアップロードが完了するのを待つ
  const imageIds = await Promise.all(uploadPromises)

  return imageIds
}
