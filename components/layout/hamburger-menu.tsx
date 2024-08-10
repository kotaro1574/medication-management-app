import { ReactNode, useEffect, useState } from "react"
import { is } from "date-fns/locale"

type Props = {
  profileName: string
  trigger: ReactNode
}

export function HamburgerMenu({ profileName, trigger }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

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
              ? "animate-scale-in-hor-right"
              : "animate-slide-out-fwd-right md:animate-slide-out-bck-center"
          }`}
        >
          <ul className="py-2">
            <li className="px-4 py-2 hover:bg-gray-200">
              <a href="#">Home</a>
            </li>
            <li className="px-4 py-2 hover:bg-gray-200">
              <a href="#">About</a>
            </li>
            <li className="px-4 py-2 hover:bg-gray-200">
              <a href="#">Services</a>
            </li>
            <li className="px-4 py-2 hover:bg-gray-200">
              <a href="#">Contact</a>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
