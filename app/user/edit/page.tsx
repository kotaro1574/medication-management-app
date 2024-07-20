import { EditUserForm } from "@/feature/user/edit-user-form"

import { createClient } from "@/lib/supabase/server"

export default async function EditUserPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { redirect: { destination: "/login", permanent: false } }
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, name")
    .eq("id", user.id)
    .single()

  if (profileError) {
    return <div>error</div>
  }
  return (
    <section className="px-4 py-[52px]">
      <h2 className="mb-[60px] text-xl text-[#C2B37F]">アカウント情報編集</h2>
      <EditUserForm profile={profile} />
    </section>
  )
}
