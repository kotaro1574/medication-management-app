import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()

    fileReader.readAsDataURL(file)

    fileReader.onload = () => {
      const result = fileReader.result as string
      const base64Data = result.split(",")[1]
      resolve(base64Data)
    }

    fileReader.onerror = (error) => {
      reject(error)
    }
  })
}
