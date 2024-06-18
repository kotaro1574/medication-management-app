import Image from "next/image"
import { Controller, UseFormReturn } from "react-hook-form"
import { z } from "zod"

import { buttonVariants } from "@/components/ui/button"
import { FormItem } from "@/components/ui/form"

import { createPatientFormSchema } from "./schema"

export function PatientDrugFormField({
  form,
  loading,
}: {
  form: UseFormReturn<z.infer<typeof createPatientFormSchema>>
  loading: boolean
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-[20px] text-[#C2B37F]">お薬情報</h2>
      <Controller
        render={({ field: { onChange, value } }) => (
          <FormItem>
            {value.length > 0 &&
              value.map((file) => (
                <Image
                  key={file.name}
                  src={URL.createObjectURL(file)}
                  width={300}
                  alt="selected_image"
                  height={300}
                />
              ))}
            <div className="relative">
              <label
                className={`${buttonVariants({
                  variant: "secondary",
                  size: "secondary",
                })} block w-full`}
                htmlFor="multi-drug"
              >
                お薬情報を追加
              </label>

              <input
                style={{
                  visibility: "hidden",
                  position: "absolute",
                  width: 0,
                }}
                type="file"
                id="multi-drug"
                accept="image/*"
                multiple
                onChange={(e) => {
                  if (!e.target.files) return
                  onChange(Array.from(e.target.files))
                }}
                disabled={loading}
              />
            </div>
          </FormItem>
        )}
        name="drugImages"
        control={form.control}
      />
    </div>
  )
}
