"use client"

import Image from "next/image"
import { AlertCircle } from "lucide-react"
import { UseFormReturn } from "react-hook-form"
import { z } from "zod"

import { placeholder } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"

import { updatePatientFormSchema } from "../../schema"
import { PatientFacesCameraDialog } from "./patient-faces-camera-dialog"

export function PatientFaceImagesFormField({
  form,
  faceUrl,
}: {
  form: UseFormReturn<z.infer<typeof updatePatientFormSchema>>
  faceUrl?: string
}) {
  const isFullFaceImages = form.watch("faceImages")?.length >= 5 || !!faceUrl

  return (
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
      <PatientFacesCameraDialog
        form={form}
        trigger={
          <Button variant="secondary" size="secondary" className="block w-full">
            {isFullFaceImages ? "顔を登録し直す" : "顔を登録する"}
          </Button>
        }
      />
    </div>
  )
}
