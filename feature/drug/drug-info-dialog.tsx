import { ReactNode } from "react"
import Image from "next/image"
import { X } from "lucide-react"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

type Props = {
  trigger: ReactNode
  file: File
}

export function DrugInfoDialog({ trigger, file }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className="rounded-none border-0 p-0"
        style={{
          width: "calc(100% - 32px)",
        }}
        isClose={false}
      >
        <DialogClose className="absolute -top-6 right-0">
          <X className="size-5" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <AspectRatio ratio={340 / 400}>
          <Image alt={file.name} src={URL.createObjectURL(file)} fill />
        </AspectRatio>
      </DialogContent>
    </Dialog>
  )
}
