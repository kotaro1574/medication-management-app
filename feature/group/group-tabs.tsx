"use client"

import Link from "next/link"
import { PatientAvatar } from "@/feature/patient/patient-avatar"

import { Icons } from "@/components/ui/icons"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type props = {
  items: {
    value: string
    contents: {
      id: string
      name: string
      url: string
    }[]
  }[]
}

export function GroupTabs({ items }: props) {
  return (
    <Tabs defaultValue={items[0].value} className="">
      <TabsList className="hidden-scrollbar overflow-x-scroll rounded-b-lg bg-white px-4 shadow-shadow">
        {items.map((item) => (
          <TabsTrigger key={`trigger-${item.value}`} value={item.value}>
            <p className="line-clamp-1">{item.value}</p>
          </TabsTrigger>
        ))}
      </TabsList>

      {items.map((item) => (
        <TabsContent
          key={`content-${item.value}`}
          value={item.value}
          className="space-y-2 px-4 py-8"
        >
          {item.contents.map((content) => (
            <Link
              key={`content-item-${content.name}`}
              href={`/patients/${content.id}`}
              className="block"
            >
              <div className="rounded-[16px] bg-white px-[9px] py-[12px] shadow-shadow">
                <div className="flex justify-between">
                  <div className="flex w-full max-w-[60px] flex-col items-center">
                    <PatientAvatar size={40} src={content.url} />
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
            </Link>
          ))}
        </TabsContent>
      ))}
    </Tabs>
  )
}
