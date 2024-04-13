import Link from "next/link"

import { LoginForm } from "./login-form"

export default function LoginPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="max-w-[350px]">
        <LoginForm />
      </div>
      <div>
        <Link href="/sign-up">新規登録</Link>
      </div>
    </section>
  )
}
