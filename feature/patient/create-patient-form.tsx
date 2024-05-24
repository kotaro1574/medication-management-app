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
  faceImage: z.custom<File>().nullable(),
  name: z.string(),
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
  drugImages: z.array(z.custom<File>().nullable()),
})

export function CreatePatientForm() {
  const [loading, startTransaction] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      faceImage: null,
      name: "",
      birthday: "",
      careLevel: undefined,
      groupId: "",
      gender: undefined,
    },
    resolver: zodResolver(formSchema),
  })

  const onSubmit = ({ faceImage, name }: z.infer<typeof formSchema>) => {
    if (!faceImage) {
      return
    }
    const formData = new FormData()
    formData.append("imageFile", faceImage)

    startTransaction(() => {
      ;(async () => {
        const response = await createPatient({ formData, name })
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
                <FormLabel htmlFor="faceImage">認証用人物画像</FormLabel>
                {value && (
                  <Image
                    src={URL.createObjectURL(value)}
                    width={300}
                    alt="selected_image"
                    height={300}
                  />
                )}
                <div className="relative">
                  <label
                    className={`${buttonVariants({
                      variant: "default",
                      size: "default",
                    })} mt-2`}
                    htmlFor="single"
                  >
                    {form.getValues("faceImage") ? "画像を変更" : "画像を選ぶ"}
                  </label>

                  <input
                    style={{
                      visibility: "hidden",
                      position: "absolute",
                      width: 0,
                    }}
                    type="file"
                    id="single"
                    accept="image/*"
                    onChange={(e) => {
                      if (!e.target.files?.[0]) return
                      onChange(e.target.files?.[0] as File)
                    }}
                    disabled={loading}
                  />
                </div>
              </FormItem>
            )}
            name="faceImage"
            control={form.control}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>名前</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                {form.formState.errors.name && (
                  <FormDescription>
                    {form.formState.errors.name.message}
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
                  <Input {...field} />
                </FormControl>
                {form.formState.errors.groupId && (
                  <FormDescription>
                    {form.formState.errors.groupId.message}
                  </FormDescription>
                )}
              </FormItem>
            )}
          />
          <Button disabled={loading} type="submit">
            {loading ? "loading..." : "Create Patient"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
