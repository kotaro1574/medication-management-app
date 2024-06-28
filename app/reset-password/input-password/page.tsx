"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { useToast } from "@/components/ui/use-toast"

const allowedSpecialCharacters = "!@#$%^&*()_+-=[]{}|;:',.<>/?"

const formSchema = z
  .object({
    password: z.string().min(8, {
      message: "パスワードは8文字以上である必要があります。",
    }),
    passwordConf: z.string(),
  })
  .refine((data) => data.password === data.passwordConf, {
    message: "パスワードが一致しません",
    path: ["passwordConf"],
  })

export default function InputPasswordForReset() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      passwordConf: "",
    },
  })

  const onSubmit = async ({ password }: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password: password })
      if (error) {
        setError(error)
        throw error
      }

      router.push("/login")
      toast({ description: "パスワードを更新しました" })
    } catch (error) {
      console.log(error)
    }
  }

  if (error) {
    return (
      <div className="container max-w-[450px] py-[120px]">
        <p className="text-center">エラーが発生しました</p>
      </div>
    )
  }

  return (
    <div className="container max-w-[450px] py-[120px]">
      <h1 className="text-center text-[24px] font-bold text-[#c2b37f]">
        パスワードをリセット
      </h1>
      <p className="mt-[24px] text-center text-sm text-neutral-400">
        新しいパスワードを入力してください
      </p>
      <Form {...form}>
        <form
          className="space-y-6 pt-10"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>パスワード</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    isError={!!form.formState.errors.password}
                    {...field}
                  />
                </FormControl>
                {form.formState.errors.password && (
                  <FormDescription>
                    {form.formState.errors.password.message}
                  </FormDescription>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="passwordConf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>パスワード（確認）</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    isError={!!form.formState.errors.passwordConf}
                    {...field}
                  />
                </FormControl>
                {form.formState.errors.passwordConf && (
                  <FormDescription>
                    {form.formState.errors.passwordConf.message}
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
            {loading ? "loading.." : "更新"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
