import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export async function POST(request: Request) {
  const { email, password } = await request.json()
  console.log({ email, password })
  const supabase = createRouteHandlerClient({ cookies })

  const { data } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  console.log(data)

  return NextResponse.redirect(new URL("/profile", request.url), {
    status: 301,
  })
}
