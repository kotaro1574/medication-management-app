import Link from "next/link"

import { Database } from "@/types/schema.gen"
import { Icons } from "@/components/ui/icons"

import { DeleteGroupDialog } from "./delete-group-dialog"

type Props = {
  group: Database["public"]["Tables"]["groups"]["Row"]
}

export function GroupItem({ group }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>{group.name}</div>
      <div className="flex items-center gap-2">
        <Link href={`/groups/${group.id}`}>
          <Icons.edit />
        </Link>
        <DeleteGroupDialog
          group={group}
          trigger={<Icons.trash className="size-6" />}
        />
      </div>
    </div>
  )
}
