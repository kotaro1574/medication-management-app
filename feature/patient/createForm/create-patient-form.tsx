"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createDrug } from "@/actions/drug/create-drug"
import { createPatient } from "@/actions/patients/create-patient"
import { patientPlanLimitsValidation } from "@/actions/patients/patient-plan-limits-validation"
import { PatientDrugFormField } from "@/feature/patient/createForm/field/drugField/patient-drug-form-field"
import { PatientFaceImagesFormField } from "@/feature/patient/createForm/field/faceImagesField/patient-face-images-form-field"
import { PatientInfoFormField } from "@/feature/patient/createForm/field/infoField/patient-info-form-field"
import { createPatientFormSchema } from "@/feature/patient/createForm/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { uploadImages } from "@/lib/aws/utils"
import { genBirthdayText } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"

import { PatientAlertFormField } from "./field/alertField/patient-alert-form-field"

export function CreatePatientForm({
  currentUserName,
}: {
  currentUserName: string
}) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const form = useForm<z.infer<typeof createPatientFormSchema>>({
    defaultValues: {
      faceImages: [],
      lastName: "",
      firstName: "",
      era: "",
      year: "",
      month: "",
      day: "",
      careLevel: undefined,
      disabilityClassification: undefined,
      groupId: "",
      gender: undefined,
      drugImages: [],
      alerts: [],
    },
    resolver: zodResolver(createPatientFormSchema),
  })

  const onSubmit = async ({
    faceImages,
    lastName,
    firstName,
    era,
    year,
    month,
    day,
    careLevel,
    disabilityClassification,
    groupId,
    drugImages,
    gender,
    alerts,
  }: z.infer<typeof createPatientFormSchema>) => {
    setIsLoading(true)
    try {
      const response = await patientPlanLimitsValidation()

      if (!response.success) {
        throw new Error(response.error)
      }

      const formData = new FormData()
      faceImages.forEach((file) => {
        formData.append("faceImages", file)
      })

      const birthday = genBirthdayText(era, year, month, day)

      const patientResponse = await createPatient({
        formData,
        firstName,
        lastName,
        birthday,
        careLevel,
        disabilityClassification,
        groupId,
        gender,
        alerts,
      })

      if (patientResponse.success && drugImages.length > 0) {
        // クライアントから画像ファイルを直接アップロード(https://vercel.com/guides/how-to-bypass-vercel-body-size-limit-serverless-functions)
        const drugImageIds = await uploadImages(
          drugImages,
          process.env.NEXT_PUBLIC_DRUGS_BUCKET ?? ""
        )

        const drugResponse = await createDrug({
          drugImageIds,
          patientId: patientResponse.patientId,
        })

        if (drugResponse.success) {
          router.push("/patients")
          toast({
            title: patientResponse.message,
          })
        } else {
          throw new Error(drugResponse.error)
        }
      } else if (patientResponse.success) {
        router.push("/patients")
        toast({
          title: patientResponse.message,
        })
      } else {
        throw new Error(patientResponse.error)
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("同じ顔データが既に登録されています。")) {
          form.setError("faceImages", {
            message: error.message,
          })
          return
        }
        if (error.message.includes("There are no faces in the image.")) {
          form.setError("faceImages", {
            message:
              "顔が見つからない画像が含まれています。顔画像を撮り直してください。",
          })
          return
        }
        if (error.message.includes("The image contains more than one face.")) {
          form.setError("faceImages", {
            message:
              "複数の顔が検出されました。1つの顔のみを含む画像を使用してください。",
          })
          return
        }

        toast({
          title: error.message,
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        <PatientInfoFormField form={form} />
        <PatientFaceImagesFormField form={form} />
        <PatientAlertFormField form={form} />
        <PatientDrugFormField
          loading={isLoading}
          form={form}
          currentUserName={currentUserName}
        />
        <div>
          <Button type="submit" disabled={isLoading} className="block w-full">
            {isLoading ? "登録中..." : "登録"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
