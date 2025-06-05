
import * as React from "react"

interface SidebarProviderProps {
  children: React.ReactNode
}

interface SidebarContextProps {
  open: boolean
  setOpen: (open: boolean) => void
}

const SidebarContext = React.createContext<SidebarContextProps | undefined>(undefined)

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [open, setOpen] = React.useState(true)
  
  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
