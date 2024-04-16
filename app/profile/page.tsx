"use client"

import { useEffect } from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export default function ProfilePage() {
  const supabase = createClient()
  const { toast } = useToast()
  useEffect(() => {
    async function getData() {
      const { data } = await supabase.auth.getUser()
      console.log(data)
      // ...
    }
    getData()
  }, [])

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <h1 className="text-2xl font-bold">ログインに成功しました</h1>
      <div className="pt-10">
        <form action="/api/auth/logout" method="post">
          <Button
            type="submit"
            onClick={() => toast({ description: "ログアウトしました" })}
          >
            ログアウト
          </Button>
        </form>
      </div>
    </section>
  )
}
