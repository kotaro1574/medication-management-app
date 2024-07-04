"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { updatePatient } from "@/actions/patients/update-patient"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Database } from "@/types/schema.gen"
import { extractBirthdayInfo, genBirthdayText } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"

import { DeletePatientDialog } from "../delete-patient-dialog"
import { PatientDrugFormField } from "./field/drugField/patient-drug-form-field"
import { PatientFaceImagesFormField } from "./field/faceImagesField/patient-face-images-form-field"
import { PatientInfoFormField } from "./field/infoField/patient-info-form-field"
import { updatePatientFormSchema } from "./schema"

type Props = {
  faceImageIds: string[]
  drugImageIds: string[]
  patient: Database["public"]["Tables"]["patients"]["Row"]
  faceUrl: string
  registeredDrugs: { id: string; url: string; userName: string }[]
  currentUserName: string
}

export function UpdatePatientForm({
  currentUserName,
  patient,
  faceUrl,
  registeredDrugs,
  faceImageIds,
  drugImageIds,
}: Props) {
  const [loading, startTransaction] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const { era, year, month, day } = extractBirthdayInfo(patient.birthday)
  const form = useForm<z.infer<typeof updatePatientFormSchema>>({
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
      deleteDrugIds: [],
    },
    resolver: zodResolver(updatePatientFormSchema),
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
    deleteDrugIds,
  }: z.infer<typeof updatePatientFormSchema>) => {
    const formData = new FormData()
    faceImages.forEach((file) => {
      formData.append("faceImages", file)
    })

    drugImages.forEach((file) => {
      formData.append("drugImages", file)
    })

    const birthday = genBirthdayText(era, year, month, day)
    startTransaction(() => {
      ;(async () => {
        const response = await updatePatient({
          patientId: patient.id,
          formData,
          firstName,
          lastName,
          birthday,
          careLevel,
          groupId,
          gender,
          deleteDrugIds,
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          <PatientInfoFormField form={form} />
          <PatientFaceImagesFormField form={form} faceUrl={faceUrl} />
          <PatientDrugFormField
            registeredDrugs={registeredDrugs}
            loading={loading}
            form={form}
            currentUserName={currentUserName}
          />
          <div>
            <Button disabled={loading} className="block w-full">
              {loading ? "更新中" : "更新"}
            </Button>
          </div>
        </form>
      </Form>
      <DeletePatientDialog
        patient={patient}
        faceImageIds={faceImageIds}
        drugImageIds={drugImageIds}
        trigger={
          <Button
            disabled={loading}
            className="mt-10 block w-full"
            variant={"ghost"}
          >
            利用者情報を削除
          </Button>
        }
      />
    </div>
  )
}
