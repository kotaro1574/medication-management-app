import { getS3Data } from "@/actions/s3/get-s3-data"
import { GroupTabs } from "@/feature/group/group-tabs"

import { createClient } from "@/lib/supabase/server"
import { formatDate } from "@/lib/utils"

const PAGE_SIZE = 2

export default async function PatientsGroupPage({
  params,
  searchParams,
}: {
  params: { group_id: string }
  searchParams?: {
    page?: string
  }
}) {
  const today = new Date()
  const supabase = createClient()
  const currentPage = Number(searchParams?.page ?? 1)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { redirect: { destination: "/login", permanent: false } }
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("facility_id")
    .eq("id", user.id)
    .single()

  if (profileError) {
    return <div>error</div>
  }

  const { data: groups, error: groupsError } = await supabase
    .from("groups")
    .select("*")
    .eq("facility_id", profile.facility_id)

  if (groupsError) {
    return <div>error</div>
  }

  const {
    data: patients,
    error: patientsError,
    count,
  } = await supabase
    .from("patients")
    .select("*", { count: "exact" })
    .eq("facility_id", profile.facility_id)
    .eq("group_id", params.group_id)
    .range((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE - 1)

  if (patientsError) {
    return <div>error</div>
  }

  const totalPatients = count || 0

  const patientsData = await Promise.all(
    patients.map(async (patient) => {
      const { url } = await getS3Data(
        patient.image_id,
        process.env.FACES_BUCKET ?? ""
      )

      const todayStart = new Date(today.setHours(0, 0, 0, 0))
      const todayEnd = new Date(today.setHours(23, 59, 59, 999))

      const { data: drugHistory, error: drugHistoryError } = await supabase
        .from("drug_histories")
        .select("*")
        .eq("patient_id", patient.id)
        .gte("created_at", todayStart.toISOString())
        .lte("created_at", todayEnd.toISOString())

      if (drugHistoryError) {
        return { ...patient, url, drugHistory: [] }
      }

      const userIds = drugHistory.map((dh) => dh.user_id)
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("id, name")
        .in("id", userIds)

      if (profileError) {
        return { ...patient, url, drugHistory: [] }
      }

      return {
        ...patient,
        url,
        drugHistory: drugHistory.map((dh) => {
          const profile = profiles.find((p) => p.id === dh.user_id)
          return { ...dh, user_name: profile?.name ?? "" }
        }),
      }
    })
  )

  const currentGroup =
    groups.find((group) => group.id === params.group_id)?.name ?? "全て"

  return (
    <section className="min-h-screen bg-[#F5F5F5]">
      <div className="mx-auto">
        <h2 className="bg-white pb-[46px] pt-[60px] text-center text-[20px]">
          {formatDate(today, "M/d(EEE)")}
        </h2>
        <GroupTabs
          totalPatients={totalPatients}
          currentGroup={currentGroup}
          patientsData={patientsData}
          groups={groups}
          userId={user.id}
        />
      </div>
    </section>
  )
}
