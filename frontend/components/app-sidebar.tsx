"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Users,
  Settings,
  Sparkles,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

type NavItem = {
  title: string
  url: string
  icon: React.ElementType
}

const dashboardNav: NavItem[] = [
  { title: "Overview", url: "/admin", icon: LayoutDashboard },
]

const storeNav: NavItem[] = [
  { title: "Products", url: "/admin/products", icon: Package },
  { title: "Categories", url: "/admin/categories", icon: Tags },
  { title: "Orders", url: "/admin/orders", icon: ShoppingCart },
  { title: "Customers", url: "/admin/customers", icon: Users },
  { title: "Users", url: "/admin/users", icon: Users }, // Added Users
]

const systemNav: NavItem[] = [
  { title: "Settings", url: "/admin/settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()

  const isActive = (url: string) =>
    pathname === url || pathname.startsWith(`${url}/`)

  const renderMenu = (items: NavItem[]) =>
    items.map((item) =>{
      const active = isActive(item.url)

      return (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild>
            <Link
              href={item.url} 
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-5 py-3 text-sm font-medium transition-all",
                active
                  ? "bg-gradient-to-r from-rose-500/15 to-pink-500/10 text-rose-600 shadow-sm"
                  : "text-muted-foreground hover:bg-rose-500/5 hover:text-foreground"
              )}
            >
              {/* Glow indicator */}
              {active && (
                <span className="absolute inset-y-2 left-1 w-1 rounded-full bg-gradient-to-b from-rose-500 to-pink-500" />
              )}

              <item.icon
                className={cn(
                  "h-5 w-5",
                  active ? "text-rose-500" : "group-hover:text-rose-400"
                )}
              />

              <span className="tracking-tight">{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )
    })

  return (
    <Sidebar className="border-r bg-gradient-to-b from-white to-rose-50">
      <SidebarContent className="py-8">
        {/* Brand */}
        <div className="mb-12 px-6">
          <div className="flex items-center gap-2 text-xl font-semibold text-rose-600">
            <Sparkles className="h-5 w-5" />
            Everglow
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Beauty Admin Panel
          </p>
        </div>

        {/* Dashboard */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 text-[11px] font-semibold uppercase tracking-widest text-rose-400">
            Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderMenu(dashboardNav)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Store */}
        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="px-6 text-[11px] font-semibold uppercase tracking-widest text-rose-400">
            Store
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderMenu(storeNav)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System */}
        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="px-6 text-[11px] font-semibold uppercase tracking-widest text-rose-400">
            System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderMenu(systemNav)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-rose-100 px-6 py-4">
        <div className="text-sm">
          <div className="font-medium text-foreground">Everglow Admin</div>
          <div className="text-xs text-muted-foreground">
            Glow confidently ✨
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
