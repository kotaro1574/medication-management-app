"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createPatient } from "@/actions/patients/create-patient"
import { PatientDrugFormField } from "@/feature/patient/createForm/field/drugField/patient-drug-form-field"
import { PatientFaceImagesFormField } from "@/feature/patient/createForm/field/faceImagesField/patient-face-images-form-field"
import { PatientInfoFormField } from "@/feature/patient/createForm/field/infoField/patient-info-form-field"
import { createPatientFormSchema } from "@/feature/patient/createForm/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { genBirthdayText } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"

export function CreatePatientForm({
  currentUserName,
}: {
  currentUserName: string
}) {
  const [loading, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
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
      groupId: "",
      gender: undefined,
      drugImages: [],
    },
    resolver: zodResolver(createPatientFormSchema),
  })

  const onSubmit = ({
    faceImages,
    lastName,
    firstName,
    era,
    year,
    month,
    day,
    careLevel,
    groupId,
    drugImages,
    gender,
  }: z.infer<typeof createPatientFormSchema>) => {
    if (!faceImages || faceImages.length === 0) return
    const formData = new FormData()
    faceImages.forEach((file) => {
      formData.append("faceImages", file)
    })

    drugImages.forEach((file) => {
      formData.append("drugImages", file)
    })

    const birthday = genBirthdayText(era, year, month, day)
    startTransition(() => {
      ;(async () => {
        const response = await createPatient({
          formData,
          firstName,
          lastName,
          birthday,
          careLevel,
          groupId,
          gender,
        })
        if (response.success) {
          setError(null)
          router.push("/patients")
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        <PatientInfoFormField form={form} />
        <PatientFaceImagesFormField form={form} />
        {/* <div className="space-y-4">
          <h2 className="text-[20px] text-[#C2B37F]">アラートタイマー</h2>
          <Button variant="secondary" size="secondary" className="block w-full">
            アラートタイマー追加
          </Button>
        </div> */}
        <PatientDrugFormField
          loading={loading}
          form={form}
          currentUserName={currentUserName}
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
