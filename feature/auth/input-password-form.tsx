"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { AuthError, PostgrestError } from "@supabase/supabase-js"
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
    password: z.string().min(8, {
      message: "パスワードは8文字以上である必要があります。",
    }),
    passwordConf: z.string(),
  })
  .refine((data) => data.password === data.passwordConf, {
    message: "パスワードが一致しません",
    path: ["passwordConf"],
  })

export function InputPasswordForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AuthError | PostgrestError | null>(null)
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
      const { data, error } = await supabase.auth.updateUser({
        password: password,
      })
      if (error) {
        setError(error)
        throw error
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", data.user.id)
        .single()

      if (profileError) {
        setError(profileError)
        throw profileError
      }

      if (data.user.email) {
        await fetch("/api/set-login-info", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: data.user.id,
            name: profileData.name,
            email: data.user.email,
            password,
          }),
        })
      }
      router.push("/")
      router.refresh()
      toast({ title: "パスワードを更新し、ログインしました！" })
    } catch (error) {
      console.log(error)
    }
  }

  if (error) {
    return (
      <div className="container max-w-[450px] py-[120px]">
        <p className="text-center">エラーが発生しました</p>
        <p className="text-center text-red-500">{error.message}</p>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form className="space-y-6 pt-10" onSubmit={form.handleSubmit(onSubmit)}>
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
  )
}
