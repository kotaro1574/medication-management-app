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

const formSchema = z
  .object({
    email: z
      .string()
      .email({ message: "有効なメールアドレスを入力してください" }),
    password: z.string(),
    passwordConf: z.string(),
    userName: z.string(),
    belong: z.string(),
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
      userName: "",
      belong: "",
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
                <Input {...field} />
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
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>所有者名</FormLabel>
              <FormControl>
                <Input {...field} />
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
          name="belong"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>所属施設</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>施設を選択</SelectLabel>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              {form.formState.errors.belong && (
                <FormDescription>
                  {form.formState.errors.belong.message}
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
