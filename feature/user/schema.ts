import { z } from "zod"

export const updateUserFormSchema = z.object({
  name: z.string().min(1, { message: "名前を入力してください" }),
  email: z.string().email({ message: "メールアドレスを入力してください" }),
  faceImages: z.array(z.custom<File>()),
})
