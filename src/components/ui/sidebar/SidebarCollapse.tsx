
import * as React from "react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./SidebarProvider"

interface SidebarCollapseProps {
  children?: React.ReactNode
  className?: string
  title?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  icon?: React.ReactNode
}

export function SidebarCollapse({ 
  children, 
  className,
  title,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  icon
}: SidebarCollapseProps) {
  const { open: sidebarOpen } = useSidebar()
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  
  const isOpen = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen
  const setIsOpen = setControlledOpen !== undefined ? setControlledOpen : setUncontrolledOpen
  
  return (
    <div className={cn("space-y-1", className)}>
      <button 
        className={cn(
          "flex w-full items-center justify-between rounded-md px-3 py-3 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          !sidebarOpen && "justify-center px-0"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          {icon && <div className="text-muted-foreground">{icon}</div>}
          {sidebarOpen && <span>{title}</span>}
        </div>
        {sidebarOpen && (
          <div 
            className={cn(
              "transition-transform",
              isOpen ? "rotate-180" : "rotate-0"
            )}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6"></path>
            </svg>
          </div>
        )}
      </button>
      {sidebarOpen && isOpen && (
        <div className="ml-6 space-y-1">
          {children}
        </div>
      )}
    </div>
  )
}

interface SidebarCollapseItemProps {
  children?: React.ReactNode
  className?: string
}

export function SidebarCollapseItem({ children, className }: SidebarCollapseItemProps) {
  return (
    <div className={cn("", className)}>
      {children}
    </div>
  )
}
