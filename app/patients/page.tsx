import { getS3Data } from "@/actions/s3/get-s3-data"
import { GroupTabs } from "@/feature/group/group-tabs"

import { createClient } from "@/lib/supabase/server"
import { formatDate } from "@/lib/utils"

export default async function PatientsPage() {
  const today = new Date()
  const supabase = createClient()
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

  const { data: patients, error: patientsError } = await supabase
    .from("patients")
    .select("id, first_name, last_name, group_id, image_id")
    .eq("facility_id", profile.facility_id)

  if (patientsError) {
    return <div>error</div>
  }

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
        .eq("patent_id", patient.id)
        .gte("created_at", todayStart.toISOString())
        .lte("created_at", todayEnd.toISOString())

      console.log(drugHistoryError)
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

  const tabs = [
    {
      value: "全て",
      contents: patientsData.map((patient) => {
        return {
          name: `${patient.last_name} ${patient.first_name}`,
          url: patient.url,
          id: patient.id,
          drugHistoryWithNames: patient.drugHistory,
        }
      }),
    },
    ...groups.map((group) => ({
      value: group.name,
      contents: patientsData
        .filter((patient) => patient.group_id === group.id)
        .map((patient) => {
          return {
            name: `${patient.last_name} ${patient.first_name}`,
            url: patient.url,
            id: patient.id,
            drugHistoryWithNames: patient.drugHistory,
          }
        }),
    })),
  ]

  return (
    <section className="min-h-screen bg-[#F5F5F5]">
      <div className="mx-auto">
        <h2 className="bg-white pb-[46px] pt-[60px] text-center text-[20px]">
          {formatDate(today, "M/d(EEE)")}
        </h2>
        <GroupTabs items={tabs} />
      </div>
    </section>
  )
}
