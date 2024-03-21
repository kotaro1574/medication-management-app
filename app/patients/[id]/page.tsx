import { headers } from "next/headers"
import Image from "next/image"

import { supabase } from "@/lib/supabase"
import { AspectRatio } from "@/components/ui/aspect-ratio"

export default async function PatientPage({
  params,
}: {
  params: { id: string }
}) {
  const { data } = await supabase
    .from("patients")
    .select("*")
    .eq("id", params.id)
    .single()

  if (!data) {
    return { status: 404 }
  }

  const host = headers().get("host")
  const protocal = process?.env.NODE_ENV === "development" ? "http" : "https"

  const fetchUrl = `${protocal}://${host}/api/s3/${data.image_id ?? ""}`

  const imageUrlResponse = await fetch(fetchUrl)
  const imageUrl = await imageUrlResponse.json()

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div>
        {/* <AspectRatio
          ratio={1 / 1}
          className="size-40 overflow-hidden rounded-md"
        > */}
        <Image
          src={imageUrl.src}
          alt={data.name ?? "Patient"}
          width={200}
          height={200}
          className="object-cover"
        />
        {/* </AspectRatio> */}
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          {data.name}
        </h1>
      </div>
    </section>
  )
}
