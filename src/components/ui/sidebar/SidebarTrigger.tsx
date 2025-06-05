
import * as React from "react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./SidebarProvider"

interface SidebarTriggerProps {
  children?: React.ReactNode
  className?: string
}

export function SidebarTrigger({ children, className }: SidebarTriggerProps) {
  const { open, setOpen } = useSidebar()

  return (
    <button
      className={cn("rounded-lg p-2 flex items-center justify-center text-muted-foreground hover:text-foreground", className)}
      onClick={() => setOpen(!open)}
    >
      {children ? children : (
        open ? (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6"></path>
          </svg>
        ) : (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6"></path>
          </svg>
        )
      )}
    </button>
  )
}
