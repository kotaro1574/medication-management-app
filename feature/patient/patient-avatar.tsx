import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function PatientAvatar({ src }: { src: string }) {
  return (
    <Avatar className="size-[60px]">
      <AvatarImage src={src} alt={"avatar-image"} />
      <AvatarFallback />
    </Avatar>
  )
}
