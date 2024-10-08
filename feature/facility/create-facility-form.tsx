"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
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

import { PlanSelect } from "./plan-select"

const schema = z.object({
  nameJp: z.string().min(1, { message: "施設名を入力してください。" }),
  nameEn: z.string().min(1, { message: "施設名を入力してください。" }),
  email: z
    .string()
    .email({ message: "有効なメールアドレスを入力してください。" }),
  plan: z.enum(["松", "竹", "梅"], { message: "プランを選択してください。" }),
})

export function CreateFacilityForm() {
  const [loading, setLoading] = useState(false)
  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      nameJp: "",
      nameEn: "",
      email: "",
      plan: undefined,
    },
    resolver: zodResolver(schema),
  })

  const onSubmit = (value: z.infer<typeof schema>) => {}

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="nameJp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>施設名（jp）</FormLabel>
              <FormControl>
                <Input {...field} isError={!!form.formState.errors.nameJp} />
              </FormControl>
              {form.formState.errors.nameJp && (
                <FormDescription>
                  {form.formState.errors.nameJp.message}
                </FormDescription>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nameEn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>施設名（en）</FormLabel>
              <FormControl>
                <Input {...field} isError={!!form.formState.errors.nameEn} />
              </FormControl>
              {form.formState.errors.nameEn && (
                <FormDescription>
                  {form.formState.errors.nameEn.message}
                </FormDescription>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>メールアドレス</FormLabel>
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
        <FormField
          control={form.control}
          name="plan"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[11px]">プラン</FormLabel>
              <PlanSelect
                onValueChange={field.onChange}
                defaultValue={field.value}
                isError={!!form.formState.errors.plan}
              />
              {form.formState.errors.plan && (
                <FormDescription>
                  {form.formState.errors.plan.message}
                </FormDescription>
              )}
            </FormItem>
          )}
        />
        <div>
          <Button disabled={loading} className="block w-full">
            {loading ? "登録中..." : "登録"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
