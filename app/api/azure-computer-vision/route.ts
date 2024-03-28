import { NextRequest, NextResponse } from "next/server"
import { ComputerVisionClient } from "@azure/cognitiveservices-computervision"
import { ApiKeyCredentials } from "@azure/ms-rest-js"

const endpoint = process.env.AZURE_COMPUTER_VISION_ENDPOINT ?? ""
const apiKey = process.env.AZURE_COMPUTER_VISION_KEY ?? ""

// OCR処理のステータスを確認し、完了するまで待つ関数
async function waitForOCRCompletion(
  client: ComputerVisionClient,
  operationId: string
) {
  let result = await client.getReadResult(operationId)

  // 最大10回の試行を行い、それぞれの試行の間に1秒間隔を設ける
  for (let i = 0; i < 10 && result.status === "running"; i++) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    result = await client.getReadResult(operationId)
  }

  return result
}

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json()

    const imageBuffer = Buffer.from(image, "base64")

    const credentials = new ApiKeyCredentials({
      inHeader: { "Ocp-Apim-Subscription-Key": apiKey },
    })
    const client = new ComputerVisionClient(credentials, endpoint)

    const response = await client.readInStream(imageBuffer, { language: "ja" })

    const operationId = response.operationLocation.split("/").slice(-1)[0]

    // OCRの完了を待つ
    const result = await waitForOCRCompletion(client, operationId)

    // 結果からテキストを抽出して加工する
    const extractedTexts =
      result.analyzeResult?.readResults
        .map((page) => page.lines.map((line) => line.text).join("\n"))
        .join("\n\n") ?? ""

    return NextResponse.json({ response: extractedTexts }, { status: 200 })
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
