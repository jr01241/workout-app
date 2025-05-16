'use client'

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        input: "h-10 rounded-md px-4 py-2 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<typeof InputPrimitive.Root> &
    VariantProps<typeof inputVariants>
>(({ className, variant, type, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(inputVariants({ variant, className }))}
      type={type}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input, inputVariants }
