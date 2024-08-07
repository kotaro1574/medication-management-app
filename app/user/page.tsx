import { EditUserForm } from "@/feature/user/edit-user-form"

import { createClient } from "@/lib/supabase/server"

export default async function UserPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>user not found</div>
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, name")
    .eq("id", user.id)
    .single()

  if (profileError) {
    console.error(profileError)
    return <div>profileError</div>
  }

  return (
    <section className="min-h-screen bg-[#F5F5F5] px-4 pb-8 pt-11">
      <EditUserForm profile={profile} email={user.email ?? ""} />
    </section>
  )
}
