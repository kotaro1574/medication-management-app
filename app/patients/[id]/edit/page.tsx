import { getS3Data } from "@/actions/s3/get-s3-data"
import { UpdatePatientForm } from "@/feature/patient/update-patient-form"

import { createClient } from "@/lib/supabase/server"

export default async function EditPatientPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()
  const { data: patient, error: patientError } = await supabase
    .from("patients")
    .select("*")
    .eq("id", params.id)
    .single()

  if (patientError) {
    console.error(patientError)
    return <div>Error</div>
  }

  // 患者の服用薬の画像IDを取得
  const { data: faces, error: facesError } = await supabase
    .from("faces")
    .select("image_id")
    .eq("patient_id", patient.id)

  if (facesError) {
    console.error(facesError)
    return <div>Error</div>
  }

  const { data: drugs, error: drugsError } = await supabase
    .from("drugs")
    .select("image_id")
    .eq("patient_id", patient.id)

  if (drugsError) {
    console.error(drugsError)
    return <div>Error</div>
  }

  // 患者の顔画像のURLを取得
  const { url: faceUrl } = await getS3Data(
    patient.image_id,
    process.env.FACES_BUCKET ?? ""
  )

  // 薬の画像のURLを取得
  const drugUrls = await Promise.all(
    drugs.map(async (drug) => {
      const { url } = await getS3Data(
        drug.image_id,
        process.env.DRUGS_BUCKET ?? ""
      )
      return url
    })
  )

  const faceImageIds = faces.map((face) => face.image_id)
  const drugImageIds = drugs.map((drug) => drug.image_id)

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="mzax-w-[980px] flex flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Edit Patient
        </h1>

        <UpdatePatientForm
          faceImageIds={faceImageIds}
          drugImageIds={drugImageIds}
          patient={patient}
          faceUrl={faceUrl}
          drugUrls={drugUrls}
        />
      </div>
    </section>
  )
}
