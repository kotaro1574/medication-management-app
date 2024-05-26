import Image from "next/image"
import Link from "next/link"
import { getS3Data } from "@/actions/s3/get-s3-data"

import { createClient } from "@/lib/supabase/server"
import { placeholder } from "@/lib/utils"

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
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div>
        <Link href={`/patients/${data.id}/edit`}>Edit</Link>
      </div>
      <Image
        src={url}
        alt="S3 Image"
        placeholder={placeholder({ w: 300, h: 300 })}
        width={300}
        height={300}
        className="rounded-md object-cover"
        style={{
          maxWidth: "100%",
          height: "auto",
        }}
      />

      <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
        {data.name}
      </h1>
    </section>
  )
}
