import { CreateGroupForm } from "@/feature/group/create-group-form"

import { createClient } from "@/lib/supabase/server"

export default async function CreateGroupPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { redirect: { destination: "/login", permanent: false } }
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("facility_id")
    .eq("id", user.id)
    .single()

  if (profileError) {
    return <div>error</div>
  }
  return (
    <section className="px-4 py-[60px]">
      <h1>Create Group</h1>
      <CreateGroupForm facilityId={profile.facility_id} />
    </section>
  )
}