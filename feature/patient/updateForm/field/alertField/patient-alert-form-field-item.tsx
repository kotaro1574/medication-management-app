import { useState } from "react"
import { HourSelect } from "@/feature/patient/hour-select"
import { MinuteSelect } from "@/feature/patient/minute-select"
import { RepeatStettingSelect } from "@/feature/patient/repeat-stetting-select"
import { format } from "date-fns"
import { UseFormReturn } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"

import { updatePatientFormSchema } from "../../schema"

type Props = {
  index: number
  form: UseFormReturn<z.infer<typeof updatePatientFormSchema>>
  remove: (index: number) => void
}

export function PatientAlertFormFieldItem({ index, form, remove }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mt-4 rounded-2xl bg-white p-4 shadow-shadow">
      <div className="flex items-center justify-between">
        <FormField
          control={form.control}
          name={`alerts.${index}.name`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  isError={!!form.formState.errors.alerts?.[index]?.name}
                />
              </FormControl>
              {form.formState.errors.alerts?.[index]?.name && (
                <FormDescription>
                  {form.formState.errors.alerts[index]?.name?.message}
                </FormDescription>
              )}
            </FormItem>
          )}
        />
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
      <div className="mt-6 border-b-[0.5px] border-[#A4A4A4] px-1 py-2">
        <div className="flex items-center justify-between">
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
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
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
                  onValueChange={(value) => {
                    if (value === "null") {
                      field.onChange(null)
                      return
                    }
                    field.onChange(value)
                  }}
                  defaultValue={String(field.value)}
                  disabled={form.watch("alerts")[index].date !== null}
                  isReset={field.value !== null}
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
            <FormItem className="flex max-w-[210px] items-center space-y-0">
              {!field.value ? (
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <button
                        disabled={
                          form.watch("alerts")[index].repeatStetting !== null
                        }
                        type="button"
                        className="text-[#A4A4A4] disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <Icons.circlePlus />
                      </button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto rounded-2xl p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={field.value ?? undefined}
                      onSelect={(value) => {
                        field.onChange(value)
                        setIsOpen(false)
                      }}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              ) : (
                <div className="flex items-center gap-4">
                  <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <p className="cursor-pointer text-[10px] font-bold text-[#A4A4A4]">
                          {format(field.value, "yyyy月M月d日")}
                        </p>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto rounded-2xl p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value ?? undefined}
                        onSelect={(value) => {
                          field.onChange(value)
                          setIsOpen(false)
                        }}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
          onClick={() => {
            const id = form.getValues("alerts")[index].id ?? null
            if (id) {
              form.setValue("deleteAlertIds", [
                ...form.getValues("deleteAlertIds"),
                id,
              ])
            }

            remove(index)
          }}
        >
          削除
        </Button>
      </div>
    </div>
  )
}
