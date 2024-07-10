import { UpdateGroupForm } from "@/feature/group/update-group-form"

import { createClient } from "@/lib/supabase/server"

export default async function EditGroupPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()

  const { data: group, error: groupError } = await supabase
    .from("groups")
    .select("*")
    .eq("id", params.id)
    .single()

  if (groupError) {
    return <div>error: {groupError.message}</div>
  }

  return (
    <section className="px-4 py-[60px]">
      <h1>Edit Group</h1>
      <UpdateGroupForm group={group} />
    </section>
  )
}
