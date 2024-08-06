import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icons } from "@/components/ui/icons"

type Props = {
  size?: "sm" | "md"
  src: string
}

export function PatientAvatar({ size = "md", src }: Props) {
  const avatarSizeMap = {
    sm: 40,
    md: 60,
  }
  const iconSizeMap = {
    sm: 15,
    md: 20,
  }
  return (
    <div className={"relative"}>
      <Avatar
        style={{
          width: avatarSizeMap[size],
          height: avatarSizeMap[size],
        }}
      >
        <AvatarImage src={src} alt={"avatar-image"} className="object-cover" />
        <AvatarFallback size={avatarSizeMap[size]} />
      </Avatar>
      <Icons.alertBell
        style={{
          width: iconSizeMap[size],
          height: iconSizeMap[size],
        }}
        className="absolute -right-px -top-px"
      />
    </div>
  )
}
