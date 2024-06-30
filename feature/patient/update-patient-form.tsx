"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { patientFormSchema } from "@/feature/patient/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Database } from "@/types/schema.gen"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"

import { DeletePatientDialog } from "./delete-patient-dialog"
import { PatientInfoFormField } from "./patient-info-form-field"

type Props = {
  faceImageIds: string[]
  drugImageIds: string[]
  patient: Database["public"]["Tables"]["patients"]["Row"]
  faceUrl: string
  drugUrls: string[]
}

export function UpdatePatientForm({
  patient,
  faceUrl,
  drugUrls,
  faceImageIds,
  drugImageIds,
}: Props) {
  const [loading, startTransaction] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const extractInfo = (input_str: string) => {
    const pattern = /([A-Z])(\d+)\.(\d+)\.(\d+)生\((\d+)歳\)/
    const match = input_str.match(pattern)

    if (match) {
      const era = String(match[1])
      const year = String(match[2])
      const month = String(match[3])
      const day = String(match[4])
      const age = String(match[5])

      return { era, year, month, day, age }
    } else {
      return {
        era: "",
        year: "",
        month: "",
        day: "",
        age: "",
      }
    }
  }

  const { era, year, month, day } = extractInfo(patient.birthday)
  const form = useForm<z.infer<typeof patientFormSchema>>({
    defaultValues: {
      faceImages: [],
      lastName: patient.last_name,
      firstName: patient.first_name,
      era: era,
      year: year,
      month: month,
      day: day,
      careLevel: patient.care_level,
      groupId: patient.group_id,
      gender: patient.gender,
      drugImages: [],
    },
    resolver: zodResolver(patientFormSchema),
  })

  const onSubmit = ({ faceImages }: z.infer<typeof patientFormSchema>) => {
    if (!faceImages) {
      return
    }
    // const formData = new FormData()
    // formData.append("faceImages", faceImages)

    startTransaction(() => {
      ;(async () => {
        // const response = await updatePatient({
        //   formData,
        //   name,
        //   id: patient.id,
        //   faceData: {
        //     faceIds: patient.face_ids ?? [],
        //     imageId: patient.image_id ?? "",
        //   },
        // })
        // if (response.success) {
        //   setError(null)
        //   router.push("/patients")
        //   router.refresh()
        //   toast({
        //     title: response.message,
        //   })
        // } else {
        //   setError(response.error)
        // }
      })()
    })
  }

  return (
    <div>
      <div>{error}</div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <PatientInfoFormField form={form} />
        </form>
      </Form>
      <DeletePatientDialog
        patient={patient}
        faceImageIds={faceImageIds}
        drugImageIds={drugImageIds}
        trigger={
          <Button disabled={loading} className="mt-6" variant={"destructive"}>
            削除する
          </Button>
        }
      />
    </div>
  )
}
