"use client"

import { useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { Button } from "@/components/ui/button"

export default async function ProfilePage() {
  const supabase = createClientComponentClient()
  useEffect(() => {
    async function getData() {
      const { data } = await supabase.auth.getSession()
      console.log(data)
      // ...
    }
    getData()
  }, [])

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <h1 className="text-2xl font-bold">ログインに成功しました</h1>
      <div className="pt-10">
        <form action="/auth/logout" method="post">
          <Button type="submit">ログアウト</Button>
        </form>
      </div>
    </section>
  )
}
