"use client"

import { ReactNode } from "react"

import { Toaster } from "@/components/ui/toaster"

export function ToasterProvider({ children }: { children: ReactNode }) {
  return (
    <div>
      {children}
      <Toaster />
    </div>
  )
}
