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
  email: string
  password: string
}) {
  cookies().set(`login-info-${id}`, JSON.stringify({ name, email, password }), {
    httpOnly: true,
    secure: true,
    maxAge: 20 * 60 * 60, // 20 hours in seconds
  })
}
