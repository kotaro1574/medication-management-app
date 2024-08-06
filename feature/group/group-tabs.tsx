"use client"

import Link from "next/link"
import { PatientAvatar } from "@/feature/patient/patient-avatar"
import { formatDate } from "date-fns"

import { Database } from "@/types/schema.gen"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type drugHistoryWithName =
  Database["public"]["Tables"]["drug_histories"]["Row"] & {
    user_name: string
  }

type props = {
  items: {
    value: string
    contents: {
      id: string
      name: string
      url: string
      isAlert: boolean
      drugHistoryWithNames: drugHistoryWithName[]
    }[]
  }[]
}

export function GroupTabs({ items }: props) {
  const isNoGroups = items.length === 1

  return (
    <Tabs defaultValue={items[0].value} className="">
      <TabsList className="hidden-scrollbar overflow-x-scroll rounded-b-lg bg-white px-4 shadow-shadow">
        {items.map((item) => (
          <TabsTrigger key={`trigger-${item.value}`} value={item.value}>
            <p>{item.value}</p>
          </TabsTrigger>
        ))}
      </TabsList>

      {items.map((item) => (
        <TabsContent
          key={`content-${item.value}`}
          value={item.value}
          className="space-y-2 px-4 py-8"
        >
          {isNoGroups ? (
            <div>
              <p className="text-sm text-[#A4A4A4]">
                グループを作成後に利用者を作成してください。
              </p>
              <Link
                href="/groups/create"
                className={`${buttonVariants()} mt-4 block w-full`}
              >
                グループを作成する
              </Link>
            </div>
          ) : item.contents.length === 0 ? (
            <div>
              <p className="text-sm text-[#A4A4A4]">
                利用者が登録されていません。
              </p>
              <Link
                href="/patients/create"
                className={`${buttonVariants()} mt-4 block w-full`}
              >
                利用者を登録する
              </Link>
            </div>
          ) : (
            item.contents.map((content) => (
              <div
                key={`content-item-${content.name}`}
                className="flex items-center gap-8 rounded-2xl bg-white px-2 py-1.5 shadow-shadow"
              >
                <Link href={`/patients/${content.id}`} className="block">
                  <div className="flex w-[60px] flex-col items-center">
                    <PatientAvatar
                      size="sm"
                      isAlert={content.isAlert}
                      src={content.url}
                    />
                    <p className="mt-[2px] line-clamp-1 max-w-[55px] text-[10px]">
                      {content.name}
                    </p>
                  </div>
                </Link>
                {content.drugHistoryWithNames.map((drugHistory, i) => (
                  <Popover key={drugHistory.id}>
                    <PopoverTrigger>
                      <div className="text-center">
                        {/* いつか直したい */}
                        {drugHistory.medication_auth_result === "success" ? (
                          <Icons.drugHistory className="text-[#4ECB71]" />
                        ) : (
                          <Icons.drugHistory className="text-[#F24E1E]" />
                        )}
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
            ))
          )}
        </TabsContent>
      ))}
    </Tabs>
  )
}
