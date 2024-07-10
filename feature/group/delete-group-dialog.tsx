"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { deleteGroup } from "@/actions/groups/delete-group"

import { Database } from "@/types/schema.gen"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

type Props = {
  trigger: React.ReactNode
  group: Database["public"]["Tables"]["groups"]["Row"]
}

export function DeleteGroupDialog({ trigger, group }: Props) {
  const [loading, startTransaction] = useTransition()
  const router = useRouter()

  const onDelete = () => {
    startTransaction(() => {
      ;(async () => {
        const response = await deleteGroup({
          id: group.id,
        })
        if (response.success) {
          router.push("/groups")
          router.refresh()
          toast({
            title: response.message,
          })
        } else {
          toast({ title: response.error })
        }
      })()
    })
  }
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        style={{
          width: "calc(100% - 32px)",
        }}
        className="bg-[#F5F5F5]"
      >
        <DialogHeader>
          <DialogTitle>グループを削除しますか？</DialogTitle>
          <DialogDescription>{`${group.name}のデータは完全に削除されます。`}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              閉じる
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button disabled={loading} onClick={onDelete} variant="destructive">
              {loading ? "削除中..." : "削除する"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
