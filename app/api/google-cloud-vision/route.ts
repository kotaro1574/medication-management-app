import { NextRequest, NextResponse } from "next/server"
import Vision from "@google-cloud/vision"

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json()

    const client = new Vision.ImageAnnotatorClient({
      credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS ?? ""),
    })

    const [result] = await client.textDetection({
      image: { content: image },
    })
    const detectedText = result.textAnnotations?.[0]?.description

    return NextResponse.json(
      { response: detectedText || "Text could not be detected." },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    } else {
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      )
    }
  }
}
