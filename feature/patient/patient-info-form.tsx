"use client"

import { GroupsSelect } from "@/feature/group/groups-select"
import { CareLevelSelect } from "@/feature/patient/care-level-select"
import { GenderRadioGroup } from "@/feature/patient/gender-radio-group"
import { UseFormReturn } from "react-hook-form"
import { z } from "zod"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createPatientFormSchema } from "@/app/patients/create/page"

import { BirthdaySelect } from "./birthday-select"

export function PatientInfoForm({
  form,
}: {
  form: UseFormReturn<z.infer<typeof createPatientFormSchema>>
}) {
  return (
    <div className="mt-4 space-y-4 rounded-2xl bg-white p-4">
      <div className="flex items-center gap-1">
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem className="max-w-[150px] space-y-0">
              <FormLabel className="text-[11px]">名字</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              {form.formState.errors.lastName && (
                <FormDescription>
                  {form.formState.errors.lastName.message}
                </FormDescription>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem className="max-w-[150px] space-y-0">
              <FormLabel className="text-[11px]">名前</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              {form.formState.errors.firstName && (
                <FormDescription>
                  {form.formState.errors.firstName.message}
                </FormDescription>
              )}
            </FormItem>
          )}
        />
      </div>
      <BirthdaySelect form={form} />
      <FormField
        control={form.control}
        name="careLevel"
        render={({ field }) => (
          <FormItem className="max-w-[200px] space-y-0">
            <FormLabel className="text-[11px]">介護度</FormLabel>
            <CareLevelSelect
              onValueChange={field.onChange}
              defaultValue={field.value}
              isError={!!form.formState.errors.careLevel}
            />
            {form.formState.errors.careLevel && (
              <FormDescription>
                {form.formState.errors.careLevel.message}
              </FormDescription>
            )}
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="groupId"
        render={({ field }) => (
          <FormItem className="max-w-[200px] space-y-0">
            <FormLabel className="text-[11px]">グループ</FormLabel>
            <GroupsSelect
              onValueChange={field.onChange}
              defaultValue={field.value}
              isError={!!form.formState.errors.groupId}
            />
            {form.formState.errors.groupId && (
              <FormDescription>
                {form.formState.errors.groupId.message}
              </FormDescription>
            )}
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="gender"
        render={({ field }) => (
          <FormItem className="max-w-[150px] space-y-0">
            <FormLabel className="text-[11px]">性別</FormLabel>
            <FormControl>
              <GenderRadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
              />
            </FormControl>
            {form.formState.errors.gender && (
              <FormDescription>
                {form.formState.errors.gender.message}
              </FormDescription>
            )}
          </FormItem>
        )}
      />
    </div>
  )
}
