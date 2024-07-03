import { Controller, UseFormReturn } from "react-hook-form"
import { z } from "zod"

import { buttonVariants } from "@/components/ui/button"
import { FormItem } from "@/components/ui/form"

import { DrugSelectedItem } from "../../../../drug/drug-selected-item"
import { updatePatientFormSchema } from "../../schema"

export function PatientDrugFormField({
  form,
  loading,
  currentUserName,
  drugs,
}: {
  form: UseFormReturn<z.infer<typeof updatePatientFormSchema>>
  loading: boolean
  currentUserName: string
  drugs: { url: string; userName: string }[]
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-[20px] text-[#C2B37F]">お薬情報</h2>
      <Controller
        render={({ field: { onChange, value } }) => (
          <FormItem>
            {drugs.length > 0 &&
              drugs.map((drug) => (
                <DrugSelectedItem
                  key={drug.url}
                  file={drug.url}
                  onDelete={() => {}}
                  date={new Date()}
                  userName={drug.userName}
                />
              ))}

            {value.length > 0 &&
              value.map((file) => (
                <DrugSelectedItem
                  key={file.name}
                  onDelete={() => {
                    const drugImages = form.getValues("drugImages") as File[]
                    const newDrugImages = drugImages.filter(
                      (_file) => _file !== file
                    )
                    form.setValue("drugImages", newDrugImages)
                  }}
                  file={file}
                  date={new Date()}
                  userName={currentUserName}
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
