import { PlaceholderValue } from "next/dist/shared/lib/get-img-props"
import { clsx, type ClassValue } from "clsx"
import { format as _format } from "date-fns"
import { ja } from "date-fns/locale"
import { twMerge } from "tailwind-merge"

import { Database } from "@/types/schema.gen"

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

export function convertBase64ToFile(base64: string, filename: string): File {
  const mimeType = base64.match(/^data:(.*?);base64,/)?.[1] ?? "image/jpeg"
  const base64Data = base64.replace(/^data:(.*?);base64,/, "")
  const binaryData = Buffer.from(base64Data, "base64")

  const blob = new Blob([binaryData], { type: mimeType })

  return new File([blob], filename, { type: mimeType })
}

export function placeholder({
  w,
  h,
}: {
  w: number
  h: number
}): PlaceholderValue {
  const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`

  const toBase64 = (str: string) =>
    typeof window === "undefined"
      ? Buffer.from(str).toString("base64")
      : window.btoa(str)

  return `data:image/svg+xml;base64,${toBase64(shimmer(w, h))}`
}

//形式が増えたら追記する
type Format = "yyyy/MM/dd" | "M/d(EEE)" | "M/d" | "yyyy/MM/dd" | "H:mm"

/**
 * 日付をformatする関数
 */
export const formatDate = (date: Date, format: Format) => {
  return _format(date, format, { locale: ja })
}

export const formatGender = (
  gender: Database["public"]["Enums"]["gender_enum"]
): string => {
  switch (gender) {
    case "male":
      return "男性"
    case "female":
      return "女性"
    default:
      return "不明"
  }
}

export const formatCareLevel = (
  careLevel: Database["public"]["Enums"]["care_level_enum"]
) => {
  switch (careLevel) {
    case "independence":
      return "自立"
    case "needs_support_1":
      return "要支援1"
    case "needs_support_2":
      return "要支援2"
    case "needs_nursing_care_1":
      return "要介護1"
    case "needs_nursing_care_2":
      return "要介護2"
    case "needs_nursing_care_3":
      return "要介護3"
    case "needs_nursing_care_4":
      return "要介護4"
    case "needs_nursing_care_5":
      return "要介護5"
    default:
      return "不明"
  }
}

// 和暦を西暦に変換するマッピング
const eraToGregorian: { [key: string]: number } = {
  M: 1868, // 明治
  T: 1912, // 大正
  S: 1926, // 昭和
  H: 1989, // 平成
  R: 2019, // 令和
}

export const genBirthdayText = (
  era: string,
  year: string,
  month: string,
  day: string
) => {
  const gregorianYear = eraToGregorian[era] + parseInt(year, 10) - 1
  const birthDate = new Date(
    `${gregorianYear}-${String(month).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}`
  )
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const isBirthdayPassedThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate())
  if (!isBirthdayPassedThisYear) {
    age--
  }

  return `${era}${year}.${month}.${day}生(${age}歳)`
}

export const extractBirthdayInfo = (input_str: string) => {
  const pattern = /([A-Z])(\d+)\.(\d+)\.(\d+)生\(\d+歳\)/
  const match = input_str.match(pattern)

  if (match) {
    const [_, era, year, month, day] = match

    return { era, year, month, day }
  } else {
    return {
      era: "",
      year: "",
      month: "",
      day: "",
    }
  }
}
