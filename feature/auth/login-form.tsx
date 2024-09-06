"use client"

import { useState, useTransition } from "react"
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { faceLogin } from "@/actions/auth/face-login"
import { generateCustomToken } from "@/actions/auth/generate-custom-token"
import { login } from "@/actions/auth/login"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { createClient } from "@/lib/supabase/client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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

import { FaceLoginCameraDialog } from "./face-login-camera-dialog"

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "有効なメールアドレスを入力してください" }),
  password: z.string(),
})

export function LoginForm({
  loginInfoWithCookies,
}: {
  loginInfoWithCookies: RequestCookie[]
}) {
  const [loading, startTransaction] = useTransition()
  const [error, setError] = useState<string | null>(null)
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
    startTransaction(() => {
      ;(async () => {
        const response = await login({ email, password })

        if (response.success) {
          toast({ title: response.message })
          router.push("/")
        } else {
          if (response.error === "Invalid login credentials") {
            setError("メールアドレスまたはパスワードが間違っています")
            return
          }
          toast({ title: response.error, variant: "destructive" })
        }
      })()
    })
  }

  const onDropdownMenuItemClick = (value: string) => {
    const loginInfo: {
      email: string
      password: string
    } = JSON.parse(value)

    form.setValue("email", loginInfo.email)
    form.setValue("password", loginInfo.password)
  }

  const onFaceAuthClick = async () => {
    try {
      // とりあえず固定のユーザーIDでトークンを生成
      const { accessToken, refreshToken } = await generateCustomToken(
        "686a239a-125a-4d50-920a-b8855fdbbda3"
      )

      const supabase = createClient()

      if (!accessToken || !refreshToken) {
        throw new Error("トークンの生成に失敗しました")
      }

      // Supabaseセッションを設定
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      })

      if (error) {
        throw error
      }

      console.log(data.session)
      console.log(data.user)

      // ログイン成功
      toast({ title: "ログインに成功しました" })
      router.push("/")
      router.refresh()
    } catch (error) {
      if (error instanceof Error) {
        toast({ title: error.message, variant: "destructive" })
      }
    }
  }

  return (
    <div>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="size-4" />
          <AlertTitle>エラー</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
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
            {loginInfoWithCookies.length > 0 && (
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
            )}
            <div>
              <Link href="reset-password">パスワードをお忘れですか？</Link>
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
      <FaceLoginCameraDialog
        trigger={
          <Button
            className="mt-[24px] block w-full"
            disabled={loading}
            type="button"
          >
            顔認証でログイン
          </Button>
        }
      />
    </div>
  )
}
