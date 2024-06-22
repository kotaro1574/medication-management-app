import Link from "next/link"
import { getS3Data } from "@/actions/s3/get-s3-data"
import { DrugHistoryItem } from "@/feature/drugHistory/drug-history-item"
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
  const { data } = await supabase
    .from("patients")
    .select("*")
    .eq("id", params.id)
    .single()

  if (!data) {
    return { status: 404 }
  }

  const { url } = await getS3Data(data.image_id, process.env.FACES_BUCKET ?? "")

  return (
    <section className="min-h-screen bg-[#F5F5F5]">
      <div className="rounded-b-[8px] bg-white px-4 pb-4 pt-[60px] shadow-shadow">
        <div className="flex items-center gap-2">
          <PatientAvatar src={url} />
          <div>
            <h2 className="text-xl">
              {data.last_name} {data.first_name}
            </h2>
            <div>
              {data.birthday} / {formatGender(data.gender)} /{" "}
              {formatCareLevel(data.care_level)}
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
      <div className="space-y-2 px-4 py-8">
        {Array.from({ length: 7 }).map((_, i) => (
          <DrugHistoryItem key={i} />
        ))}
      </div>
    </section>
  )
}
