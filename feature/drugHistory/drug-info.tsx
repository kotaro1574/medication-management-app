"use client"

import Image from "next/image"

import { Database } from "@/types/schema.gen"
import { formatDate } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"

type drugWithUrls = Database["public"]["Tables"]["drugs"]["Row"] & {
  url: string
}

type Props = {
  drugs: drugWithUrls[]
}

export function DrugInfo({ drugs }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-[20px] text-[#C2B37F]">処方薬情報</h2>

      {drugs.map((drug, i) => (
        <div key={drug.id} className="mx-auto max-w-md">
          <div className="flex items-center justify-between text-[11px]">
            <div>
              登録日：{formatDate(new Date(drug.created_at), "yyyy/MM/dd")}
            </div>
            <div>
              {i + 1}/{drugs.length}
            </div>
          </div>
          <AspectRatio className="mt-1" ratio={340 / 400}>
            <Image alt={drug.id} src={drug.url} fill />
          </AspectRatio>
        </div>
      ))}
    </div>
  )
}
