"use client"

import { useTransition } from "react"
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

const schema = z.object({
  name: z.string().min(1),
})

export function CreateGroupForm() {
  const [loading, startTransition] = useTransition()
  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(schema),
  })

  const onSubmit = ({ name }: z.infer<typeof schema>) => {
    startTransition(() => {
      ;(async () => {
        console.log(name)
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
