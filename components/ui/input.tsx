import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isError?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, isError = false, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          `flex h-10 w-full rounded-[10px] border-[0.5px] border-[#A4A4A4] bg-white px-3 py-2 text-base text-black disabled:cursor-not-allowed disabled:opacity-50 ${
            isError &&
            "border-destructive focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-destructive"
          }`,
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
