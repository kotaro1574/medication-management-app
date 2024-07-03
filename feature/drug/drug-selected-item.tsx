import Image from "next/image"
import { UseFormReturn } from "react-hook-form"
import { z } from "zod"

import { formatDate } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Icons } from "@/components/ui/icons"

import { DrugInfoDialog } from "./drug-info-dialog"

export function DrugSelectedItem({
  onDelete,
  file,
  userName,
  date,
}: {
  onDelete: () => void
  file: File | string
  date: Date
  userName: string
}) {
  const fileUrl = typeof file === "string" ? file : URL.createObjectURL(file)

  return (
    <div className="flex items-center gap-2 px-2 py-1">
      <div className="relative w-full max-w-[63px]">
        <AspectRatio ratio={63 / 73} className="w-full">
          <Image src={fileUrl} fill alt="drug_image" />
        </AspectRatio>
        <div className="absolute bottom-0 right-0">
          <DrugInfoDialog
            trigger={
              <button className="block">
                <Icons.magnifyingGlass />
              </button>
            }
            file={file}
          />
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
          <Icons.trash className="cursor-pointer" onClick={onDelete} />
        </div>
      </div>
    </div>
  )
}
