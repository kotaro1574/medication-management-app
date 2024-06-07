"use client"

import { GroupsSelect } from "@/feature/group/groups-select"
import { CareLevelSelect } from "@/feature/patient/care-level-select"
import { GenderRadioGroup } from "@/feature/patient/gender-radio-group"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const formSchema = z.object({
  faceImages: z
    .array(z.custom<File>())
    .min(5, { message: "5枚の画像が必要です。" }),
  lastName: z.string(),
  firstName: z.string(),
  birthday: z.string(),
  careLevel: z.enum([
    "independence",
    "needs_support_1",
    "needs_support_2",
    "needs_nursing_care_1",
    "needs_nursing_care_2",
    "needs_nursing_care_3",
    "needs_nursing_care_4",
    "needs_nursing_care_5",
  ]),
  groupId: z.string(),
  gender: z.enum(["male", "female"]),
  drugImages: z.array(z.custom<File>()),
})

export default function CreatePatientPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      faceImages: [],
      lastName: "",
      firstName: "",
      birthday: "",
      careLevel: undefined,
      groupId: "",
      gender: undefined,
      drugImages: [],
    },
    resolver: zodResolver(formSchema),
  })

  return (
    <section className="min-h-screen bg-[#F5F5F5] px-4 pb-8 pt-11">
      <h2 className="text-[20px] text-[#C2B37F]">利用者情報</h2>
      <div className="mt-4 rounded-2xl bg-white p-4">
        <Form {...form}>
          <form onSubmit={console.log} className="space-y-4">
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
            <FormField
              control={form.control}
              name="birthday"
              render={({ field }) => (
                <FormItem className="max-w-[150px] space-y-0">
                  <FormLabel className="text-[11px]">生年月日</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  {form.formState.errors.birthday && (
                    <FormDescription>
                      {form.formState.errors.birthday.message}
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />
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
          </form>
        </Form>
      </div>
    </section>
  )
}
