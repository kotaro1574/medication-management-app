import { cookies } from "next/headers"
import { LoginForm } from "@/feature/auth/login-form"

export default function LoginPage() {
  const loginInfoWithCookies = cookies().getAll("login-info")

  return (
    <div className="container max-w-[450px] py-[120px]">
      <h1 className="text-center text-[24px] font-bold text-[#c2b37f]">
        ログイン
      </h1>

      <div className="mt-[24px]">
        <LoginForm loginInfoWithCookies={loginInfoWithCookies} />
      </div>
    </div>
  )
}
