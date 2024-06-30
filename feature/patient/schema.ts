import { z } from "zod"

export const patientFormSchema = z.object({
  faceImages: z
    .array(z.custom<File>())
    .min(5, { message: "5枚の画像が必要です。" }),
  lastName: z.string(),
  firstName: z.string(),
  era: z.string(),
  year: z.string(),
  month: z.string(),
  day: z.string(),
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
