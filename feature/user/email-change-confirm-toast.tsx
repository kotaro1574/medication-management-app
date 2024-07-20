"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

import { useToast } from "@/components/ui/use-toast"

export function EmailChangeConfirmToast() {
  const searchParams = useSearchParams()
  const code = searchParams.get("code")
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (code && mounted) {
      console.log(code)
      toast({ title: "メールアドレスを更新しました" })
    }
  }, [code, mounted, toast])

  return null
}
