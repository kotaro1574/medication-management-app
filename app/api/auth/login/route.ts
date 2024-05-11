import { cookies } from "next/headers"
import { type NextRequest } from "next/server"

import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    const supabase = createClient()

    const { data: userData, error: userError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      })

    if (userError) {
      return new Response(JSON.stringify({ error: userError.message }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userData.user?.id ?? "")
      .single()

    if (!profileData || profileError) {
      return new Response(JSON.stringify({ error: profileError?.message }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    cookies().set(
      `login-info-${userData.user.id}`,
      JSON.stringify({ name: profileData.name, email, password }),
      {
        httpOnly: true,
        secure: true,
      }
    )

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
