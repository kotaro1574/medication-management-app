"use client"

import { PatientInfoFormField } from "@/feature/patient/patient-info-form-field"
import { createPatientFormSchema } from "@/feature/patient/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"

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
      <Form {...form}>
        <form onSubmit={console.log} className="space-y-10">
          <PatientInfoFormField form={form} />
          <div className="space-y-8">
            <div className="flex gap-1">
              <h2 className="text-[20px] text-[#C2B37F]">認証用人物写真</h2>
              <p className="text-[10px] text-[#FF0000]">＊登録必須</p>
            </div>
            <Button
              variant={"secondary"}
              size={"secondary"}
              className="block w-full"
            >
              顔を登録する
            </Button>
          </div>
          <div>
            <Button className="block w-full">登録</Button>
          </div>
        </form>
      </Form>
    </section>
  )
}
