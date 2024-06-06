import Link from "next/link"

import { createClient } from "@/lib/supabase/server"

export default async function PatientsPage() {
  const supabase = createClient()
  const { data: patients } = await supabase.from("patients").select("*")

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="mx-auto">
        <h2 className="">4/1(水)</h2>
        
      </div>

      <ul>
        {patients?.map((patient) => (
          <li key={patient.id}>
            <Link href={`/patients/${patient.id}`}>
              {patient.last_name} {patient.first_name}
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/patients/create">Create Patient</Link>
    </section>
  )
}
