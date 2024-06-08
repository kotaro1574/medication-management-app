import { useEffect, useState } from "react"
import { UseFormReturn } from "react-hook-form"
import { z } from "zod"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createPatientFormSchema } from "@/app/patients/create/page"

export function BirthdaySelect({
  form,
}: {
  form: UseFormReturn<z.infer<typeof createPatientFormSchema>>
}) {
  const eras = ["R", "H", "S", "T", "M"]
  const [years, setYears] = useState<number[]>([])
  const [days, setDays] = useState<number[]>([])

  console.log(form.watch())

  const selectedEra = form.watch("era")
  const selectedMonth = form.watch("month")

  useEffect(() => {
    const maxYears: { [key: string]: number } = {
      R: new Date().getFullYear() - 2018, // 現在の年 - 2018 (令和1年 = 2019年)
      H: 31,
      S: 64,
      T: 15,
      M: 45,
    }

    if (selectedEra) {
      const maxYear = maxYears[selectedEra]
      setYears(Array.from({ length: maxYear }, (_, i) => i + 1))
      if (Number(form.watch("year")) > maxYear) {
        form.setValue("year", "")
      }
    }
  }, [form, selectedEra])

  useEffect(() => {
    if (selectedMonth) {
      const daysInMonth = new Date(2024, Number(selectedMonth), 0).getDate()
      setDays(Array.from({ length: daysInMonth }, (_, i) => i + 1))
      if (Number(form.watch("day")) > daysInMonth) {
        form.setValue("day", "")
      }
    }
  }, [form, selectedMonth])

  return (
    <div className="flex items-end gap-1">
      <FormField
        control={form.control}
        name="era"
        render={({ field }) => (
          <FormItem className="w-full max-w-[60px] space-y-0">
            <FormLabel className="text-[11px]">生年月日</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger isError={!!form.formState.errors.era}>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="min-w-[60px]">
                  {eras.map((era) => (
                    <SelectItem
                      isShowIndicator={false}
                      className="pl-5"
                      key={era}
                      value={era}
                    >
                      {era}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            {form.formState.errors.era && (
              <FormDescription>
                {form.formState.errors.era.message}
              </FormDescription>
            )}
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="year"
        render={({ field }) => (
          <FormItem className="w-full max-w-[60px] space-y-0">
            <FormControl>
              <Select
                onValueChange={field.onChange}
                disabled={!selectedEra}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger isError={!!form.formState.errors.year}>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="min-w-[60px]">
                  {years.map((year) => (
                    <SelectItem
                      isShowIndicator={false}
                      key={year}
                      className="pl-5"
                      value={`${year}`}
                    >
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            {form.formState.errors.year && (
              <FormDescription>
                {form.formState.errors.year.message}
              </FormDescription>
            )}
          </FormItem>
        )}
      />
      <div className="text-sm">年</div>
      <FormField
        control={form.control}
        name="month"
        render={({ field }) => (
          <FormItem className="w-full max-w-[60px] space-y-0">
            <FormControl>
              <Select
                onValueChange={field.onChange}
                disabled={!selectedEra}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger isError={!!form.formState.errors.month}>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="min-w-[60px]">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <SelectItem
                      isShowIndicator={false}
                      key={month}
                      className="pl-5"
                      value={`${month}`}
                    >
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            {form.formState.errors.month && (
              <FormDescription>
                {form.formState.errors.month.message}
              </FormDescription>
            )}
          </FormItem>
        )}
      />
      <div className="text-sm">月</div>
      <FormField
        control={form.control}
        name="day"
        render={({ field }) => (
          <FormItem className="w-full max-w-[60px] space-y-0">
            <FormControl>
              <Select
                onValueChange={field.onChange}
                disabled={!selectedMonth}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger isError={!!form.formState.errors.day}>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="min-w-[60px]">
                  {days.map((day) => (
                    <SelectItem
                      isShowIndicator={false}
                      key={day}
                      className="pl-5"
                      value={`${day}`}
                    >
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            {form.formState.errors.day && (
              <FormDescription>
                {form.formState.errors.day.message}
              </FormDescription>
            )}
          </FormItem>
        )}
      />
      <div className="text-sm">日</div>
    </div>
  )
}
