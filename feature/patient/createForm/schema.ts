import { z } from "zod"

const alertObj = z
  .object({
    hour: z.string(),
    minute: z.string(),
    repeatStetting: z.string().nullable(),
    date: z.date().nullable(),
    isAlertEnabled: z.boolean(),
  })
  .refine(
    (data) => {
      return !(data.hour === "0" && data.minute === "0")
    },
    {
      message: "時間を選択してください。",
      path: ["hour", "minute"],
    }
  )
  .refine(
    (data) => {
      const repeatSettingExists = data.repeatStetting !== null
      const dateExists = data.date !== null
      return repeatSettingExists !== dateExists
    },
    {
      message: "繰り返し設定と日付のどちらか一方を選択してください。",
      path: ["repeatStetting", "date"],
    }
  )

export const createPatientFormSchema = z.object({
  faceImages: z
    .array(z.custom<File>())
    .min(5, { message: "顔画像を登録してください。" }),
  lastName: z.string().min(1, { message: "姓を入力してください。" }),
  firstName: z.string().min(1, { message: "名を入力してください。" }),
  era: z.string().min(1, { message: "生年月日を選択してください。" }),
  year: z.string().min(1, { message: "生年月日を選択してください。" }),
  month: z.string().min(1, { message: "生年月日を選択してください。" }),
  day: z.string().min(1, { message: "生年月日を選択してください。" }),
  careLevel: z.enum(
    [
      "independence",
      "needs_support_1",
      "needs_support_2",
      "needs_nursing_care_1",
      "needs_nursing_care_2",
      "needs_nursing_care_3",
      "needs_nursing_care_4",
      "needs_nursing_care_5",
    ],
    { message: "介護度を選択してください" }
  ),
  disabilityClassification: z.enum(
    [
      "independence",
      "disability_level_1",
      "disability_level_2",
      "disability_level_3",
      "disability_level_4",
      "disability_level_5",
      "disability_level_6",
    ],
    { message: "障害区分を選択してください" }
  ),
  groupId: z.string().min(1, { message: "グループを選択してください。" }),
  gender: z.enum(["male", "female"], { message: "性別を選択してください。" }),
  drugImages: z.array(z.custom<File>()),
  alerts: z.array(alertObj),
})
