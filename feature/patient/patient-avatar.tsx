import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Props = {
  size?: number
  src: string
}

export function PatientAvatar({ size = 60, src }: Props) {
  return (
    <Avatar className={`size-[${size}px]`}>
      <AvatarImage src={src} alt={"avatar-image"} />
      <AvatarFallback />
    </Avatar>
  )
}
