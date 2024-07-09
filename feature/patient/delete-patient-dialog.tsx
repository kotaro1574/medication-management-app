import { ReactNode, useTransition } from "react"
import { useRouter } from "next/navigation"
import { deletePatient } from "@/actions/patients/delete-patients"

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
  faceImageIds: string[]
  drugImageIds: string[]
  trigger: ReactNode
  patient: Database["public"]["Tables"]["patients"]["Row"]
}

export function DeletePatientDialog({
  trigger,
  patient,
  faceImageIds,
  drugImageIds,
}: Props) {
  const [loading, startTransaction] = useTransition()
  const router = useRouter()

  const onDelete = () => {
    startTransaction(() => {
      ;(async () => {
        const response = await deletePatient({
          id: patient.id,
          drugImageIds: drugImageIds,
          faceData: {
            faceIds: patient.face_ids,
            imageIds: faceImageIds,
          },
        })
        if (response.success) {
          router.push("/patients")
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
          <DialogTitle>患者を削除しますか？</DialogTitle>
          <DialogDescription>{`${patient.last_name} ${patient.first_name}のデータは完全に削除されます。`}</DialogDescription>
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
