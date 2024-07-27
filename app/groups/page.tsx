import Link from "next/link"
import { GroupItem } from "@/feature/group/group-item"

import { createClient } from "@/lib/supabase/server"
import { buttonVariants } from "@/components/ui/button"

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
    <section className="px-4 py-[52px]">
      <h2 className=" text-xl text-[#C2B37F]">グループ一覧</h2>
      <div>
        {groups.length === 0 ? (
          <p className="mt-4 text-sm text-[#A4A4A4]">
            グループが登録されていません。
          </p>
        ) : (
          <div className="mt-[60px]">
            <h3 className="text-base">施設名</h3>
            <div className="pt-[34px]">
              {groups.map((group) => (
                <GroupItem key={group.id} group={group} />
              ))}
            </div>
          </div>
        )}
      </div>
      <Link
        className={`${buttonVariants()} ${
          groups.length === 0 ? "mt-4" : "mt-[6px]"
        } block w-full`}
        href="/groups/create"
      >
        追加
      </Link>
    </section>
  )
}
