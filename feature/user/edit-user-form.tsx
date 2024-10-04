"use client"

import { useTransition } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { updateUser } from "@/actions/user/update-user"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Database } from "@/types/schema.gen"
import { placeholder } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { Form, FormItem, FormLabel } from "@/components/ui/form"
import { Icons } from "@/components/ui/icons"
import { useToast } from "@/components/ui/use-toast"

import { updateUserFormSchema } from "./schema"
import { UserFacesCameraDialog } from "./user-faces-camera-dialog"

type Props = {
  profile: Pick<
    Database["public"]["Tables"]["profiles"]["Row"],
    "id" | "name" | "facility_id"
  >
  email: string
  facility: Pick<
    Database["public"]["Tables"]["facilities"]["Row"],
    "id" | "name"
  >
  faceUrl: string
}

export function EditUserForm({ profile, email, facility, faceUrl }: Props) {
  const [loading, startTransition] = useTransition()
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof updateUserFormSchema>>({
    defaultValues: {
      faceImages: [],
    },
    resolver: zodResolver(updateUserFormSchema),
  })

  const onSubmit = (value: z.infer<typeof updateUserFormSchema>) => {
    startTransition(() => {
      ;(async () => {
        const formData = new FormData()
        value.faceImages.forEach((file) => {
          formData.append("faceImages", file)
        })

        const response = await updateUser({ formData })
        if (response.success) {
          toast({ title: response.message })
          router.push("/user")
        } else {
          if (response.error.includes("同じ顔データが既に登録されています。")) {
            form.setError("faceImages", {
              message: response.error,
            })
            return
          }
          if (response.error.includes("There are no faces in the image.")) {
            form.setError("faceImages", {
              message:
                "顔が見つからない画像が含まれています。顔画像を撮り直してください。",
            })
            return
          }
          if (
            response.error.includes("The image contains more than one face.")
          ) {
            form.setError("faceImages", {
              message:
                "複数の顔が検出されました。1つの顔のみを含む画像を使用してください。",
            })
            return
          }

          toast({
            title: response.error,
            variant: "destructive",
          })
        }
      })()
    })
  }

  const isFullFaceImages = form.watch("faceImages")?.length >= 5 || !!faceUrl

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h1 className="text-[20px] text-[#C2B37F]">アカウント情報</h1>
        <div className="mt-4 space-y-4 rounded-2xl bg-white p-4">
          <FormItem className="max-w-[300px] space-y-0">
            <FormLabel className="text-[11px]">名前</FormLabel>
            <p className="text-base">{profile.name}</p>
          </FormItem>

          <FormItem className="max-w-[300px]">
            <FormLabel className="text-[11px]">所属施設</FormLabel>
            <p className="text-base">{facility.name}</p>
          </FormItem>
        </div>
        <div className="space-y-4">
          <div className="flex gap-1">
            <h2 className="text-[20px] text-[#C2B37F]">認証用人物写真</h2>
            <p className="text-[10px] text-[#FF0000]">＊登録必須</p>
          </div>
          {isFullFaceImages && (
            <div className="relative my-4 flex items-center justify-center">
              <div className="relative w-full max-w-[150px]">
                <AspectRatio ratio={15 / 21}>
                  <Image
                    src={
                      form.watch("faceImages").length
                        ? URL.createObjectURL(form.watch("faceImages")[0])
                        : !!faceUrl
                        ? faceUrl
                        : ""
                    }
                    alt="face image"
                    fill
                    sizes="100%"
                    placeholder={placeholder({ w: 150, h: 210 })}
                    className="rounded-[8px] object-cover"
                  />
                </AspectRatio>
                <div className="absolute right-[-12px] top-[-12px]">
                  <Icons.successCheck />
                </div>
              </div>
            </div>
          )}
          {form.formState.errors.faceImages && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="size-4" />
              <AlertTitle>エラー</AlertTitle>
              <AlertDescription>
                {form.formState.errors.faceImages.message}
              </AlertDescription>
            </Alert>
          )}
          <UserFacesCameraDialog
            form={form}
            trigger={
              <Button
                variant="secondary"
                size="secondary"
                className="block w-full"
              >
                {isFullFaceImages ? "顔を登録し直す" : "顔を登録する"}
              </Button>
            }
          />
        </div>
        <Button type="submit" disabled={loading} className="block w-full">
          {loading ? "更新中..." : "更新"}
        </Button>
      </form>
    </Form>
  )
}
