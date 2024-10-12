import { UpdateFacilityForm } from "@/feature/facility/update-facility-form"

import { createClient } from "@/lib/supabase/server"

export default async function EditFacilityPage({
  params,
}: {
  params: {
    id: string
  }
}) {
  const supabase = createClient()
  const { data: facility, error: facilityError } = await supabase
    .from("facilities")
    .select("*")
    .eq("id", params.id)
    .single()

  if (facilityError) {
    console.error(facilityError)
    return <div>error: {facilityError.message}</div>
  }

  return (
    <section className="px-4 pb-8 pt-[62px]">
      <h2 className="mb-[60px] text-xl text-[#C2B37F]">施設編集</h2>
      <UpdateFacilityForm facility={facility} />
    </section>
  )
}
