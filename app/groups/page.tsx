import Link from "next/link"

import { createClient } from "@/lib/supabase/server"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"

export default async function GroupsPage() {
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

  const { data: groups, error: groupsError } = await supabase
    .from("groups")
    .select("*")
    .eq("facility_id", profile.facility_id)

  if (groupsError) {
    return <div>error</div>
  }

  return (
    <section className="px-4 py-[60px]">
      <h1>Groups</h1>
      <ul>
        {groups.map((group) => (
          <li key={group.id} className="flex items-center justify-between">
            <div>{group.name}</div>
            <div className="flex items-center gap-2">
              <Link href={`/groups/${group.id}`}>
                <Icons.edit />
              </Link>
              <Icons.trash className="size-6" />
            </div>
          </li>
        ))}
      </ul>
      <Link
        className={`${buttonVariants()} mt-4 block w-full`}
        href="/groups/create"
      >
        追加
      </Link>
    </section>
  )
}
