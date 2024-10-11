import Link from "next/link"

import { Database } from "@/types/schema.gen"
import { Icons } from "@/components/ui/icons"

type Props = {
  facility: Database["public"]["Tables"]["facilities"]["Row"]
}

export function FacilityItem({ facility }: Props) {
  return (
    <div className="mb-[26px] flex items-center justify-between border-b-[0.5px] border-[#A4A4A4] pb-[14px]">
      <div className="max-w-60 sm:max-w-[500px]">
        <p className="whitespace-normal break-words">{facility.name_jp}</p>
      </div>
      <div className="flex items-center gap-4">
        <Link href={`/facilities/${facility.id}`}>
          <Icons.edit />
        </Link>
        <Icons.trash className="size-6" />
      </div>
    </div>
  )
}
