"use client"

import { useState, useTransition } from "react"
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
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
  const [isSend, setIsSend] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof updateUserFormSchema>>({
    defaultValues: {
      name: profile.name,
      email,
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

        if (email !== value.email) {
          setIsSend(true)
        }
        const response = await updateUser({
          name: value.name,
          email: value.email,
          formData,
        })
        if (response.success) {
          toast({ title: response.message })
          router.push("/user")
        } else {
          if (
            response.error.includes(
              "顔が見つからない画像が含まれています。顔画像を撮り直してください。"
            )
          ) {
            form.setError("faceImages", {
              message: response.error,
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

  if (isSend) {
    return (
      <div className="container max-w-[450px] space-y-6 py-[120px]">
        <h1 className="text-center text-[24px] font-bold text-[#c2b37f]">
          メールアドレス変更
        </h1>
        <div className="mx-auto max-w-[255px] space-y-4">
          <Icons.successCheck className="mx-auto size-20" />
          <p className="max-w-[255px] font-semibold">
            メールアドレス変更用のURLをご入力のメールアドレスに送信しました。
            <br />
            記載された内容に従って、メールアドレス変更を行なってください。
          </p>
        </div>
        <div className="mx-auto max-w-[255px] text-sm text-[#A4A4A4]">
          <p>メールが届かない場合は以下の場合が考えられます</p>
          <ul className="list-disc pl-6">
            <li>迷惑メールフォルダに入ってしまっている場合</li>
            <li>メールアドレスが間違っている場合</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h1 className="text-[20px] text-[#C2B37F]">アカウント情報</h1>
        <div className="mt-4 space-y-4 rounded-2xl bg-white p-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="max-w-[300px] space-y-0">
                <FormLabel className="text-[11px]">名前</FormLabel>
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
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="max-w-[300px] space-y-0">
                <FormLabel className="text-[11px]">メールアドレス</FormLabel>
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
