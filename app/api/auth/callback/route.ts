import { NextResponse, type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)

  console.log(requestUrl.origin)
  return NextResponse.redirect(requestUrl.origin + "/")
}
