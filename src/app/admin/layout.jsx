"use client";

import React, { useState } from "react";
import Sidebar from "@/components/admin/navigation/Sidebar";
import Topbar from "@/components/admin/layout/Topbar";
import { usePathname } from "next/navigation";
import { ToastProvider } from "@/components/admin/shared/ToastProvider";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Simple title mapper
  const getPageTitle = (path) => {
    if (path === "/admin") return "Overview Dashboard";
    const segment = path.split("/").pop();
    return segment.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };

  const pageTitle = getPageTitle(pathname);
  const breadcrumbs = ["Admin", pageTitle];

  return (
    <ToastProvider>
      <div className="min-h-screen bg-brand-bg flex">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Main Content */}
        <div
          className="flex-1 flex flex-col transition-all duration-300 relative"
          style={{ marginLeft: isSidebarCollapsed ? "80px" : "280px" }}
        >
          <Topbar title={pageTitle} breadcrumbs={breadcrumbs} />

          <main className="flex-1 p-6 md:p-8 max-w-[1600px] w-full">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
