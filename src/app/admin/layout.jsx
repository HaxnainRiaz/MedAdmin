"use client";

import React, { useState } from "react";
import Sidebar from "@/components/admin/navigation/Sidebar";
import Topbar from "@/components/admin/layout/Topbar";
import { usePathname } from "next/navigation";
import { ToastProvider } from "@/components/admin/shared/ToastProvider";
import { cn } from "@/lib/admin-utils";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Simple title mapper
  const getPageTitle = (path) => {
    if (path === "/admin") return "Overview Dashboard";
    const segment = path.split("/").pop();
    return segment.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };

  const pageTitle = getPageTitle(pathname);
  const breadcrumbs = ["Admin", pageTitle];

  // Close mobile sidebar on route change
  React.useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-brand-bg flex overflow-x-hidden">
        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-50 lg:hidden transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content */}
        <div
          className={cn(
            "flex-1 flex flex-col transition-all duration-300 relative min-w-0 w-full",
            isSidebarCollapsed ? "lg:pl-[80px]" : "lg:pl-[280px]"
          )}
        >
          <Topbar
            title={pageTitle}
            breadcrumbs={breadcrumbs}
            onMenuClick={() => setIsMobileSidebarOpen(true)}
          />

          <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-[1600px] w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
