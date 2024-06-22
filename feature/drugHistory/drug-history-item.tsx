import { Icons } from "@/components/ui/icons"

export function DrugHistoryItem() {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-2 shadow-shadow">
      <div className="size-[50px] overflow-hidden rounded-[8px] text-center shadow-shadow">
        <div className="bg-[#FFCA0E]/40 py-px text-[10px]">３月</div>
        <div className="pt-[2.5px] font-semibold leading-none">18</div>
        <div className="pb-[2.5px] text-[8px]">月曜日</div>
      </div>
      <div className="flex w-full items-center justify-around">
        <div className="text-center">
          <Icons.drugHistory />
          <div className="mt-1 text-[11px]">7:30</div>
        </div>
        <div className="text-center">
          <Icons.drugHistory />
          <div className="mt-1 text-[11px]">7:30</div>
        </div>
      </div>
    </div>
  )
}
