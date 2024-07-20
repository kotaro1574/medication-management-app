"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { updateUser } from "@/actions/user/update-user"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Database } from "@/types/schema.gen"
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

const schema = z.object({
  name: z.string().min(1, { message: "名前を入力してください" }),
  email: z.string().email({ message: "メールアドレスを入力してください" }),
})

type Props = {
  profile: Pick<Database["public"]["Tables"]["profiles"]["Row"], "id" | "name">
  email: string
}

export function EditUserForm({ profile, email }: Props) {
  const [loading, startTransition] = useTransition()
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      name: profile.name,
      email,
    },
    resolver: zodResolver(schema),
  })

  const onSubmit = ({ name, email }: z.infer<typeof schema>) => {
    startTransition(() => {
      ;(async () => {
        const response = await updateUser({ name, email })
        if (response.success) {
          toast({ title: response.message })
          router.push("/user")
        } else {
          toast({ title: response.error, variant: "destructive" })
        }
      })()
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h1 className="text-[20px] text-[#C2B37F]">アカウント情報</h1>
        <div className="mt-4 space-y-4 rounded-2xl bg-white p-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="max-w-[300px] space-y-0">
                <FormLabel className="text-[11px]">名前</FormLabel>
                <FormControl>
                  <Input {...field} isError={!!form.formState.errors.name} />
                </FormControl>
                {form.formState.errors.name && (
                  <FormDescription>
                    {form.formState.errors.name.message}
                  </FormDescription>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="max-w-[300px] space-y-0">
                <FormLabel className="text-[11px]">メールアドレス</FormLabel>
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
        </div>
        <Button type="submit" disabled={loading} className="block w-full">
          {loading ? "更新中..." : "更新"}
        </Button>
      </form>
    </Form>
  )
}
