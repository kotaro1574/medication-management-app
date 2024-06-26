import Image from "next/image"
import Link from "next/link"
import { getS3Data } from "@/actions/s3/get-s3-data"
import { DrugHistory } from "@/feature/drugHistory/drug-history"
import { DrugInfo } from "@/feature/drugHistory/drug-info"
import { PatientAvatar } from "@/feature/patient/patient-avatar"

import { createClient } from "@/lib/supabase/server"
import { formatCareLevel, formatGender } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
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

  const { url } = await getS3Data(
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

  return (
    <section className="min-h-screen bg-[#F5F5F5]">
      <div className="rounded-b-[8px] bg-white px-4 pb-4 pt-[60px] shadow-shadow">
        <div className="flex items-center gap-2">
          <PatientAvatar src={url} />
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
      <div className="px-4 py-8">
        <DrugHistory />
        <div className="mt-[38px]">
          <DrugInfo drugs={drugWithUrls} />
        </div>
      </div>
    </section>
  )
}
