import { PatientFaceAndDrugRecognition } from "@/feature/patient/patient-face-and-drug-recognition"

export default async function TopPage() {
  return (
    <section className="px-4 pb-[60px] pt-[70px]">
      <PatientFaceAndDrugRecognition />
    </section>
  )
}
