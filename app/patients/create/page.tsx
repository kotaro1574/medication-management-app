"use client"

import { PatientInfoForm } from "@/feature/patient/patient-info-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Form } from "@/components/ui/form"

export const createPatientFormSchema = z.object({
  faceImages: z
    .array(z.custom<File>())
    .min(5, { message: "5枚の画像が必要です。" }),
  lastName: z.string(),
  firstName: z.string(),
  era: z.string(),
  year: z.string(),
  month: z.string(),
  day: z.string(),
  careLevel: z.enum([
    "independence",
    "needs_support_1",
    "needs_support_2",
    "needs_nursing_care_1",
    "needs_nursing_care_2",
    "needs_nursing_care_3",
    "needs_nursing_care_4",
    "needs_nursing_care_5",
  ]),
  groupId: z.string(),
  gender: z.enum(["male", "female"]),
  drugImages: z.array(z.custom<File>()),
})

export default function CreatePatientPage() {
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

  return (
    <section className="min-h-screen bg-[#F5F5F5] px-4 pb-8 pt-11">
      <h2 className="text-[20px] text-[#C2B37F]">利用者情報</h2>
      <Form {...form}>
        <form onSubmit={console.log}>
          <PatientInfoForm form={form} />
        </form>
      </Form>
    </section>
  )
}
