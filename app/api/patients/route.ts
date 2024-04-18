import { NextResponse } from "next/server"

import { Database } from "@/types/schema.gen"
import { createClient } from "@/lib/supabase/server"

type Patient = Database["public"]["Tables"]["patients"]["Row"]

export async function GET() {
  const supabase = createClient()
  const { data } = await supabase.from("patients").select("*")

  return NextResponse.json<Patient[]>(data ?? [])
}
