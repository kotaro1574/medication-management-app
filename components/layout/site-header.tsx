import { Icons } from "../ui/icons"

type Props = {
  profileName: string
}

export function SiteHeader({ profileName }: Props) {
  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="flex h-11 items-center justify-between space-x-4 px-4 py-3  text-[#a4a4a4]">
        <div className="flex items-center gap-0.5">
          <Icons.fillUser />
          <div>{profileName}</div>
        </div>
        <div>
          <Icons.hamburger />
        </div>
      </div>
    </header>
  )
}
