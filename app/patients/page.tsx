import { getS3Data } from "@/actions/s3/get-s3-data"
import { GroupTabs } from "@/feature/group/group-tabs"

import { PLAN_LIMITS } from "@/lib/constants/plan-limits"
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
    return <div>error: {profileError.message}</div>
  }

  const { data: facility, error: facilityError } = await supabase
    .from("facilities")
    .select("plan")
    .eq("id", profile.facility_id)
    .single()

  if (facilityError) {
    return <div>error: {facilityError.message}</div>
  }

  const { data: groups, error: groupsError } = await supabase
    .from("groups")
    .select("*")
    .eq("facility_id", profile.facility_id)

  if (groupsError) {
    return <div>error: {groupsError.message}</div>
  }

  const { data: patients, error: patientsError } = await supabase
    .from("patients")
    .select("id, first_name, last_name, group_id, image_id")
    .eq("facility_id", profile.facility_id)
    .order("created_at", { ascending: false })

  if (patientsError) {
    return <div>error: {patientsError.message}</div>
  }

  const patientsData = await Promise.all(
    patients.map(async (patient) => {
      const { url } = await getS3Data(
        patient.image_id,
        process.env.PATIENT_FACES_BUCKET ?? ""
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
        return { ...patient, url, isAlert: false, drugHistory: [] }
      }

      const userIds = drugHistory.map((dh) => dh.user_id)
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("id, name")
        .in("id", userIds)

      if (profileError) {
        return { ...patient, url, isAlert: false, drugHistory: [] }
      }

      const { data: alerts, error: alertError } = await supabase
        .from("alerts")
        .select("id, is_alert_enabled")
        .eq("patient_id", patient.id)

      if (alertError) {
        return {
          ...patient,
          url,
          isAlert: false,
          drugHistory: drugHistory.map((dh) => {
            const profile = profiles.find((p) => p.id === dh.user_id)
            return { ...dh, user_name: profile?.name ?? "" }
          }),
        }
      }

      const isAlert = alerts.some((alert) => alert.is_alert_enabled)

      return {
        ...patient,
        url,
        isAlert,
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
          id: patient.id,
          name: `${patient.last_name} ${patient.first_name}`,
          url: patient.url,
          isAlert: patient.isAlert,
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
            id: patient.id,
            name: `${patient.last_name} ${patient.first_name}`,
            url: patient.url,
            isAlert: patient.isAlert,
            drugHistoryWithNames: patient.drugHistory,
          }
        }),
    })),
  ]

  const patientsNumber = patients.length
  const planLimits = PLAN_LIMITS[facility.plan]

  return (
    <section className="min-h-screen bg-[#F5F5F5]">
      <div className="mx-auto">
        <div className="space-y-3 bg-white pb-5 pt-[70px] text-center">
          <h2 className=" text-[20px]">{formatDate(today, "M/d(EEE)")}</h2>
          <p className="text-sm text-[#A4A4A4]">
            {patientsNumber}/{planLimits.patientLimit}名
          </p>
        </div>

        <GroupTabs items={tabs} />
      </div>
    </section>
  )
}
