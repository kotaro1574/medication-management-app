import { EditUserEmailForm } from "@/feature/user/edit-user-email-form"

export default async function EditUserEmailPage() {
  return (
    <section className="space-y-6 px-4 py-[52px]">
      <h1 className="text-xl text-[#C2B37F]">メールアドレス変更</h1>
      <p className="text-sm text-[#A4A4A4]">
        新しいメールアドレスを入力してください。
        <br />
        新しい電子メールアドレスに確認リンクが送信されます。
      </p>
      <EditUserEmailForm />
    </section>
  )
}
