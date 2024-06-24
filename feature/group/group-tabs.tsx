"use client"

import { PatientAvatar } from "@/feature/patient/patient-avatar"

import { Icons } from "@/components/ui/icons"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type props = {
  items: {
    value: string
    contents: {
      name: string
    }[]
  }[]
}

export function GroupTabs({ items }: props) {
  return (
    <Tabs defaultValue="all" className="">
      <TabsList className="space-x-2 overflow-x-scroll rounded-b-lg bg-white px-4 shadow-shadow">
        {items.map((item) => (
          <TabsTrigger key={item.value} value={item.value}>
            <p className="line-clamp-1">{item.value}</p>
          </TabsTrigger>
        ))}
      </TabsList>

      {items.map((item) => (
        <TabsContent value={item.value} className="space-y-2 px-4 py-8">
          {item.contents.map((content) => (
            <div className="rounded-[16px] bg-white px-[9px] py-[12px] shadow-shadow">
              <div className="flex justify-between">
                <div className="w-full max-w-[60px] text-center">
                  <PatientAvatar
                    size={40}
                    src={
                      "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
                    }
                  />
                  <p className="mt-[2px] line-clamp-1 text-[10px]">
                    {content.name}
                  </p>
                </div>
                <div className="flex w-full items-center justify-around">
                  <div className="text-center">
                    <Icons.drugHistory />
                    <div className="mt-px text-[11px]">7:30</div>
                  </div>
                  <div className="text-center">
                    <Icons.drugHistory />
                    <div className="mt-px text-[11px]">7:30</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>
      ))}
    </Tabs>
  )
}
