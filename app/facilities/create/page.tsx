import { CreateFacilityForm } from "@/feature/facility/create-facility-form"

export default async function CreateFacilityPage() {
  return (
    <section className="px-4 pb-8 pt-[62px]">
      <h2 className="mb-[60px] text-xl text-[#C2B37F]">施設追加</h2>
      <CreateFacilityForm />
    </section>
  )
}
