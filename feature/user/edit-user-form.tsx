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
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

const schema = z.object({
  name: z.string().min(1, { message: "名前を入力してください" }),
})

type Props = {
  profile: Pick<Database["public"]["Tables"]["profiles"]["Row"], "id" | "name">
}

export function EditUserForm({ profile }: Props) {
  const [loading, startTransition] = useTransition()
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      name: profile.name,
    },
    resolver: zodResolver(schema),
  })

  const onSubmit = ({ name }: z.infer<typeof schema>) => {
    startTransition(() => {
      ;(async () => {
        const response = await updateUser({ id: profile.id, name })
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
          name="name"
          render={({ field }) => (
            <FormItem>
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
        <Button type="submit" disabled={loading} className="block w-full">
          {loading ? "更新中..." : "更新"}
        </Button>
      </form>
    </Form>
  )
}
