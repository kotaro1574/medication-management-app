"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { createPatient } from "@/actions/patients/create-patient"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

import { Button, buttonVariants } from "@/components/ui/button"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

import { GroupsSelect } from "../group/groups-select"

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

export function CreatePatientForm() {
  const [loading, startTransaction] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
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

  const onSubmit = ({
    faceImages,
    firstName,
    lastName,
    birthday,
    careLevel,
    groupId,
    drugImages,
    gender,
  }: z.infer<typeof formSchema>) => {
    if (!faceImages || faceImages.length === 0) return

    const formData = new FormData()
    faceImages.forEach((file) => {
      formData.append("faceImages", file)
    })
    drugImages.forEach((file) => {
      formData.append("drugImages", file)
    })

    startTransaction(() => {
      ;(async () => {
        const response = await createPatient({
          formData,
          lastName,
          firstName,
          birthday,
          careLevel,
          groupId,
          gender,
        })
        if (response.success) {
          setError(null)
          router.push("/patients")
          router.refresh()
          toast({
            title: response.message,
          })
        } else {
          setError(response.error)
        }
      })()
    })
  }

  return (
    <div>
      <div>{error}</div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            render={({ field: { onChange, value } }) => (
              <FormItem>
                <FormLabel htmlFor="faceImages">認証用人物画像</FormLabel>
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
                      variant: "default",
                      size: "default",
                    })} mt-2`}
                    htmlFor="multi-face"
                  >
                    {value.length > 0 ? "画像を変更" : "画像を選ぶ"}
                  </label>

                  <input
                    style={{
                      visibility: "hidden",
                      position: "absolute",
                      width: 0,
                    }}
                    type="file"
                    id="multi-face"
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
            name="faceImages"
            control={form.control}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>名字</FormLabel>
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
              <FormItem>
                <FormLabel>名前</FormLabel>
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
          <FormField
            control={form.control}
            name="birthday"
            render={({ field }) => (
              <FormItem>
                <FormLabel>生年月日</FormLabel>
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
              <FormItem>
                <FormLabel>介護度</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="independence">自立</SelectItem>
                    <SelectItem value="needs_support_1">要支援1</SelectItem>
                    <SelectItem value="needs_support_2">要支援2</SelectItem>
                    <SelectItem value="needs_nursing_care_1">
                      要介護1
                    </SelectItem>
                    <SelectItem value="needs_nursing_care_2">
                      要介護2
                    </SelectItem>
                    <SelectItem value="needs_nursing_care_3">
                      要介護3
                    </SelectItem>
                    <SelectItem value="needs_nursing_care_4">
                      要介護4
                    </SelectItem>
                    <SelectItem value="needs_nursing_care_5">
                      要介護5
                    </SelectItem>
                  </SelectContent>
                </Select>
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
              <FormItem>
                <FormLabel>グループ</FormLabel>
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
              <FormItem>
                <FormLabel>性別</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="male" />
                      </FormControl>
                      <FormLabel className="font-normal">男性</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="female" />
                      </FormControl>
                      <FormLabel className="font-normal">女性</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                {form.formState.errors.gender && (
                  <FormDescription>
                    {form.formState.errors.gender.message}
                  </FormDescription>
                )}
              </FormItem>
            )}
          />
          <Controller
            render={({ field: { onChange, value } }) => (
              <FormItem>
                <FormLabel>お薬情報</FormLabel>
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
                      variant: "default",
                      size: "default",
                    })} mt-2`}
                    htmlFor="multi-drug"
                  >
                    {value.length > 0 ? "画像を変更" : "画像を選ぶ"}
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
          <Button disabled={loading} type="submit">
            {loading ? "loading..." : "Create Patient"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
