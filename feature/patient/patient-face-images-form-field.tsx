"use client"

import Image from "next/image"
import { PatientFacesWebcamDialog } from "@/feature/patient/patient-faces-webcam-dialog"
import { patientFormSchema } from "@/feature/patient/schema"
import { UseFormReturn } from "react-hook-form"
import { z } from "zod"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"

export function PatientFaceImagesFormField({
  form,
}: {
  form: UseFormReturn<z.infer<typeof patientFormSchema>>
}) {
  const isFullFaceImages = form.watch("faceImages")?.length >= 5

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
                src={URL.createObjectURL(form.watch("faceImages")[0])}
                alt="face image"
                fill
                className="rounded-[8px] object-cover"
              />
            </AspectRatio>
            <div className="absolute right-[-12px] top-[-12px]">
              <Icons.successCheck />
            </div>
          </div>
        </div>
      )}
      <PatientFacesWebcamDialog
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
