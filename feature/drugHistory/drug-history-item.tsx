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
      <div className="flex w-full items-center gap-8 overflow-x-auto pl-6">
        {drugHistoriesWithNames.map((drugHistory, i) => (
          <Popover key={drugHistory.id}>
            <PopoverTrigger>
              <div className="relative text-center">
                {drugHistory.medication_auth_result === "success" ||
                drugHistory.medication_auth_result === "skipped" ? (
                  <div>
                    <Icons.drugHistory className="text-[#4ECB71]" />
                    {drugHistory.medication_auth_result === "skipped" && (
                      <div className="absolute right-[-8px] top-0 flex size-4 items-center justify-center rounded-full bg-[#FFCA0E]">
                        <Icons.skipForward className="size-3" />
                      </div>
                    )}
                  </div>
                ) : (
                  <Icons.drugHistory className="text-[#F24E1E]" />
                )}
                <div className="mt-1 text-[11px]">
                  {formatDate(new Date(drugHistory.created_at), "H:mm")}
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <div>担当者：{drugHistory.user_name}</div>
                {drugHistory.medication_auth_result === "skipped" && (
                  <div className="flex items-center text-[#4ECB71]">
                    <Icons.skipForward className="size-4" />
                    <div className="text-xs">スキップ</div>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        ))}
      </div>
    </div>
  )
}
