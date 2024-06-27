import { Database } from "@/types/schema.gen"
import { formatDate } from "@/lib/utils"
import { Icons } from "@/components/ui/icons"

export function DrugHistoryItem({
  day,
  month,
  weekday,
  drugHistories,
}: {
  day: string
  month: string
  weekday: string
  drugHistories: Database["public"]["Tables"]["drug_histories"]["Row"][]
}) {
  return (
    <div className="flex items-center gap-8 rounded-2xl bg-white p-2 shadow-shadow">
      <div className="size-[50px] overflow-hidden rounded-[8px] text-center shadow-shadow">
        <div className="bg-[#FFCA0E]/40 py-px text-[10px]">{month}</div>
        <div className="pt-[2.5px] font-semibold leading-none">{day}</div>
        <div className="pb-[2.5px] text-[8px]">{weekday}</div>
      </div>
      {drugHistories.map((drugHistory, i) => (
        <div key={drugHistory.id} className="text-center">
          <Icons.drugHistory />
          <div className="mt-1 text-[11px]">
            {formatDate(new Date(drugHistory.created_at), "H:mm")}
          </div>
        </div>
      ))}
    </div>
  )
}
