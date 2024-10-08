"use client"

import { useState } from "react"
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

import { PlanSelect } from "./plan-select"

type Props = {
  facility: Database["public"]["Tables"]["facilities"]["Row"]
}

const schema = z.object({
  nameJp: z.string().min(1, { message: "施設名を入力してください。" }),
  nameEn: z.string().min(1, { message: "施設名を入力してください。" }),
  email: z
    .string()
    .email({ message: "有効なメールアドレスを入力してください。" }),
  plan: z.enum(["松", "竹", "梅"], { message: "プランを選択してください。" }),
})

export function UpdateFacilityForm({ facility }: Props) {
  const [loading, setLoading] = useState(false)
  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      nameJp: facility.name_jp,
      nameEn: facility.name_en,
      email: facility.email,
      plan: facility.plan,
    },
    resolver: zodResolver(schema),
  })

  const onSubmit = async (value: z.infer<typeof schema>) => {
    try {
      setLoading(true)

      //   const response = await updateFacility({
      //     id: facility.id,
      //     name_jp: value.nameJp,
      //     name_en: value.nameEn,
      //     email: value.email,
      //     plan: value.plan,
      //   })

      //   if (response.success) {
      //     toast({ title: response.message })
      //     router.push("/facilities")
      //   } else {
      //     form.setError("nameJp", { message: response.error })
      //   }
    } catch (error) {
      // えらーの処理
    } finally {
      setLoading(false)
    }
  }

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
            {loading ? "更新中..." : "更新"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
