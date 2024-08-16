import { PatientFaceAndDrugRecognition } from "@/feature/patient/patient-face-and-drug-recognition"

export default async function TopPage() {
  return (
    <section className="px-4 py-[60px]">
      <PatientFaceAndDrugRecognition />
    </section>
  )
}
