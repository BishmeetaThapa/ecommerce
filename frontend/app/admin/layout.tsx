'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/sonner"
import authUtils from "@/lib/auth"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    // Check if user is authenticated
    const token = authUtils.getToken()
    const user = authUtils.getUser()

    if (!token || !user) {
      router.push('/login')
      return
    }

    // Check if user is admin
    if (user.role?.toLowerCase() !== 'admin') {
      router.push('/login')
      return
    }
  }, [router, isMounted])

  const token = isMounted ? authUtils.getToken() : null
  const user = isMounted ? authUtils.getUser() : null

  // Show loading while checking auth
  if (!isMounted || !token || !user || user.role?.toLowerCase() !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-screen">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Content */}
        <main className="flex-1 w-full p-8 bg-muted/40 overflow-x-auto">
          {/* Optional: Trigger for collapsible sidebar */}
          <SidebarTrigger />

          <Toaster />
          {/* Page content */}
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
