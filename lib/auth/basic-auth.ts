import { NextResponse, type NextRequest } from "next/server"

export function basicAuth(request: NextRequest) {
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
