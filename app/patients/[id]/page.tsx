import Image from "next/image"

import { createClient } from "@/lib/supabase/server"
import { getS3Data } from "@/app/actions/s3/get-s3-data"

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

  const { src } = await getS3Data(data.image_id ?? "")

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div>
        <Image
          src={src}
          alt={data.name ?? "Patient"}
          width={200}
          height={200}
          className="object-cover"
        />

        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          {data.name}
        </h1>
      </div>
    </section>
  )
}
