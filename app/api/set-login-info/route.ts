// /app/api/set-login-info/route.ts (API Route)
import { cookies } from "next/headers"

export async function POST(req: Request) {
  const { id, name, email, password } = await req.json()

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

  const newPassword = password || currentData.password

  if (!newPassword) {
    console.error("パスワードが不足しているため、クッキーを更新できません。")
    return new Response("Password is missing", { status: 400 })
  }

  const newCookieValue = JSON.stringify({
    name,
    email,
    password: newPassword,
  })

  cookies().set(cookieKey, newCookieValue, {
    path: "/",
    httpOnly: true,
    secure: true,
    maxAge: 20 * 60 * 60, // 20時間（秒単位）
  })

  return new Response("Cookie set", { status: 200 })
}
