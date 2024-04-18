import { RekognitionClient } from "@aws-sdk/client-rekognition"
import { S3Client } from "@aws-sdk/client-s3"

const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
}

export const rekognitionClient = new RekognitionClient({
  region: process.env.AWS_REGION,
  credentials,
})

export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials,
})
