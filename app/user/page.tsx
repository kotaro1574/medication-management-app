import { EditUserForm } from "@/feature/user/edit-user-form"
import { EmailChangeConfirmToast } from "@/feature/user/email-change-confirm-toast"

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
    <section className="min-h-screen bg-[#F5F5F5] px-4 pb-8 pt-[62px]">
      <EditUserForm profile={profile} email={user.email ?? ""} />
      <EmailChangeConfirmToast user={user} name={profile.name} />
    </section>
  )
}
