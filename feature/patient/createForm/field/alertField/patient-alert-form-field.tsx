import { HourSelect } from "@/feature/patient/hour-select"
import { MinuteSelect } from "@/feature/patient/minute-select"
import { RepeatStettingSelect } from "@/feature/patient/repeat-stetting-select"
import { format } from "date-fns"
import { UseFormReturn, useFieldArray } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Icons } from "@/components/ui/icons"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"

import { createPatientFormSchema } from "../../schema"

export function PatientAlertFormField({
  form,
}: {
  form: UseFormReturn<z.infer<typeof createPatientFormSchema>>
}) {
  const { fields, append, remove } = useFieldArray({
    name: "alerts",
    control: form.control,
  })

  return (
    <div className="space-y-4">
      <h2 className="text-[20px] text-[#C2B37F]">アラートタイマー</h2>
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="mt-4 rounded-2xl bg-white p-4 shadow-shadow"
        >
          <div className="flex items-center justify-between">
            <p className="text-xl text-[#A4A4A4]">{`アラートタイマー${
              index + 1
            }`}</p>
            <FormField
              control={form.control}
              name={`alerts.${index}.isAlertEnabled`}
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
                name={`alerts.${index}.hour`}
                render={({ field }) => (
                  <FormItem className="w-[80px] space-y-0">
                    <FormControl>
                      <HourSelect
                        onValueChange={field.onChange}
                        defaultValue={String(field.value)}
                        isError={!!form.formState.errors?.alerts?.[index]?.hour}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div>:</div>
              <FormField
                control={form.control}
                name={`alerts.${index}.minute`}
                render={({ field }) => (
                  <FormItem className="w-[80px] space-y-0">
                    <FormControl>
                      <MinuteSelect
                        onValueChange={field.onChange}
                        defaultValue={String(field.value)}
                        isError={
                          !!form.formState.errors?.alerts?.[index]?.minute
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
              name={`alerts.${index}.repeatStetting`}
              render={({ field }) => (
                <FormItem className="w-full max-w-[180px] space-y-0">
                  <FormControl>
                    <RepeatStettingSelect
                      onValueChange={field.onChange}
                      defaultValue={String(field.value)}
                      disabled={form.watch("alerts")[index].date !== null}
                      isError={
                        !!form.formState.errors?.alerts?.[index]?.repeatStetting
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center justify-between border-b-[0.5px] border-[#A4A4A4] px-1 py-4">
            <FormLabel className="text-[11px]">日付</FormLabel>
            <FormField
              control={form.control}
              name={`alerts.${index}.date`}
              render={({ field }) => (
                <FormItem className="flex max-w-[200px] items-center space-y-0">
                  {!field.value ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <button
                            disabled={
                              form.watch("alerts")[index].repeatStetting !==
                              null
                            }
                            className={
                              "disabled:cursor-not-allowed disabled:opacity-30"
                            }
                          >
                            <Icons.circlePlus />
                          </button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ?? undefined}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <div className="flex items-center gap-4">
                      <p className="text-[10px] font-bold text-[#A4A4A4]">
                        {format(field.value, "yyyy月M月d日")}
                      </p>
                      <button
                        onClick={() => {
                          field.onChange(null)
                        }}
                      >
                        <Icons.circleMinus />
                      </button>
                    </div>
                  )}
                </FormItem>
              )}
            />
          </div>

          <div className="mt-4 text-right">
            <Button
              className="w-full max-w-[100px]"
              variant="outline"
              size="sm"
              type="button"
              onClick={() => remove(index)}
            >
              削除
            </Button>
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
