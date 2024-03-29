"use client"

import { useState } from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

import { toBase64 } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Form, FormItem, FormLabel } from "@/components/ui/form"

const formSchema = z.object({
  imageFile: z.custom<File>().nullable(),
})

export default function GoogleCloudVisionPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      imageFile: null,
    },
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async ({ imageFile }: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)

      if (!imageFile) return

      const base64_image = await toBase64(imageFile)

      const response = await fetch("/api/google-cloud-vision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64_image }),
      })

      const result = await response.json()

      setMessage(result.response)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Google Cloud VisionでOCR
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          画像からテキストを抽出するために、テキストが含まれた画像を撮影してください。
        </p>
      </div>
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
                    {form.getValues("imageFile") ? "画像を変更" : "画像を選ぶ"}
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
          <Button disabled={loading} type="submit">
            {loading ? "loading..." : "OCRする"}
          </Button>
        </form>
      </Form>
      {message && (
        <>
          <p className="text-xl font-bold">抽出されたテキスト👇</p>
          <p className="mt-4 max-w-[700px] text-2xl">{message}</p>
        </>
      )}
    </section>
  )
}
