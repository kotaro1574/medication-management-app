"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createDrug } from "@/actions/drug/create-drug"
import { updatePatient } from "@/actions/patients/update-patient"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Database } from "@/types/schema.gen"
import { drugImagesUpload } from "@/lib/aws/utils"
import { extractBirthdayInfo, genBirthdayText } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"

import { DeletePatientDialog } from "../delete-patient-dialog"
import { PatientAlertFormField } from "./field/alertField/patient-alert-form-field"
import { PatientDrugFormField } from "./field/drugField/patient-drug-form-field"
import { PatientFaceImagesFormField } from "./field/faceImagesField/patient-face-images-form-field"
import { PatientInfoFormField } from "./field/infoField/patient-info-form-field"
import { updatePatientFormSchema } from "./schema"

type Props = {
  faceData: {
    faceIds: string[]
    imageIds: string[]
  }
  drugImageIds: string[]
  patient: Database["public"]["Tables"]["patients"]["Row"]
  faceUrl: string
  registeredDrugs: { id: string; url: string; userName: string }[]
  currentUserName: string
  alerts: Database["public"]["Tables"]["alerts"]["Row"][]
}

export function UpdatePatientForm({
  currentUserName,
  patient,
  faceData,
  faceUrl,
  registeredDrugs,
  drugImageIds,
  alerts,
}: Props) {
  const [isLoading, setIsLoading] = useState(false)
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
      disabilityClassification: patient.disability_classification,
      groupId: patient.group_id,
      gender: patient.gender,
      drugImages: [],
      deleteDrugIds: [],
      alerts: alerts.map((alert) => ({
        id: alert.id,
        name: alert.name,
        hour: String(alert.hour),
        minute: String(alert.minute),
        repeatStetting: alert.repeat_setting,
        date: alert.date ? new Date(alert.date) : null,
        isAlertEnabled: alert.is_alert_enabled,
      })),
      deleteAlertIds: [],
    },
    resolver: zodResolver(updatePatientFormSchema),
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
    deleteDrugIds,
    alerts,
    deleteAlertIds,
  }: z.infer<typeof updatePatientFormSchema>) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      faceImages.forEach((file) => {
        formData.append("faceImages", file)
      })

      const birthday = genBirthdayText(era, year, month, day)

      const patientResponse = await updatePatient({
        patientId: patient.id,
        formData,
        firstName,
        lastName,
        birthday,
        careLevel,
        disabilityClassification,
        groupId,
        gender,
        deleteDrugIds,
        alerts,
        deleteAlertIds,
      })

      if (patientResponse.success && drugImages.length > 0) {
        // クライアントから画像ファイルを直接アップロード(https://vercel.com/guides/how-to-bypass-vercel-body-size-limit-serverless-functions)
        const drugImageIds = await drugImagesUpload(drugImages)

        const drugResponse = await createDrug({
          drugImageIds,
          patientId: patient.id,
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
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          <PatientInfoFormField form={form} />
          <PatientFaceImagesFormField form={form} faceUrl={faceUrl} />
          <PatientAlertFormField form={form} />
          <PatientDrugFormField
            registeredDrugs={registeredDrugs}
            loading={isLoading}
            form={form}
            currentUserName={currentUserName}
          />
          <div>
            <Button disabled={isLoading} className="block w-full">
              {isLoading ? "更新中..." : "更新"}
            </Button>
          </div>
        </form>
      </Form>
      <DeletePatientDialog
        patient={patient}
        faceData={faceData}
        drugImageIds={drugImageIds}
        trigger={
          <Button
            disabled={isLoading}
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
