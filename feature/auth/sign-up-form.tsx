"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { logout } from "@/actions/auth/logout"
import { setLoginInfo } from "@/actions/cookie/set-login-info"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"
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
import { useToast } from "@/components/ui/use-toast"

import { FacilitiesSelect } from "../facility/facilities-select"

const formSchema = z.object({
  password: z.string().min(8, {
    message: "パスワードは8文字以上である必要があります。",
  }),
  userName: z.string().min(1, "所有者名を入力してください"),
  facilityId: z.string().min(1, "所属施設を選択してください"),
})

const errorSchema = z.object({
  message: z.string(),
})

export function SignUpForm() {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [isConfirm, setIsConfirm] = useState(false)
  const [logoutLoading, startTransaction] = useTransition()
  const router = useRouter()
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      userName: "",
      facilityId: "",
    },
  })

  const onSubmit = async ({
    password,
    userName,
    facilityId,
  }: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)

      const { data, error } = await supabase.auth.signUp({
        email: `${uuidv4()}@example.com`,
        password,
        options: {
          data: {
            userName,
            facilityId,
          },
        },
      })

      if (error) {
        throw error
      }

      if (data.user) {
        await setLoginInfo({
          id: data.user.id,
          name: userName,
          password,
        })
      }

      setIsConfirm(true)
    } catch (error) {
      const parseError = errorSchema.parse(error)
      if (parseError.message === "Email rate limit exceeded") {
        toast({
          variant: "destructive",
          description:
            "リクエストが多すぎます。しばらく待ってから再度お試しください。",
        })
        return
      }

      toast({
        variant: "destructive",
        description: parseError.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const onLogin = () => {
    router.push("/")
    toast({
      title: "ログインしました",
    })
  }

  const onReset = () => {
    startTransaction(() => {
      ;(async () => {
        const response = await logout()
        if (response.success) {
          form.reset()
          setIsConfirm(false)
        } else {
          toast({ title: response.error, variant: "destructive" })
        }
      })()
    })
  }

  return !isConfirm ? (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="mt-4">
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
          name="userName"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>所有者名</FormLabel>
              <FormControl>
                <Input isError={!!form.formState.errors.userName} {...field} />
              </FormControl>
              {form.formState.errors.userName && (
                <FormDescription>
                  {form.formState.errors.userName.message}
                </FormDescription>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="facilityId"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>所属施設</FormLabel>
              <FacilitiesSelect
                onValueChange={field.onChange}
                defaultValue={field.value}
                isError={!!form.formState.errors.facilityId}
              />

              {form.formState.errors.facilityId && (
                <FormDescription>
                  {form.formState.errors.facilityId.message}
                </FormDescription>
              )}
            </FormItem>
          )}
        />
        <div className="mt-6">
          <Button className="block w-full" disabled={loading} type="submit">
            {loading ? "loading.." : "登録"}
          </Button>
        </div>
      </form>
    </Form>
  ) : (
    <div className="space-y-6">
      <div className="space-y-4 text-center">
        <Icons.successCheck className="mx-auto size-20" />
        <p className="font-semibold">ユーザー登録が完了しました</p>
      </div>
      <Button
        className="block w-full"
        disabled={logoutLoading}
        onClick={onLogin}
      >
        ログインする
      </Button>
      <Button
        className="block w-full"
        disabled={logoutLoading}
        variant={"ghost"}
        onClick={onReset}
      >
        連続でユーザー登録をする
      </Button>
    </div>
  )
}
