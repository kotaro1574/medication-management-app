import { SignUpForm } from "@/feature/auth/sign-up-form"

export default function SignUpPage() {
  return (
    <div className="container max-w-[450px] py-[120px]">
      <h1 className="text-center text-[24px] font-bold text-[#c2b37f]">
        ユーザー登録
      </h1>

      <div className="mt-[24px]">
        <SignUpForm />
      </div>
    </div>
  )
}
