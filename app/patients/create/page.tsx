"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createPatient } from "@/actions/patients/create-patient"
import { PatientFacesWebcamDialog } from "@/feature/patient/patient-faces-webcam-dialog"
import { PatientInfoFormField } from "@/feature/patient/patient-info-form-field"
import { createPatientFormSchema } from "@/feature/patient/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"

export default function CreatePatientPage() {
  const [loading, startTransaction] = useTransition()
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

    startTransaction(() => {
      ;(async () => {
        const response = await createPatient({
          formData,
          firstName,
          lastName,
          birthday: `${era}-${year}-${month}-${day}`,
          careLevel,
          groupId,
          gender,
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
    <section className="min-h-screen bg-[#F5F5F5] px-4 pb-8 pt-11">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          <PatientInfoFormField form={form} />
          <div className="space-y-8">
            <div className="flex gap-1">
              <h2 className="text-[20px] text-[#C2B37F]">認証用人物写真</h2>
              <p className="text-[10px] text-[#FF0000]">＊登録必須</p>
            </div>

            <PatientFacesWebcamDialog
              form={form}
              trigger={
                <Button
                  variant="secondary"
                  size="secondary"
                  className="block w-full"
                >
                  顔を登録する
                </Button>
              }
            />
          </div>
          <div>
            <Button disabled={loading} className="block w-full">
              {loading ? "登録中..." : "登録する"}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  )
}
