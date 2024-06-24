import { getS3Data } from "@/actions/s3/get-s3-data"
import { GroupTabs } from "@/feature/group/group-tabs"
import { id } from "date-fns/locale"

import { createClient } from "@/lib/supabase/server"
import { formatDate } from "@/lib/utils"

export default async function PatientsPage() {
  const supabase = createClient()
  const {
    data: { user },
    error: userError,
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

  const patientsWithUrl = await Promise.all(
    patients.map(async (patient) => {
      const { url } = await getS3Data(
        patient.image_id,
        process.env.FACES_BUCKET ?? ""
      )
      return { ...patient, url }
    })
  )

  const tabs = [
    {
      value: "全て",
      contents: patientsWithUrl.map((patient) => {
        return {
          name: `${patient.last_name} ${patient.first_name}`,
          url: patient.url,
          id: patient.id,
        }
      }),
    },
    ...groups.map((group) => ({
      value: group.name,
      contents: patientsWithUrl
        .filter((patient) => patient.group_id === group.id)
        .map((patient) => {
          return {
            name: `${patient.last_name} ${patient.first_name}`,
            url: patient.url,
            id: patient.id,
          }
        }),
    })),
  ]

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
