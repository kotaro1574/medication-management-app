"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

import { Database } from "@/types/schema.gen"
import { placeholder } from "@/lib/utils"
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
import { useToast } from "@/components/ui/use-toast"
import { updatePatient } from "@/app/actions/patients/update-patient"

const formSchema = z.object({
  imageFile: z.custom<File>().nullable(),
  name: z.string(),
})

type Props = {
  patient: Database["public"]["Tables"]["patients"]["Row"]
  url: string
}

export function UpdatePatientForm({ patient, url }: Props) {
  const [loading, startTransaction] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      imageFile: null,
      name: patient.name ?? "",
    },
    resolver: zodResolver(formSchema),
  })

  const onSubmit = ({ imageFile, name }: z.infer<typeof formSchema>) => {
    if (!imageFile) {
      return
    }
    const formData = new FormData()
    formData.append("imageFile", imageFile)

    startTransaction(() => {
      ;(async () => {
        const response = await updatePatient({
          formData,
          name,
          id: patient.id,
          faceData: {
            faceIds: patient.face_ids ?? [],
            imageId: patient.image_id ?? "",
          },
        })
        if (response.success) {
          setError(null)
          router.push("/patients")
          router.refresh()
          toast({
            title: response.message,
          })
        } else {
          setError(response.error)
        }
      })()
    })
  }

  return (
    <div>
      <div>{error}</div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            render={({ field: { onChange, value } }) => (
              <FormItem>
                <FormLabel htmlFor="imageFile">Image</FormLabel>

                <Image
                  src={!value ? url : URL.createObjectURL(value)}
                  width={300}
                  alt="selected_image"
                  height={300}
                  className="rounded-md object-cover"
                  placeholder={placeholder({ w: 300, h: 300 })}
                />

                <div className="relative">
                  <label
                    className={`${buttonVariants({
                      variant: "default",
                      size: "default",
                    })} mt-2`}
                    htmlFor="single"
                  >
                    画像を変更
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
  )
}
