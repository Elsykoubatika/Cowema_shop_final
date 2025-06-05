
import * as React from "react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./SidebarProvider"

interface SidebarGroupProps {
  children?: React.ReactNode
  className?: string
}

export function SidebarGroup({ children, className }: SidebarGroupProps) {
  return (
    <div className={cn("px-6", className)}>
      {children}
    </div>
  )
}

interface SidebarGroupLabelProps {
  children?: React.ReactNode
  className?: string
}

export function SidebarGroupLabel({ children, className }: SidebarGroupLabelProps) {
  const { open } = useSidebar()
  
  if (!open) return null
  
  return (
    <div className={cn("text-xs font-medium text-muted-foreground px-2 py-2", className)}>
      {children}
    </div>
  )
}

interface SidebarGroupContentProps {
  children?: React.ReactNode
  className?: string
}

export function SidebarGroupContent({ children, className }: SidebarGroupContentProps) {
  return (
    <div className={cn("mt-2", className)}>
      {children}
    </div>
  )
}
