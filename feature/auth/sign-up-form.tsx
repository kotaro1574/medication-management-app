"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
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
    email: z
      .string()
      .email({ message: "有効なメールアドレスを入力してください" }),
    password: z.string(),
    passwordConf: z.string(),
  })
  .refine((data) => data.password === data.passwordConf, {
    message: "パスワードが一致しません",
    path: ["passwordConf"],
  })

const errorSchema = z.object({
  message: z.string(),
})

export function SignUpForm() {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConf: "",
    },
  })

  const onSubmit = async ({ email, password }: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        throw error
      }

      toast({ description: "登録完了メールを確認してください 📩" })
    } catch (error) {
      const parseError = errorSchema.parse(error)
      toast({
        variant: "destructive",
        description: parseError.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="mt-4">
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="mt-4">
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
            <FormItem className="mt-4">
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
        <div className="mt-6">
          <Button className="block w-full" disabled={loading} type="submit">
            {loading ? "loading.." : "新規登録"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
