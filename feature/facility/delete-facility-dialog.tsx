"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

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
  facility: Database["public"]["Tables"]["facilities"]["Row"]
}

export function DeleteFacilityDialog({ trigger, facility }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onDelete = async () => {
    // 削除ボタンを押した時の処理
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
          <DialogTitle>施設を削除しますか？</DialogTitle>
          <DialogDescription>{`${facility.name_jp}のデータは完全に削除されます。`}</DialogDescription>
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
