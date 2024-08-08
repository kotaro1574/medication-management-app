import { NextResponse, type NextRequest } from "next/server"

import { updateSession } from "./lib/supabase/middleware"

function basicAuth(request: NextRequest) {
  const basicAuth = request.headers.get("authorization")
  const url = request.nextUrl

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1]
    const [user, pwd] = Buffer.from(authValue, "base64")
      .toString("utf-8")
      .split(":")

    const validUser = process.env.BASIC_AUTH_USER
    const validPassWord = process.env.BASIC_AUTH_PASSWORD

    if (user === validUser && pwd === validPassWord) {
      return NextResponse.next()
    }
  }

  url.pathname = "/api/basic-auth"
  return NextResponse.rewrite(url)
}

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/signup")) {
    return basicAuth(request)
  }
  // update user's auth session
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
