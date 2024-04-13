import Link from "next/link"

import { SignUpForm } from "./sign-up-form"

export default function SignUpPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="max-w-[350px]">
        <SignUpForm />
      </div>
      <div>
        <Link href="/login">アカウントをお持ちの方はこちら</Link>
      </div>
    </section>
  )
}
