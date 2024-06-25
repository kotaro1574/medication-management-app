"use client"

import { useState } from "react"
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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

import { FacilitiesSelect } from "../facility/facilities-select"

const allowedSpecialCharacters = "!@#$%^&*()_+-=[]{}|;:',.<>/?"

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "有効なメールアドレスを入力してください" }),
  password: z
    .string()
    .min(8, {
      message: "パスワードは8文字以上である必要があります。",
    })
    .regex(/^(?=.*[a-z])/, {
      message:
        "パスワードには少なくとも1つの小文字が含まれている必要があります。",
    })
    .regex(/^(?=.*[A-Z])/, {
      message:
        "パスワードには少なくとも1つの大文字が含まれている必要があります。",
    })
    .regex(/^(?=.*[0-9])/, {
      message:
        "パスワードには少なくとも1つの数字が含まれている必要があります。",
    })
    .regex(/^(?=.*[!@#$%^&*()_+\-=[\]{}|;:',.<>/?])/, {
      message: `パスワードには少なくとも1つの特殊文字が含まれている必要があります。使用できる特殊文字: ${allowedSpecialCharacters}`,
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
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      userName: "",
      facilityId: "",
    },
  })

  const onSubmit = async ({
    email,
    password,
    userName,
    facilityId,
  }: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            userName,
            facilityId,
          },
        },
      })

      console.log(data, error)

      if (error) {
        throw error
      }

      // 登録されているメールアドレスの場合、空の配列が返ってくる。
      const identities = data.user?.identities
      if (identities?.length === 0) {
        throw new Error("このメールアドレスは既に登録されています")
      }

      if (data.user) {
        await setLoginInfo({
          id: data.user.id,
          name: userName,
          email,
          password,
        })
      }

      toast({ description: "登録完了メールを確認してください 📩" })
    } catch (error) {
      const parseError = errorSchema.parse(error)

      if (parseError.message === "User already registered") {
        form.setError("email", {
          message: "このメールアドレスは既に登録されています",
        })
        return
      }

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
  )
}
