import { ReactNode, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { logout } from "@/actions/auth/logout"

import { Icons } from "../ui/icons"
import { Separator } from "../ui/separator"
import { useToast } from "../ui/use-toast"

type Props = {
  profileName: string
  trigger: ReactNode
}

export function HamburgerMenu({ profileName, trigger }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const toggleMenu = () => {
    if (isOpen) {
      setIsAnimating(true) // 閉じるアニメーションを開始
      setTimeout(() => {
        setIsOpen(false) // アニメーション後にメニューを非表示にする
        setIsAnimating(false)
      }, 500) // アニメーションの継続時間と合わせる（例：500ms）
    } else {
      setIsOpen(true)
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const handleLinkClick = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setIsOpen(false)
      setIsAnimating(false)
    }, 500)
  }

  const handleLogout = () => {
    setIsAnimating(true)
    setTimeout(async () => {
      setIsOpen(false)
      setIsAnimating(false)
      await logout()
      const response = await logout()
      if (response.success) {
        toast({ title: response.message })
        router.push("/login")
      } else {
        toast({ title: response.error, variant: "destructive" })
      }
    }, 500)
  }

  return (
    <div>
      <button onClick={toggleMenu}>{trigger}</button>

      {/* 背景のフェードイン/フェードアウト */}
      {isOpen && (
        <div
          onClick={toggleMenu}
          className={`absolute left-0 top-0 z-40 h-screen w-full bg-black/80 ${
            isOpen && !isAnimating
              ? "animate-slide-in-bck-center"
              : "animate-slide-out-bck-center"
          }`}
        />
      )}

      {/* ナビゲーションメニューのスライドイン/スライドアウト */}
      {isOpen && (
        <div
          className={`absolute right-0 top-0 z-50 h-screen w-2/3 bg-white shadow-md ${
            isOpen && !isAnimating
              ? "animate-slide-in-fwd-right md:animate-scale-in-hor-right"
              : "animate-slide-out-fwd-right md:animate-scale-out-hor-right"
          }`}
        >
          <div className="mx-auto w-full space-y-6">
            <div className="bg-[url('/bg-hamburger.png')] bg-cover bg-no-repeat px-4 pb-[14px] pt-[183px]">
              <div className="mb-2 text-[20px] font-semibold">
                <Link href="/" passHref onClick={handleLinkClick}>
                  {profileName}
                </Link>
              </div>
              <button onClick={handleLogout} className="flex items-center">
                <Icons.logout className="size-6" />
                <p className="text-[14px]">ログアウト</p>
              </button>
            </div>

            <div className="grid gap-4 px-2 text-[20px] font-medium">
              <Link
                href="/patients"
                passHref
                onClick={handleLinkClick}
                className="flex items-center rounded-sm px-2 py-[6px] hover:bg-[#FFCA0E]/15 hover:text-[#FFCA0E]"
              >
                <Icons.users className="mr-8" />
                <p>利用者一覧</p>
              </Link>
              <Link
                href="/patients/create"
                passHref
                onClick={handleLinkClick}
                className="flex items-center rounded-sm px-2 py-[6px] hover:bg-[#FFCA0E]/15 hover:text-[#FFCA0E]"
              >
                <Icons.userHeader className="mr-8" />
                <p>利用者登録</p>
              </Link>
              <Link
                href="/groups"
                passHref
                onClick={handleLinkClick}
                className="flex items-center rounded-sm px-2 py-[6px] hover:bg-[#FFCA0E]/15 hover:text-[#FFCA0E]"
              >
                <Icons.groups className="mr-8" />
                <p>グループ一覧</p>
              </Link>
            </div>
            <div className="px-4">
              <Separator />
            </div>
            <div className="px-2">
              <Link
                href="/user"
                passHref
                onClick={handleLinkClick}
                className="flex items-center rounded-sm px-2 py-[6px] hover:bg-[#FFCA0E]/15 hover:text-[#FFCA0E]"
              >
                <Icons.settings className="mr-8 size-5" />
                <p className="text-[16px]">アカウント情報</p>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
