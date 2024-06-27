import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Props = {
  size?: number
  src: string
}

export function PatientAvatar({ size = 40, src }: Props) {
  return (
    <Avatar
      style={{
        width: size,
        height: size,
      }}
    >
      <AvatarImage src={src} alt={"avatar-image"} className="object-cover" />
      <AvatarFallback size={size} />
    </Avatar>
  )
}
