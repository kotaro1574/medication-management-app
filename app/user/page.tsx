import { getS3Data } from "@/actions/s3/get-s3-data"
import { EditUserForm } from "@/feature/user/edit-user-form"
import { EmailChangeConfirmToast } from "@/feature/user/email-change-confirm-toast"

import { createClient } from "@/lib/supabase/server"

export default async function UserPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>user not found</div>
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, name, facility_id, image_id")
    .eq("id", user.id)
    .single()

  if (profileError) {
    console.error(profileError)
    return <div>profileError</div>
  }

  const { url: faceUrl } = await getS3Data(
    profile.image_id,
    process.env.USER_FACES_BUCKET ?? ""
  )

  const { data: facility, error: facilityError } = await supabase
    .from("facilities")
    .select("id, name")
    .eq("id", profile.facility_id)
    .single()

  if (facilityError) {
    console.error(facilityError)
    return <div>facilityError</div>
  }

  return (
    <section className="min-h-screen bg-[#F5F5F5] px-4 pb-8 pt-[62px]">
      <EditUserForm
        profile={profile}
        faceUrl={faceUrl}
        email={user.email ?? ""}
        facility={facility}
      />
      <EmailChangeConfirmToast user={user} name={profile.name} />
    </section>
  )
}
