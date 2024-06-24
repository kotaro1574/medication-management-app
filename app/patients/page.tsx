"use client"

import { PatientAvatar } from "@/feature/patient/patient-avatar"

import { formatDate } from "@/lib/utils"
import { Icons } from "@/components/ui/icons"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const today = new Date()

const tabs = [
  {
    value: "all",
    label: "全て",
  },
  {
    value: "floorA",
    label: "Aフロア",
  },
  {
    value: "floorB",
    label: "Bフロア",
  },
  {
    value: "floorC",
    label: "Cフロア",
  },
  {
    value: "floorD",
    label: "Dフロア",
  },
  {
    value: "floorE",
    label: "Eフロア",
  },
  {
    value: "floorF",
    label: "Fフロア",
  },
  {
    value: "floorG",
    label: "Gフロア",
  },
]

export default function PatientsPage() {
  return (
    <section className="min-h-screen bg-[#F5F5F5] pt-[44px]">
      <div className="mx-auto">
        <h2 className="bg-white pb-[46px] pt-[16px] text-center text-[20px]">
          {formatDate(today, "M/d(EEE)")}
        </h2>
        <Tabs defaultValue="all" className="">
          <TabsList className="space-x-2 overflow-x-scroll rounded-b-lg bg-white px-4 shadow-shadow">
            {tabs.map((tabsName) => (
              <TabsTrigger key={tabsName.value} value={tabsName.value}>
                <p className="line-clamp-1">{tabsName.label}</p>
              </TabsTrigger>
            ))}
            {/* 確認してOKだったら消す */}
            {/* <TabsTrigger value="all"><p className="line-clamp-1">全て</p></TabsTrigger>
            <TabsTrigger value="floorA">
              <p className="line-clamp-1">Aフロア</p>
            </TabsTrigger>
            <TabsTrigger value="floorB">
              <p className="line-clamp-1">Bフロア</p>
            </TabsTrigger>
            <TabsTrigger value="floorC">
              <p className="line-clamp-1">Cフロア</p>
            </TabsTrigger>
            <TabsTrigger value="floorD">
              <p className="line-clamp-1">Dフロア</p>
            </TabsTrigger>
            <TabsTrigger value="floorE">
              <p className="line-clamp-1">Eフロア</p>
            </TabsTrigger>
            <TabsTrigger value="floorF">
              <p className="line-clamp-1">Fフロア</p>
            </TabsTrigger>
            <TabsTrigger value="floorG">
              <p className="line-clamp-1">Gフロア</p>
            </TabsTrigger> */}
          </TabsList>

          <TabsContent value="all" className="px-4 py-8">
            <div className="rounded-[16px] bg-white px-[9px] py-[12px] shadow-shadow">
              <div className="flex justify-between">
                <div className="text-center">
                  {/* <PatientAvatar src={url} /> */}
                  <p className="mt-[2px] text-[10px]">山田 花子</p>
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
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
