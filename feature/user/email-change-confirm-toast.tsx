"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { setLoginInfo } from "@/actions/cookie/set-login-info"
import { User } from "@supabase/supabase-js"

import { useToast } from "@/components/ui/use-toast"

type Props = {
  user: User
  name: string
}

export function EmailChangeConfirmToast({ user, name }: Props) {
  const searchParams = useSearchParams()
  const code = searchParams.get("code")
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (code && mounted && user.email) {
      toast({ title: "メールアドレスを更新しました" })
      setLoginInfo({
        id: user.id,
        name,
      })
    }
  }, [code, mounted, name, toast, user.email, user.id])

  return null
}
