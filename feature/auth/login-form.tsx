"use client"

import { useState, useTransition } from "react"
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { login } from "@/actions/auth/login"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
  id: z.string().min(1, "idを入力してください"),
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
      id: "",
      password: "",
    },
  })

  const onSubmit = async ({ id, password }: z.infer<typeof formSchema>) => {
    startTransaction(() => {
      ;(async () => {
        const response = await login({ id, password })

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
      id: string
      password: string
    } = JSON.parse(value)

    form.setValue("id", loginInfo.id)
    form.setValue("password", loginInfo.password)
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
            name="id"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>id</FormLabel>
                <FormControl>
                  <Input isError={!!form.formState.errors.id} {...field} />
                </FormControl>
                {form.formState.errors.id && (
                  <FormDescription>
                    {form.formState.errors.id.message}
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
