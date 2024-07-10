"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
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
  name: z.string().min(1, { message: "グループ名を入力してください" }),
})

export function UpdateGroupForm({
  group,
}: {
  group: Database["public"]["Tables"]["groups"]["Row"]
}) {
  const [loading, startTransition] = useTransition()
  const router = useRouter()
  const { toast } = useToast()
  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      name: group.name,
    },
    resolver: zodResolver(schema),
  })

  const onSubmit = ({ name }: z.infer<typeof schema>) => {
    startTransition(() => {
      ;(async () => {})()
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
              <FormLabel>グループ名</FormLabel>
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
        <div>
          <Button disabled={loading} className="block w-full">
            {loading ? "更新中..." : "更新"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
