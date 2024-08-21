import Link from "next/link"

import { formatDate, getDrugHistoryColor } from "@/lib/utils"
import { Icons } from "@/components/ui/icons"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { drugHistoryWithName } from "./drug-history"

export function DrugHistoryItem({
  day,
  month,
  weekday,
  drugHistoriesWithNames,
}: {
  day: string
  month: string
  weekday: string
  drugHistoriesWithNames: drugHistoryWithName[]
}) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-white p-2 shadow-shadow">
      <div>
        <div className="size-[50px] overflow-hidden rounded-[8px] text-center shadow-shadow">
          <div className="bg-[#FFCA0E]/40 py-px text-[10px]">{month}</div>
          <div className="pt-[2.5px] font-semibold leading-none">{day}</div>
          <div className="pb-[2.5px] text-[8px]">{weekday}</div>
        </div>
      </div>
      <div className="flex items-center gap-8 overflow-x-auto pl-6">
        {drugHistoriesWithNames.map((drugHistory, i) => (
          <Popover key={drugHistory.id}>
            <PopoverTrigger>
              <div className="text-center">
                <Icons.drugHistory
                  className={`${getDrugHistoryColor(
                    drugHistory.medication_auth_result
                  )}`}
                />
                <div className="mt-1 text-[11px]">
                  {formatDate(new Date(drugHistory.created_at), "H:mm")}
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <div className="text-sm font-semibold">
                担当者：{drugHistory.user_name}
              </div>
            </PopoverContent>
          </Popover>
        ))}
      </div>
    </div>
  )
}
