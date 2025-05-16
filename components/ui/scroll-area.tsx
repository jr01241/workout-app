'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

const ScrollArea = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <div className="h-full w-full rounded-[inherit]">
      {children}
    </div>
    <div className="absolute right-0 top-0 h-full w-2.5 border-l border-border">
      <div className="relative flex-1 rounded-full bg-border" />
    </div>
  </div>
))
ScrollArea.displayName = "ScrollArea"

export { ScrollArea }
