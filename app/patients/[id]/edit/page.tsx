import { getS3Data } from "@/actions/s3/get-s3-data"
import { UpdatePatientForm } from "@/feature/patient/updateForm/update-patient-form"

import { createClient } from "@/lib/supabase/server"

export default async function EditPatientPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user?.id ?? "")
    .single()

  if (profileError) {
    console.error(profileError)
    return <div>profileError</div>
  }

  const { data: patient, error: patientError } = await supabase
    .from("patients")
    .select("*")
    .eq("id", params.id)
    .single()

  if (patientError) {
    console.error(patientError)
    return <div>patientError</div>
  }

  // 患者の服用薬の画像IDを取得
  const { data: patientFaces, error: facesError } = await supabase
    .from("patient_faces")
    .select("image_id")
    .eq("patient_id", patient.id)

  if (facesError) {
    console.error(facesError)
    return <div>faceError</div>
  }

  const { data: _drugs, error: drugsError } = await supabase
    .from("drugs")
    .select("id ,image_id, user_id")
    .eq("patient_id", patient.id)

  if (drugsError) {
    console.error(drugsError)
    return <div>drugError</div>
  }

  // 患者の顔画像のURLを取得
  const { url: faceUrl } = await getS3Data(
    patient.image_id,
    process.env.PATIENT_FACES_BUCKET ?? ""
  )

  // 登録済み薬の画像のURLを取得
  const registeredDrugs = await Promise.all(
    _drugs.map(async (drug) => {
      const { url } = await getS3Data(
        drug.image_id,
        process.env.DRUGS_BUCKET ?? ""
      )

      const { data } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", drug.user_id)
        .single()

      return { id: drug.id, url, userName: data?.name ?? "" }
    })
  )

  const { data: alerts, error: alertsError } = await supabase
    .from("alerts")
    .select("*")
    .eq("patient_id", patient.id)

  if (alertsError) {
    console.error(alertsError)
    return <div>alertsError</div>
  }

  // 削除のために画像IDを取得
  const faceImageIds = patientFaces.map((patientFace) => patientFace.image_id)
  const drugImageIds = _drugs.map((drug) => drug.image_id)

  return (
    <section className="min-h-screen bg-[#F5F5F5] px-4 pb-8 pt-[62px]">
      <UpdatePatientForm
        faceImageIds={faceImageIds}
        drugImageIds={drugImageIds}
        patient={patient}
        alerts={alerts}
        faceUrl={faceUrl}
        registeredDrugs={registeredDrugs}
        currentUserName={profile.name}
      />
    </section>
  )
}
