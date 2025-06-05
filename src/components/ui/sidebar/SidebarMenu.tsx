
import * as React from "react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./SidebarProvider"

interface SidebarMenuProps {
  children?: React.ReactNode
  className?: string
}

export function SidebarMenu({ children, className }: SidebarMenuProps) {
  return (
    <nav className={cn("flex flex-col space-y-1", className)}>
      {children}
    </nav>
  )
}

interface SidebarMenuItemProps {
  children?: React.ReactNode
  className?: string
  active?: boolean
}

export function SidebarMenuItem({ children, className, active = false }: SidebarMenuItemProps) {
  return (
    <div className={cn(
      "relative",
      active && "before:absolute before:left-0 before:top-1 before:h-[calc(100%-0.5rem)] before:w-1 before:rounded-r-lg before:bg-primary",
      className
    )}>
      {children}
    </div>
  )
}

interface SidebarMenuButtonProps {
  children?: React.ReactNode
  className?: string
  asChild?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

export function SidebarMenuButton({ children, className, asChild = false, ...props }: SidebarMenuButtonProps) {
  const { open } = useSidebar()
  const Comp = asChild ? React.Fragment : "button"
  
  return (
    <Comp 
      className={cn(
        "flex w-full items-center rounded-md px-3 py-3 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        !open && "justify-center px-0",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  )
}
