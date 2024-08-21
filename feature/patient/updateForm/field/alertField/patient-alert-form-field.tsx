import { UseFormReturn, useFieldArray } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"

import { updatePatientFormSchema } from "../../schema"
import { PatientAlertFormFieldItem } from "./patient-alert-form-field-item"

export function PatientAlertFormField({
  form,
}: {
  form: UseFormReturn<z.infer<typeof updatePatientFormSchema>>
}) {
  const { fields, append, remove } = useFieldArray({
    name: "alerts",
    control: form.control,
  })

  return (
    <div className="space-y-4">
      <h2 className="text-[20px] text-[#C2B37F]">アラートタイマー</h2>
      {fields.map((field, index) => (
        <PatientAlertFormFieldItem
          key={field.id}
          index={index}
          form={form}
          remove={remove}
        />
      ))}
      <Button
        variant="secondary"
        size="secondary"
        type="button"
        className="block w-full"
        onClick={() =>
          append({
            id: null,
            name: `アラートタイマー${fields.length + 1}`,
            hour: "0",
            minute: "0",
            repeatStetting: null,
            date: null,
            isAlertEnabled: true,
          })
        }
      >
        アラートタイマー追加
      </Button>
    </div>
  )
}
