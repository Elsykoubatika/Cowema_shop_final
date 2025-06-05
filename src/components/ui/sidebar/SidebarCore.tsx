
import * as React from "react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./SidebarProvider"

interface SidebarProps {
  children?: React.ReactNode
  className?: string
}

export function Sidebar({ children, className }: SidebarProps) {
  const { open } = useSidebar()
  
  return (
    <div 
      className={cn(
        "bg-background transition-all border-r border-border duration-300 ease-in-out py-4",
        open ? "w-[280px] min-w-[280px]" : "w-12 min-w-[48px]",
        className
      )}
    >
      {children}
    </div>
  )
}

interface SidebarInsetProps {
  children?: React.ReactNode
  className?: string
}

export function SidebarInset({ children, className }: SidebarInsetProps) {
  return (
    <main className={cn("flex-1 flex flex-col", className)}>
      {children}
    </main>
  )
}
