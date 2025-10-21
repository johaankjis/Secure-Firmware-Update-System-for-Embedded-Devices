"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Shield, Upload, FileText, AlertTriangle, CheckCircle2, BarChart3, Lock, Server } from "lucide-react"

const navItems = [
  {
    title: "Overview",
    href: "/",
    icon: BarChart3,
  },
  {
    title: "Firmware Updates",
    href: "/firmware",
    icon: Upload,
  },
  {
    title: "SBOM Manager",
    href: "/sbom",
    icon: FileText,
  },
  {
    title: "Threat Modeling",
    href: "/threats",
    icon: AlertTriangle,
  },
  {
    title: "Security Validation",
    href: "/validation",
    icon: CheckCircle2,
  },
  {
    title: "Compliance",
    href: "/compliance",
    icon: Shield,
  },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col border-r border-border bg-sidebar">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <Lock className="h-6 w-6 text-primary" />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-sidebar-foreground">SecureFirmware</span>
          <span className="text-xs text-muted-foreground">OTA Management</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/50 p-3">
          <Server className="h-4 w-4 text-accent" />
          <div className="flex flex-col">
            <span className="text-xs font-medium text-sidebar-foreground">System Status</span>
            <span className="text-xs text-accent">All Systems Operational</span>
          </div>
        </div>
      </div>
    </div>
  )
}
