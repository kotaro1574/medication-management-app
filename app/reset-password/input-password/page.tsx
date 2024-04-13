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

const formSchema = z
  .object({
    password: z.string(),
    passwordConf: z.string(),
  })
  .refine((data) => data.password === data.passwordConf, {
    message: "パスワードが一致しません",
    path: ["passwordConf"],
  })

export default function InputPasswordForReset() {
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
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 text-center sm:px-6 lg:px-8 lg:pt-32">
        <p>エラーが発生しました</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 text-center sm:px-6 md:w-1/2 lg:w-1/4 lg:px-8 lg:pt-32">
      <p>新しいパスワードを入力してください</p>
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
                  <Input type="password" {...field} />
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
                  <Input type="password" {...field} />
                </FormControl>
                {form.formState.errors.passwordConf && (
                  <FormDescription>
                    {form.formState.errors.passwordConf.message}
                  </FormDescription>
                )}
              </FormItem>
            )}
          />
          <Button className="block w-full" type="submit">
            更新
          </Button>
        </form>
      </Form>
    </div>
  )
}
