import { revalidatePath } from "next/cache"
import { NextResponse, type NextRequest } from "next/server"

import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  const supabase = createClient()

  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    await supabase.auth.signOut()
  }

  const redirectTo = request.nextUrl.clone()
  redirectTo.pathname = "/login"

  revalidatePath("/", "layout")
  return NextResponse.redirect(redirectTo, {
    status: 302,
  })
}
