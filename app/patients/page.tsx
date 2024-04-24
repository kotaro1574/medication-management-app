import Link from "next/link"

import { createClient } from "@/lib/supabase/server"

export default async function PatientsPage() {
  const supabase = createClient()
  const { data: patients } = await supabase.from("patients").select("*")

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <h1>Patients</h1>
      <ul>
        {patients?.map((patient) => (
          <li key={patient.id}>
            <p>{patient.name}</p>
          </li>
        ))}
      </ul>
      <Link href="/patients/create">Create Patient</Link>
    </section>
  )
}
