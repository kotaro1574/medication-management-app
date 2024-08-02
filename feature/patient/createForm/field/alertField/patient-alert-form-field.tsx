import { HourSelect } from "@/feature/patient/hour-select"
import { MinuteSelect } from "@/feature/patient/minute-select"
import { RepeatStettingSelect } from "@/feature/patient/repeat-stetting-select"
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
          <div className="mt-6 flex items-center justify-between border-b-[0.5px] border-[#A4A4A4] px-1 py-2">
            <FormLabel className="w-full text-[11px]">時間</FormLabel>
            <div className="flex w-auto flex-1 items-center gap-2">
              <FormField
                control={form.control}
                name={`alert.${index}.hour`}
                render={({ field }) => (
                  <FormItem className="w-[80px] space-y-0">
                    <FormControl>
                      <HourSelect
                        onValueChange={field.onChange}
                        defaultValue={String(field.value)}
                        isError={!!form.formState.errors?.alert?.[index]?.hour}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div>:</div>
              <FormField
                control={form.control}
                name={`alert.${index}.minute`}
                render={({ field }) => (
                  <FormItem className="w-[80px] space-y-0">
                    <FormControl>
                      <MinuteSelect
                        onValueChange={field.onChange}
                        defaultValue={String(field.value)}
                        isError={
                          !!form.formState.errors?.alert?.[index]?.minute
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex items-center justify-between border-b-[0.5px] border-[#A4A4A4]  px-1 py-2">
            <FormLabel className="text-[11px]">繰り返し設定</FormLabel>
            <FormField
              control={form.control}
              name={`alert.${index}.repeatStetting`}
              render={({ field }) => (
                <FormItem className="w-full max-w-[180px] space-y-0">
                  <FormControl>
                    <RepeatStettingSelect
                      onValueChange={field.onChange}
                      defaultValue={String(field.value)}
                      isError={
                        !!form.formState.errors?.alert?.[index]?.repeatStetting
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center justify-between border-b-[0.5px] border-[#A4A4A4] px-1 py-2">
            <FormLabel className="text-[11px]">日付</FormLabel>
            <FormField
              control={form.control}
              name={`alert.${index}.date`}
              render={({ field }) => (
                <FormItem className="max-w-[200px] space-y-0">
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <Button
            className="mt-4 w-full max-w-[100px]"
            variant="secondary"
            size="secondary"
            type="button"
          >
            削除
          </Button>
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
