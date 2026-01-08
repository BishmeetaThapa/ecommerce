import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-screen">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Content */}
        <main className="flex-1 w-full p-8 bg-muted/40 overflow-x-auto">
          {/* Optional: Trigger for collapsible sidebar */}
          <SidebarTrigger />
          
          {/* Page content */}
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
