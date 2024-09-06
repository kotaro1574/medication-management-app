"use server"

import jwt from "jsonwebtoken"

export async function generateCustomToken(userId: string): Promise<{
  accessToken: string | null
  refreshToken: string | null
}> {
  try {
    const secretKey = process.env.SUPABASE_JWT_SECRET

    if (!secretKey) {
      throw new Error("環境変数 SUPABASE_JWT_SECRET が設定されていません")
    }

    // カスタムトークンを生成
    const accessToken = jwt.sign(
      {
        aud: "authenticated",
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1時間の有効期限
        sub: userId,
        role: "authenticated",
      },
      process.env.SUPABASE_JWT_SECRET!
    )

    // リフレッシュトークンも生成
    const refreshToken = jwt.sign(
      {
        aud: "authenticated",
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 1週間の有効期限
        sub: userId,
        role: "authenticated",
      },
      process.env.SUPABASE_JWT_SECRET!
    )

    return { accessToken, refreshToken }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
  }
  return { accessToken: null, refreshToken: null }
}
