"use client"

import { useState } from "react"
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "有効なメールアドレスを入力してください" }),
  password: z.string(),
})

const errorSchema = z.object({
  message: z.string(),
})

export function LoginForm({
  loginInfoWithCookies,
}: {
  loginInfoWithCookies: RequestCookie[]
}) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async ({ email, password }: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        throw new Error("ログインに失敗しました")
      }

      router.push("/")
      toast({ description: "ログイン完了" })
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

  const onDropdownMenuItemClick = (value: string) => {
    const loginInfo: {
      email: string
      password: string
    } = JSON.parse(value)

    form.setValue("email", loginInfo.email)
    form.setValue("password", loginInfo.password)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="mt-4 w-full">
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

        <div className="mt-[24px] flex flex-col items-center gap-6  text-sm text-neutral-400">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div>履歴選択</div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {loginInfoWithCookies.map((cookie) => (
                <DropdownMenuItem
                  key={cookie.name}
                  onClick={() => onDropdownMenuItemClick(cookie.value)}
                >
                  {JSON.parse(cookie.value).name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div>
            <Link href="reset-password">パスワードをお忘れですか？</Link>
          </div>
          <div>
            <Link href="/sign-up">アカウントをお持ちでない方はこちら</Link>
          </div>
        </div>
        <Button
          className="mt-[24px] block w-full"
          disabled={loading}
          type="submit"
        >
          {loading ? "loading.." : "ログイン"}
        </Button>
      </form>
    </Form>
  )
}
