import Link from "next/link"
import { EmailChangeConfirmToast } from "@/feature/user/email-change-confirm-toast"

import { createClient } from "@/lib/supabase/server"
import { Icons } from "@/components/ui/icons"

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
    .select("name")
    .eq("id", user.id)
    .single()

  if (profileError) {
    console.error(profileError)
    return <div>profileError</div>
  }

  return (
    <>
      <EmailChangeConfirmToast />
      <section className="min-h-screen bg-[#F5F5F5] px-4 pb-8 pt-11">
        <h1 className="text-[20px] text-[#C2B37F]">アカウント情報</h1>
        <div className="mt-4 space-y-4 rounded-2xl bg-white p-4">
          <div className="flex items-end justify-between">
            <div className="space-y-px">
              <p className="text-xs text-[#A4A4A4]">名前</p>
              <p>{profile.name}</p>
            </div>
            <Link href="/user/edit">
              <div className="flex items-center gap-1 text-[#A4A4A4]">
                <Icons.edit className="size-5" />
                <p className="text-xs">編集する</p>
              </div>
            </Link>
          </div>
          <div className="flex items-end justify-between">
            <div className="space-y-px">
              <p className="text-xs text-[#A4A4A4]">メールアドレス</p>
              <p>{user.email}</p>
            </div>
            <Link href="/user/edit/email">
              <div className="flex items-center gap-1 text-[#A4A4A4]">
                <Icons.edit className="size-5" />
                <p className="text-xs">編集する</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
