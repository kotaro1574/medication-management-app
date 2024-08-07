import { NextResponse, type NextRequest } from "next/server"
import { createServerClient, type CookieOptions } from "@supabase/ssr"

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: "",
            ...options,
          })
        },
      },
    }
  )

  // refreshing the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const authExemptUrls = [
    "/login",
    "/signup",
    "/api/auth/confirm",
    "/reset-password",
    "/reset-password/input-password",
  ]

  const isAuthExemptUrl = authExemptUrls.some((url) =>
    request.url.includes(url)
  )

  // ユーザーがログインしていない場合のリダイレクト
  if (!user && !isAuthExemptUrl) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // ユーザーがログインしている場合のリダイレクト
  if (user && isAuthExemptUrl) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return response
}
