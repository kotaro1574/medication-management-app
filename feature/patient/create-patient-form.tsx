"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createPatient } from "@/actions/patients/create-patient"
import { PatientDrugFormField } from "@/feature/patient/patient-drug-form-field"
import { PatientFaceImagesFormField } from "@/feature/patient/patient-face-images-form-field"
import { PatientInfoFormField } from "@/feature/patient/patient-info-form-field"
import { patientFormSchema } from "@/feature/patient/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"

// 和暦を西暦に変換するマッピング
const eraToGregorian: { [key: string]: number } = {
  M: 1868, // 明治
  T: 1912, // 大正
  S: 1926, // 昭和
  H: 1989, // 平成
  R: 2019, // 令和
}

export function CreatePatientForm({
  currentUserName,
}: {
  currentUserName: string
}) {
  const [loading, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const form = useForm<z.infer<typeof patientFormSchema>>({
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
    resolver: zodResolver(patientFormSchema),
  })

  const calculateAge = (
    era: string,
    year: string,
    month: string,
    day: string
  ) => {
    const gregorianYear = eraToGregorian[era] + parseInt(year, 10) - 1
    const birthDate = new Date(
      `${gregorianYear}-${String(month).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`
    )
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const isBirthdayPassedThisYear =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() >= birthDate.getDate())
    if (!isBirthdayPassedThisYear) {
      age--
    }
    return age
  }

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
  }: z.infer<typeof patientFormSchema>) => {
    if (!faceImages || faceImages.length === 0) return
    const formData = new FormData()
    faceImages.forEach((file) => {
      formData.append("faceImages", file)
    })

    drugImages.forEach((file) => {
      formData.append("drugImages", file)
    })

    const age = calculateAge(era, year, month, day)
    const birthday = `${era}${year}.${month}.${day}生(${age}歳)`

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
          drugs={[]}
        />
        <div>
          <Button disabled={loading} className="block w-full">
            {loading ? "登録中..." : "登録する"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
