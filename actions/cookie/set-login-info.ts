"use server"

import { cookies } from "next/headers"

export async function setLoginInfo({
  id,
  name,
  email,
  password,
}: {
  id: string
  name: string
  email?: string
  password?: string
}) {
  const cookieKey = `login-info-${id}`

  let currentCookie = cookies().get(cookieKey)?.value ?? "{}"
  let currentData: { name: string; email: string; password: string } = {
    name: "",
    email: "",
    password: "",
  }

  try {
    currentData = JSON.parse(currentCookie)
  } catch (error) {
    console.error("クッキーデータのパースに失敗しました:", error)
  }

  const newEmail = email || currentData.email
  const newPassword = password || currentData.password

  if (!newPassword) {
    console.error("パスワードが不足しているため、クッキーを更新できません。")
    return
  }

  const newCookieValue = JSON.stringify({
    name,
    email: newEmail,
    password: newPassword,
  })

  cookies().set(cookieKey, newCookieValue, {
    path: "/",
    httpOnly: true,
    secure: true,
    maxAge: 20 * 60 * 60, // 20時間（秒単位）
  })
}
