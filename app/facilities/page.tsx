import Link from "next/link"

import { createClient } from "@/lib/supabase/server"
import { Icons } from "@/components/ui/icons"

export default async function FacilitiesPage() {
  const supabase = createClient()
  const { data: facilities, error: facilitiesError } = await supabase
    .from("facilities")
    .select("*")

  if (facilitiesError) {
    console.error(facilitiesError)
    return <div>error</div>
  }

  return (
    <section className="px-4 pb-8 pt-[62px]">
      <h2 className=" text-xl text-[#C2B37F]">施設一覧</h2>
      {facilities.length === 0 ? (
        <p className="mt-4 text-sm text-[#A4A4A4]">
          施設が登録されていません。
        </p>
      ) : (
        <div className="mt-[60px]">
          <h3 className="text-base">施設名</h3>
          <div className="pt-[34px]">
            {facilities.map((facility) => (
              <div
                key={facility.id}
                className="mb-[26px] flex items-center justify-between border-b-[0.5px] border-[#A4A4A4] pb-[14px]"
              >
                <div className="max-w-60 sm:max-w-[500px]">
                  <p className="whitespace-normal break-words">
                    {facility.name_ja}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Link href={`/facilities/${facility.id}`}>
                    <Icons.edit />
                  </Link>
                  <Icons.trash className="size-6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
