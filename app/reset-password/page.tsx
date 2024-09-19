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
import { Icons } from "@/components/ui/icons"
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
      <div className="container max-w-[450px] space-y-6 py-[120px]">
        <h1 className="text-center text-[24px] font-bold text-[#c2b37f]">
          パスワード再設定
        </h1>
        <div className="mx-auto max-w-[255px] space-y-4">
          <Icons.successCheck className="mx-auto size-20" />
          <p className="max-w-[255px] font-semibold">
            パスワード再設定用のURLをご入力のメールアドレスに送信しました。
            <br />
            記載された内容に従って、パスワードの再設定を行なってください。
          </p>
        </div>
        <div className="mx-auto max-w-[255px] text-sm text-[#A4A4A4]">
          <p>メールが届かない場合は以下の場合が考えられます</p>
          <ul className="list-disc pl-6">
            <li>迷惑メールフォルダに入ってしまっている場合</li>
            <li>メールアドレスが間違っている場合</li>
            <li>メールアドレスが登録されていない場合</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-[450px] py-[120px]">
      <h1 className="text-center text-[24px] font-bold text-[#c2b37f]">
        パスワード再設定
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
                    <Input isError={!!form.formState.errors.email} {...field} />
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
