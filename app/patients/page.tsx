import { GroupTabs } from "@/feature/group/group-tabs"

import { formatDate } from "@/lib/utils"

const tabs = [
  {
    value: "all",
    contents: [
      {
        name: "山田 花子",
      },
      {
        name: "山田 太郎",
      },
    ],
  },
  {
    value: "floorA",
    contents: [
      {
        name: "山田 花子",
      },
      {
        name: "山田 太郎",
      },
    ],
  },
  {
    value: "floorB",
    contents: [
      {
        name: "山田 花子",
      },
      {
        name: "山田 太郎",
      },
    ],
  },
  {
    value: "floorC",
    contents: [
      {
        name: "山田 花子",
      },
      {
        name: "山田 太郎",
      },
    ],
  },
  {
    value: "floorD",
    contents: [
      {
        name: "山田 花子",
      },
      {
        name: "山田 太郎",
      },
    ],
  },
  {
    value: "floorE",
    contents: [
      {
        name: "山田 花子",
      },
      {
        name: "山田 太郎",
      },
    ],
  },
  {
    value: "floorF",
    contents: [
      {
        name: "山田 花子",
      },
      {
        name: "山田 太郎",
      },
    ],
  },
  {
    value: "floorG",
    contents: [
      {
        name: "山田 花子",
      },
      {
        name: "山田 太郎",
      },
    ],
  },
]

export default function PatientsPage() {
  const today = new Date()
  return (
    <section className="min-h-screen bg-[#F5F5F5] pt-[44px]">
      <div className="mx-auto">
        <h2 className="bg-white pb-[46px] pt-[16px] text-center text-[20px]">
          {formatDate(today, "M/d(EEE)")}
        </h2>
        <GroupTabs items={tabs} />
      </div>
    </section>
  )
}
