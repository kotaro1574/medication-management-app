import React from "react"
import Link from "next/link"
import { LoginForm } from "@/feature/auth/login-form"

export default function LoginPage() {
  return (
    <div className="relative flex h-[812px] flex-col items-center gap-[60px] bg-white">
      <div className="relative flex w-full flex-[0_0_auto] flex-col items-center gap-[24px] self-stretch px-[60px] py-[120px]">
        <div className="relative mt-[-1.00px] w-fit text-[24px] font-bold leading-[normal] tracking-normal text-[#c2b37f] [font-family:'Inter-Bold',Helvetica]">
          ログイン
        </div>
        <div className="relative flex w-full flex-[0_0_auto] flex-col items-start gap-[16px] self-stretch">
          <div className="relative flex w-full flex-[0_0_auto] flex-col items-start gap-[4px] self-stretch">
            <div className="relative mt-[-1.00px] w-fit text-[14px] font-normal leading-[normal] tracking-normal text-neutral-400 [font-family:'Inter-Regular',Helvetica]">
              メールアドレス
            </div>
            <div className="relative h-[40px] w-full self-stretch rounded-[10px] border-[0.5px] border-solid border-neutral-400 bg-white" />
          </div>
          <div className="relative flex w-full flex-[0_0_auto] flex-col items-start gap-[4px] self-stretch">
            <div className="relative mt-[-1.00px] w-fit text-[14px] font-normal leading-[normal] tracking-normal text-neutral-400 [font-family:'Inter-Regular',Helvetica]">
              パスワード
            </div>
            <div className="relative h-[40px] w-full self-stretch rounded-[10px] border-[0.5px] border-solid border-neutral-400 bg-white" />
          </div>
        </div>
        <div className="relative inline-flex flex-[0_0_auto] flex-col items-center justify-center gap-[32px]">
          <div className="relative mt-[-1.00px] w-fit text-[14px] font-normal leading-[normal] tracking-normal text-neutral-400 [font-family:'Inter-Regular',Helvetica]">
            履歴選択
          </div>
        </div>
        <div className="relative inline-flex flex-[0_0_auto] flex-col items-center justify-center gap-[32px]">
          <div className="relative mt-[-1.00px] w-fit text-[14px] font-normal leading-[normal] tracking-normal text-neutral-400 [font-family:'Inter-Regular',Helvetica]">
            パスワードをお忘れですか？
          </div>
        </div>
        <div className="relative flex h-[40px] w-full items-center justify-center gap-[10px] self-stretch overflow-hidden rounded-[90px] bg-base-color px-[126px] py-[21px] shadow-shadow">
          <div className="relative mx-[-26.50px] mb-[-8.50px] mt-[-10.50px] w-fit text-[14px] font-normal leading-[normal] tracking-normal text-white [font-family:'Inter-Regular',Helvetica]">
            ログイン
          </div>
        </div>
      </div>
    </div>
  )
}
