"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { createGroup } from "@/actions/groups/create-group"
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
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

const schema = z.object({
  name: z.string().min(1, { message: "グループ名を入力してください" }),
})

export function CreateGroupForm({ facilityId }: { facilityId: string }) {
  const [loading, startTransition] = useTransition()
  const router = useRouter()
  const { toast } = useToast()
  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(schema),
  })

  const onSubmit = ({ name }: z.infer<typeof schema>) => {
    startTransition(() => {
      ;(async () => {
        const response = await createGroup({ name, facilityId })
        if (response.success) {
          toast({ title: response.message })
          router.push("/groups")
        } else {
          form.setError("name", { message: response.error })
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
            登録
          </Button>
        </div>
      </form>
    </Form>
  )
}
