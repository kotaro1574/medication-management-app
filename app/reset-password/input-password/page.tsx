import { InputPasswordForm } from "@/feature/auth/input-password-form"

export default async function InputPasswordForResetPage() {
  return (
    <div className="container max-w-[450px] py-[120px]">
      <h1 className="text-center text-[24px] font-bold text-[#c2b37f]">
        パスワード再設定
      </h1>
      <p className="mt-[24px] text-center text-sm text-neutral-400">
        新しいパスワードを入力してください
      </p>
      <InputPasswordForm />
    </div>
  )
}
