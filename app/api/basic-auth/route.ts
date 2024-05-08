import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json(
    { error: "Basic Auth Required" },
    {
      status: 401,
      headers: { "WWW-Authenticate": "Basic realm='secure_area'" },
    }
  )
}
