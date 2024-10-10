"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { deleteFacility } from "@/actions/facility/delete-facility"
import { th } from "date-fns/locale"

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
    try {
      setLoading(true)
      const response = await deleteFacility({ id: facility.id })
      if (response.success) {
        router.push("/facilities")
        router.refresh()
        toast({
          title: response.message,
        })
      } else {
        throw new Error(response.error)
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({ title: error.message, variant: "destructive" })
      }
    } finally {
      setLoading(false)
    }
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
