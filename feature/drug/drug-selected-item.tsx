import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Icons } from "@/components/ui/icons"

export function DrugSelectedItem() {
  return (
    <div className="flex items-center gap-2 px-2 py-1">
      <div className="relative w-full max-w-[63px]">
        <AspectRatio ratio={63 / 73} className="w-full">
          <div className="h-full bg-black"></div>
        </AspectRatio>
        <div className="absolute bottom-0 right-0">
          <Icons.magnifyingGlass />
        </div>
      </div>
      <div className="flex w-full items-center justify-between border-t border-[#A4A4A4] px-2 py-3 text-[#A4A4A4]">
        <div>
          <div className="text-md font-semibold">2024/04/11</div>
          <div className="mt-2 text-[11px]">メディネオ太郎</div>
        </div>
        <div>
          <Icons.trash />
        </div>
      </div>
    </div>
  )
}
