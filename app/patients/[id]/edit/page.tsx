import { getS3Data } from "@/actions/s3/get-s3-data"
import { UpdatePatientForm } from "@/feature/patient/update-patient-form"

import { createClient } from "@/lib/supabase/server"

export default async function EditPatientPage({
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

  const { src } = await getS3Data(data.image_id ?? "")

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Edit Patient
        </h1>

        <UpdatePatientForm patient={data} url={src} />
      </div>
    </section>
  )
}