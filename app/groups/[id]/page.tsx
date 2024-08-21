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
    <section className="px-4 pb-8 pt-[62px]">
      <h2 className="mb-[60px] text-xl text-[#C2B37F]">グループ編集</h2>
      <UpdateGroupForm group={group} />
    </section>
  )
}
