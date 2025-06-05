
import * as React from "react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./SidebarProvider"

interface SidebarHeaderProps {
  children?: React.ReactNode
  className?: string
}

export function SidebarHeader({ children, className }: SidebarHeaderProps) {
  const { open } = useSidebar()

  return (
    <div className={cn(
      "px-3 flex items-center justify-between h-14 mb-4", 
      open ? "px-6" : "px-2 justify-center",
      className
    )}>
      {children}
    </div>
  )
}

interface SidebarContentProps {
  children?: React.ReactNode
  className?: string
}

export function SidebarContent({ children, className }: SidebarContentProps) {
  return (
    <div className={cn("flex flex-col space-y-1", className)}>
      {children}
    </div>
  )
}

interface SidebarFooterProps {
  children?: React.ReactNode
  className?: string
}

export function SidebarFooter({ children, className }: SidebarFooterProps) {
  return (
    <div className={cn("mt-auto pt-4 px-6", className)}>
      {children}
    </div>
  )
}
