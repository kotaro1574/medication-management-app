import Link from "next/link"
import { getS3Data } from "@/actions/s3/get-s3-data"
import { DrugHistory } from "@/feature/drugHistory/drug-history"
import { DrugInfo } from "@/feature/drugHistory/drug-info"
import { PatientAvatar } from "@/feature/patient/patient-avatar"

import { createClient } from "@/lib/supabase/server"
import { formatCareLevel, formatGender } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export default async function PatientPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()
  const { data: patients, error: patientError } = await supabase
    .from("patients")
    .select("*")
    .eq("id", params.id)
    .single()

  if (patientError) {
    return (
      <div>
        <h1>エラーが発生しました</h1>
        <pre>{JSON.stringify(patientError, null, 2)}</pre>
      </div>
    )
  }

  const { data: drugs, error: drugError } = await supabase
    .from("drugs")
    .select("*")
    .eq("patient_id", params.id)

  if (drugError) {
    return (
      <div>
        <h1>エラーが発生しました</h1>
        <pre>{JSON.stringify(drugError, null, 2)}</pre>
      </div>
    )
  }

  const { url: avatarUrl } = await getS3Data(
    patients.image_id,
    process.env.FACES_BUCKET ?? ""
  )

  const drugWithUrls = await Promise.all(
    drugs.map(async (drug) => {
      const { url } = await getS3Data(
        drug.image_id,
        process.env.DRUGS_BUCKET ?? ""
      )
      return { ...drug, url }
    })
  )

  const today = new Date()

  const sunday = new Date(today.setDate(today.getDate() - today.getDay()))
  sunday.setHours(0, 0, 0, 0) // 日付を0時0分0秒に設定

  const saturday = new Date(today.setDate(sunday.getDate() + 6))
  saturday.setHours(23, 59, 59, 999) // 日付を23時59分59秒に設定

  const { data: drugHistories, error: drugHistoryError } = await supabase
    .from("drug_histories")
    .select("*")
    .eq("patent_id", params.id)
    .gte("created_at", sunday.toISOString())
    .lte("created_at", saturday.toISOString())

  if (drugHistoryError) {
    return (
      <div>
        <h1>エラーが発生しました</h1>
        <pre>{JSON.stringify(drugHistoryError, null, 2)}</pre>
      </div>
    )
  }

  const userIds = drugHistories.map((dh) => dh.user_id)
  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .select("id, name")
    .in("id", userIds)

  if (profileError) {
    return (
      <div>
        <h1>エラーが発生しました</h1>
        <pre>{JSON.stringify(profileError, null, 2)}</pre>
      </div>
    )
  }

  // profileデータをdrugHistoriesに統合
  const drugHistoriesWithNames = drugHistories.map((dh) => {
    const profile = profiles.find((p) => p.id === dh.user_id)
    return { ...dh, user_name: profile?.name ?? "" }
  })

  return (
    <section className="min-h-screen bg-[#F5F5F5]">
      <div className="rounded-b-[8px] bg-white px-4 pb-4 pt-[60px] shadow-shadow">
        <div className="flex items-center gap-2">
          <PatientAvatar size={60} src={avatarUrl} />
          <div>
            <h2 className="text-xl">
              {patients.last_name} {patients.first_name}
            </h2>
            <div>
              {patients.birthday} / {formatGender(patients.gender)} /{" "}
              {formatCareLevel(patients.care_level)}
            </div>
          </div>
        </div>
        <div className="mt-[38px]">
          <Link
            href={`/patients/${params.id}/edit`}
            className={`${buttonVariants()} block w-full`}
          >
            編集
          </Link>
        </div>
      </div>
      <div className="space-y-[38px] px-4 py-8">
        <DrugHistory
          drugHistoriesWithNames={drugHistoriesWithNames}
          id={params.id}
        />
        <DrugInfo drugs={drugWithUrls} />
      </div>
    </section>
  )
}
