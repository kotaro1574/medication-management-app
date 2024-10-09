import Link from "next/link"
import { FacilityItem } from "@/feature/facility/facility-item"

import { createClient } from "@/lib/supabase/server"
import { buttonVariants } from "@/components/ui/button"

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
      <div>
        {facilities.length === 0 ? (
          <p className="mt-4 text-sm text-[#A4A4A4]">
            施設が登録されていません。
          </p>
        ) : (
          <div className="mt-[60px]">
            <h3 className="text-base">施設名</h3>
            <div className="pt-[34px]">
              {facilities.map((facility) => (
                <FacilityItem key={facility.id} facility={facility} />
              ))}
            </div>
          </div>
        )}
      </div>
      <Link
        className={`${buttonVariants()} ${
          facilities.length === 0 ? "mt-4" : "mt-[6px]"
        } block w-full`}
        href="/facilities/create"
      >
        追加
      </Link>
    </section>
  )
}
