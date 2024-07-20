"use client"

import { useState, useTransition } from "react"
import { updateUserEmail } from "@/actions/user/update-user-email"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/form"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

const schema = z.object({
  email: z.string().email({ message: "メールアドレスを入力してください" }),
})

export function EditUserEmailForm() {
  const [loading, startTransition] = useTransition()
  const [isSended, setIsSended] = useState(false)

  const { toast } = useToast()

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(schema),
  })

  const onSubmit = ({ email }: z.infer<typeof schema>) => {
    startTransition(() => {
      ;(async () => {
        const response = await updateUserEmail({ email })
        if (response.success) {
          setIsSended(true)
        } else {
          toast({ title: response.error, variant: "destructive" })
        }
      })()
    })
  }

  if (isSended) {
    return (
      <div className="container max-w-[450px] space-y-6 py-[120px]">
        <h1 className="text-center text-[24px] font-bold text-[#c2b37f]">
          メールアドレス変更
        </h1>
        <div className="mx-auto max-w-[255px] space-y-4">
          <Icons.successCheck className="mx-auto size-20" />
          <p className="max-w-[255px] font-semibold">
            メールアドレス変更用のURLをご入力のメールアドレスに送信しました。
            <br />
            記載された内容に従って、メールアドレス変更を行なってください。
          </p>
        </div>
        <div className="mx-auto max-w-[255px] text-sm text-[#A4A4A4]">
          <p>メールが届かない場合は以下の場合が考えられます</p>
          <ul className="list-disc pl-6">
            <li>迷惑メールフォルダに入ってしまっている場合</li>
            <li>メールアドレスが間違っている場合</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl text-[#C2B37F]">メールアドレス変更</h1>
      <p className="text-sm text-[#A4A4A4]">
        新しいメールアドレスを入力してください。
        <br />
        新しい電子メールアドレスにURLが送信されます。
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} isError={!!form.formState.errors.email} />
                </FormControl>
                {form.formState.errors.email && (
                  <FormDescription>
                    {form.formState.errors.email.message}
                  </FormDescription>
                )}
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading} className="block w-full">
            {loading ? "送信中..." : "送信"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
