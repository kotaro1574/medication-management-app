"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { AuthError } from "@supabase/supabase-js"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "有効なメールアドレスを入力してください" }),
})

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [isSend, setIsSend] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async ({ email }: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${location.origin}/reset-password/input-password`,
      })
      if (error) {
        setError(error)
        throw error
      }
      setIsSend(true)
    } catch (error) {
      console.log(error)
    }
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 text-center sm:px-6 lg:px-8 lg:pt-32">
        <p>エラーが発生しました</p>
      </div>
    )
  }

  if (isSend) {
    return (
      <div className="container max-w-[450px] py-[120px]">
        <p className="text-center">メールを送信しました</p>
      </div>
    )
  }
  return (
    <div className="container max-w-[450px] py-[120px]">
      <h1 className="text-center text-[24px] font-bold text-[#c2b37f]">
        パスワードを忘れた場合
      </h1>
      <p className="mt-[24px] text-center text-sm text-neutral-400">
        アカウントに結びついている
        <br />
        メールアドレスを入力してください
      </p>
      <div className="mt-[24px]">
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>メールアドレス</FormLabel>
                  <FormControl>
                    <Input placeholder={"your email address"} {...field} />
                  </FormControl>
                  {form.formState.errors.email && (
                    <FormDescription>
                      {form.formState.errors.email.message}
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />
            <Button
              className="mt-[24px] block w-full"
              disabled={loading}
              type="submit"
            >
              {loading ? "loading.." : "送信"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
