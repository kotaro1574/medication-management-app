import { EditUserEmailForm } from "@/feature/user/edit-user-email-form"

import { createClient } from "@/lib/supabase/server"

export default async function EditUserEmailPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { redirect: { destination: "/login", permanent: false } }
  }

  if (!user.email) {
    console.error("ユーザーの電子メールが見つからない")
    return { redirect: { destination: "/login", permanent: false } }
  }

  return (
    <section className="space-y-6 px-4 py-[52px]">
      <h1 className="text-xl text-[#C2B37F]">メールアドレス変更</h1>
      <p className="text-sm text-[#A4A4A4]">
        新しいメールアドレスを入力してください。
        <br />
        新しい電子メールアドレスに確認リンクが送信されます。
      </p>
      <EditUserEmailForm id={user.id} email={user.email} />
    </section>
  )
}
