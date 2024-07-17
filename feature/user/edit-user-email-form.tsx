"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
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
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

const schema = z.object({
  email: z.string().email({ message: "メールアドレスを入力してください" }),
})

export function EditUserEmailForm() {
  const [loading, startTransition] = useTransition()
  const router = useRouter()
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
  )
}
