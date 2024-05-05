"use client"

import { LoginForm } from "@/feature/auth/login-form"

export default function LoginPage() {
  return (
    <div className="px-[60px] py-[120px]">
      <h1 className="text-center text-[24px] font-bold text-[#c2b37f]">
        ログイン
      </h1>

      <div className="mt-[24px]">
        <LoginForm />
      </div>
    </div>
  )
}
