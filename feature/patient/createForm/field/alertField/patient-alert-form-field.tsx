import { UseFormReturn, useFieldArray } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

import { createPatientFormSchema } from "../../schema"

export function PatientAlertFormField({
  form,
}: {
  form: UseFormReturn<z.infer<typeof createPatientFormSchema>>
}) {
  const { fields, append, remove } = useFieldArray({
    name: "alert",
    control: form.control,
  })

  return (
    <div className="space-y-4">
      <h2 className="text-[20px] text-[#C2B37F]">アラートタイマー</h2>
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="mt-4 space-y-4 rounded-2xl bg-white p-4 shadow-shadow"
        >
          <div className="">
            <div className="flex items-center justify-between">
              <p className="text-xl text-[#A4A4A4]">{`アラートタイマー${
                index + 1
              }`}</p>
              <FormField
                control={form.control}
                name={`alert.${index}.isAlertEnabled`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name={`alert.${index}.hour`}
              render={({ field }) => (
                <>
                  <FormItem className="max-w-[200px] space-y-0">
                    <FormLabel className="text-[11px]">時間</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                </>
              )}
            />
            <FormField
              control={form.control}
              name={`alert.${index}.minute`}
              render={({ field }) => (
                <>
                  <FormItem className="max-w-[200px] space-y-0">
                    <FormLabel className="text-[11px]">分</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                </>
              )}
            />
            <FormField
              control={form.control}
              name={`alert.${index}.repeatStetting`}
              render={({ field }) => (
                <>
                  <FormItem className="max-w-[200px] space-y-0">
                    <FormLabel className="text-[11px]">繰り返し設定</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                </>
              )}
            />
            <FormField
              control={form.control}
              name={`alert.${index}.date`}
              render={({ field }) => (
                <>
                  <FormItem className="max-w-[200px] space-y-0">
                    <FormLabel className="text-[11px]">日</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                </>
              )}
            />
          </div>
        </div>
      ))}
      <Button
        variant="secondary"
        size="secondary"
        type="button"
        className="block w-full"
        onClick={() =>
          append({
            hour: 0,
            minute: 0,
            repeatStetting: "",
            date: "",
            isAlertEnabled: true,
          })
        }
      >
        アラートタイマー追加
      </Button>
    </div>
  )
}
