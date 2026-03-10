"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Activity,
    Building2,
    FileText,
    BookCheck,
    Users,
    FileCheck,
    CreditCard,
    Globe,
    Settings
} from "lucide-react";
import { cn } from "@/lib/admin-utils";

export default function InsuranceLayout({ children }) {
    const pathname = usePathname();

    const insuranceTabs = [
        { name: "Overview", href: "/admin/insurance", icon: Activity },
        { name: "Providers", href: "/admin/insurance/providers", icon: Building2 },
        { name: "Plans", href: "/admin/insurance/plans", icon: FileText },
        { name: "Coverage Rules", href: "/admin/insurance/coverage-rules", icon: BookCheck },
        { name: "Patient Records", href: "/admin/insurance/patient-records", icon: Users },
        { name: "Verifications", href: "/admin/insurance/verifications", icon: FileCheck },
        { name: "Billing Reference", href: "/admin/insurance/billing", icon: CreditCard },
        { name: "Website Content", href: "/admin/insurance/website-content", icon: Globe },
        { name: "Settings", href: "/admin/insurance/settings", icon: Settings },
    ];

    return (
        <div className="flex flex-col gap-6">
            {/* Horizontal Sub-module Navigation */}
            <div className="bg-white border border-brand-border rounded-xl p-1.5 flex items-center gap-1 overflow-x-auto no-scrollbar shadow-premium-sm sticky top-0 z-40">
                {insuranceTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = pathname === tab.href;
                    return (
                        <Link
                            key={tab.name}
                            href={tab.href}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all",
                                isActive
                                    ? "bg-primary text-white shadow-premium"
                                    : "text-brand-muted hover:bg-brand-bg hover:text-navy"
                            )}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            {tab.name}
                        </Link>
                    );
                })}
            </div>

            {/* Sub-module Viewport */}
            <div className="min-h-[70vh]">
                {children}
            </div>
        </div>
    );
}
