import Image from "next/image"

import { formatDate } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Icons } from "@/components/ui/icons"

export function DrugSelectedItem({
  src,
  userName,
  date,
}: {
  src: string
  date: Date
  userName: string
}) {
  return (
    <div className="flex items-center gap-2 px-2 py-1">
      <div className="relative w-full max-w-[63px]">
        <AspectRatio ratio={63 / 73} className="w-full">
          <Image src={src} fill alt="drug_image" />
        </AspectRatio>
        <div className="absolute bottom-0 right-0">
          <Icons.magnifyingGlass />
        </div>
      </div>
      <div className="flex w-full items-center justify-between border-t border-[#A4A4A4] px-2 py-[15.5px] text-[#A4A4A4]">
        <div>
          <div className="text-sm font-semibold">
            {formatDate(date, "yyyy/MM/dd")}
          </div>
          <div className="mt-2 text-[11px]">{userName}</div>
        </div>
        <div>
          <Icons.trash />
        </div>
      </div>
    </div>
  )
}
