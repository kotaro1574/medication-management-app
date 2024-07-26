"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { getS3Data } from "@/actions/s3/get-s3-data"
import { PatientAvatar } from "@/feature/patient/patient-avatar"
import { formatDate } from "date-fns"

import { Database } from "@/types/schema.gen"
import { createClient } from "@/lib/supabase/client"
import { Icons } from "@/components/ui/icons"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type DrugHistoryWithNames =
  Database["public"]["Tables"]["drug_histories"]["Row"] & {
    user_name: string
  }

type PatientData = Database["public"]["Tables"]["patients"]["Row"] & {
  url: string
  drugHistory: DrugHistoryWithNames[]
}

type Props = {
  groups: Database["public"]["Tables"]["groups"]["Row"][]
  patientsData: PatientData[]
  userId: string
  currentGroup: string
  totalPatients: number
}

const PAGE_SIZE = 2

export function GroupTabs({
  patientsData,
  groups,
  currentGroup,
  totalPatients,
}: Props) {
  const searchParams = useSearchParams()
  const currentPage = searchParams.get("page")
  const [patients, setPatients] = useState<PatientData[]>(patientsData)
  const totalPages = Math.ceil(totalPatients / PAGE_SIZE)

  return (
    <Tabs defaultValue={currentGroup} className="">
      <TabsList className="hidden-scrollbar overflow-x-scroll rounded-b-lg bg-white px-4 shadow-shadow">
        <Link href={`/patients`}>
          <TabsTrigger value={"全て"}>
            <p className="line-clamp-1">全て</p>
          </TabsTrigger>
        </Link>
        {groups.map((group) => (
          <Link
            key={`trigger-${group.name}`}
            href={`/patients/group/${group.id}`}
          >
            <TabsTrigger value={group.name}>
              <p className="line-clamp-1">{group.name}</p>
            </TabsTrigger>
          </Link>
        ))}
      </TabsList>

      <TabsContent value={currentGroup} className="space-y-2 px-4 py-8">
        <>
          {patients.map((patient) => (
            <div
              key={`content-item-${patient.id}`}
              className="flex items-center gap-8 rounded-2xl bg-white px-2 py-1.5 shadow-shadow"
            >
              <Link href={`/patients/${patient.id}`} className="block">
                <div className="flex w-full max-w-[60px] flex-col items-center">
                  <PatientAvatar size={40} src={patient.url} />
                  <p className="mt-[2px] line-clamp-1 max-w-[55px] text-[10px]">
                    {patient.last_name + patient.first_name}
                  </p>
                </div>
              </Link>
              {patient.drugHistory.map((drugHistory) => (
                <Popover key={drugHistory.id}>
                  <PopoverTrigger>
                    <div className="text-center">
                      <Icons.drugHistory />
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
          ))}
        </>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href={`?page=${Number(currentPage) - 1}`} />
            </PaginationItem>
            {[...Array(totalPages)].map((_, pageIndex) => (
              <PaginationItem key={pageIndex}>
                <PaginationLink
                  href={`?page=${pageIndex + 1}`}
                  onClick={() => setPatients([])}
                >
                  {pageIndex + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href={`?page=${Number(currentPage) + 1}`} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </TabsContent>
    </Tabs>
  )
}
