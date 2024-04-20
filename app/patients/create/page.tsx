"use client"

import { useState } from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

import { toBase64 } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createPatient } from "@/app/actions/patients/create-patient"

const formSchema = z.object({
  imageFile: z.custom<File>().nullable(),
  name: z.string(),
})

export default function CreatePatientPage() {
  const [loading, setLoading] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      imageFile: null,
      name: "",
    },
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async ({ imageFile, name }: z.infer<typeof formSchema>) => {
    setLoading(true)
    if (!imageFile) {
      setLoading(false)
      return
    }
    const formData = new FormData()
    formData.append("imageFile", imageFile)

    const base64Data = await toBase64(imageFile)

    await createPatient({ formData, name, base64Data })
    setLoading(false)
  }

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Create Patient
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Controller
              render={({ field: { onChange, value } }) => (
                <FormItem>
                  <FormLabel htmlFor="imageFile">Image</FormLabel>
                  {value && (
                    <Image
                      src={URL.createObjectURL(value)}
                      width={300}
                      alt="selected_image"
                      height={300}
                    />
                  )}
                  <div className="relative">
                    <label
                      className={`${buttonVariants({
                        variant: "default",
                        size: "default",
                      })} mt-2`}
                      htmlFor="single"
                    >
                      {form.getValues("imageFile")
                        ? "画像を変更"
                        : "画像を選ぶ"}
                    </label>

                    <input
                      style={{
                        visibility: "hidden",
                        position: "absolute",
                        width: 0,
                      }}
                      type="file"
                      id="single"
                      accept="image/*"
                      onChange={(e) => {
                        if (!e.target.files?.[0]) return
                        onChange(e.target.files?.[0] as File)
                      }}
                      disabled={loading}
                    />
                  </div>
                </FormItem>
              )}
              name="imageFile"
              control={form.control}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>名前</FormLabel>
                  <FormControl>
                    <Input placeholder={"your email address"} {...field} />
                  </FormControl>
                  {form.formState.errors.name && (
                    <FormDescription>
                      {form.formState.errors.name.message}
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />
            <Button disabled={loading} type="submit">
              {loading ? "loading..." : "Create Patient"}
            </Button>
          </form>
        </Form>
      </div>
    </section>
  )
}
