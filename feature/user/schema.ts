import { z } from "zod"

export const updateUserFormSchema = z.object({
  faceImages: z.array(z.custom<File>()),
})
