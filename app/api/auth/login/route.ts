import { cookies } from "next/headers"
import { type NextRequest } from "next/server"

import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    cookies().set("login-info", JSON.stringify({ email, password }))

    return new Response(JSON.stringify({ message: "Login successful" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}
