import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
})

export async function POST(req: NextRequest) {
  try {
    // Extract the `prompt` from the body of the request
    const { base64_image } = await req.json()

    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      max_tokens: 4024,
      messages: [
        {
          role: "system",
          content:
            "You are an Optical Character Recognition (OCR) machine. You will extract all the characters from the image file in the URL provided by the user, and you will only privide the extracted text in your response. As an OCR machine, You can only respond with the extracted text.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please extract all characters within the image. Return the only extacted characters.",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64_image}`,
              },
            },
          ],
        },
      ],
    })

    return NextResponse.json({ response: response.choices[0] }, { status: 200 })
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
