import { CreatePatientForm } from "@/feature/patient/create-patient-form"

import { createClient } from "@/lib/supabase/server"

export default async function CreatePatientPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user?.id ?? "")
    .single()

  if (error) {
    console.error(error)
    return <div>エラーが発生しました</div>
  }

  return (
    <section className="min-h-screen bg-[#F5F5F5] px-4 pb-8 pt-11">
      <CreatePatientForm currentUserName={profile.name} />
    </section>
  )
}
