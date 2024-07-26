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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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
}

const PAGE_SIZE = 10

export function GroupTabs({
  patientsData,
  groups,
  userId,
  currentGroup,
}: Props) {
  const searchParams = useSearchParams()
  const currentPage = searchParams.get("page")

  const [loading, setLoading] = useState(false)
  const [patients, setPatients] = useState<PatientData[]>(patientsData)

  // useEffect(() => {
  //   const fetchPatients = async () => {
  //     if (!currentPage) return

  //     setLoading(true)
  //     const supabase = createClient()

  //     const { data: profile } = await supabase
  //       .from("profiles")
  //       .select("facility_id")
  //       .eq("id", userId)
  //       .single()

  //     if (!profile) return

  //     const { data: patients } = await supabase
  //       .from("patients")
  //       .select("*")
  //       .eq("facility_id", profile.facility_id)
  //       .range(
  //         (Number(currentPage) - 1) * PAGE_SIZE,
  //         Number(currentPage) * PAGE_SIZE - 1
  //       )

  //     if (!patients) return

  //     const patientsData = await Promise.all(
  //       patients.map(async (patient) => {
  //         const { url } = await getS3Data(
  //           patient.image_id,
  //           process.env.FACES_BUCKET ?? ""
  //         )

  //         const todayStart = new Date().setHours(0, 0, 0, 0)
  //         const todayEnd = new Date().setHours(23, 59, 59, 999)

  //         const { data: drugHistory } = await supabase
  //           .from("drug_histories")
  //           .select("*")
  //           .eq("patient_id", patient.id)
  //           .gte("created_at", new Date(todayStart).toISOString())
  //           .lte("created_at", new Date(todayEnd).toISOString())

  //         if (!drugHistory) return { ...patient, url, drugHistory: [] }

  //         const userIds = drugHistory.map((dh) => dh.user_id)
  //         const { data: profiles } = await supabase
  //           .from("profiles")
  //           .select("id, name")
  //           .in("id", userIds)

  //         if (!profiles) return { ...patient, url, drugHistory: [] }

  //         return {
  //           ...patient,
  //           url,
  //           drugHistory: drugHistory.map((dh) => {
  //             const profile = profiles.find((p) => p.id === dh.user_id)
  //             return { ...dh, user_name: profile?.name ?? "" }
  //           }),
  //         }
  //       })
  //     )

  //     setPatients(patientsData)
  //     setLoading(false)
  //   }

  //   fetchPatients()
  // }, [currentPage, userId])

  console.log(currentGroup)

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
      </TabsContent>
    </Tabs>
  )
}
