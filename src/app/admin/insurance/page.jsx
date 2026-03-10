"use client";

import React, { useState } from "react";
import Link from "next/link";
import KpiCard from "@/components/admin/dashboard/KpiCard";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import DataTable from "@/components/admin/shared/DataTable";
import { useToast } from "@/components/admin/shared/ToastProvider";
import {
    ShieldPlus,
    Users,
    FileCheck,
    CreditCard,
    TrendingUp,
    ChevronRight,
    Search,
    Filter,
    ArrowUpRight,
    Clock,
    CheckCircle2,
    Calendar,
    Globe,
    Settings,
    FileText,
    Activity,
    Plus,
    Building2,
    BookCheck,
    BarChart3
} from "lucide-react";
import { cn } from "@/lib/admin-utils";

const InsuranceOverview = () => {
    const { triggerToast } = useToast();

    const kpis = [
        { title: "Total Providers", value: "18", trend: "up", trendValue: "+2", icon: Building2, color: "blue" },
        { title: "Pending Verifications", value: "24", trend: "up", trendValue: "+12%", icon: Clock, color: "orange" },
        { title: "Active Patient Policies", value: "842", trend: "up", trendValue: "+5%", icon: Users, color: "green" },
        { title: "Verified (30d)", value: "156", trend: "up", trendValue: "+8%", icon: CheckCircle2, color: "purple" },
    ];

    const recentVerifications = [
        { id: "VER-1024", patient: "Michael Brown", provider: "Blue Cross", status: "Verified", date: "Today, 10:45 AM", type: "Manual" },
        { id: "VER-1025", patient: "Emma Davis", provider: "Aetna", status: "Pending", date: "Today, 09:30 AM", type: "Auto" },
        { id: "VER-1026", patient: "James Wilson", provider: "Cigna", status: "In Review", date: "Yesterday, 04:15 PM", type: "Manual" },
        { id: "VER-1027", patient: "Sarah Miller", provider: "UnitedHealthcare", status: "Partially Verified", date: "Yesterday, 02:20 PM", type: "Auto" },
        { id: "VER-1028", patient: "David Smith", provider: "Blue Cross", status: "Rejected", date: "Yesterday, 11:05 AM", type: "Manual" },
    ];

    const policyExpirations = [
        { patient: "John Doe", provider: "Aetna", expiry: "In 3 Days", color: "text-red-500" },
        { patient: "Linda G.", provider: "Cigna", expiry: "In 8 Days", color: "text-orange-500" },
        { patient: "Robert H.", provider: "Blue Cross", expiry: "In 15 Days", color: "text-orange-400" },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-navy flex items-center gap-2">
                        <Activity className="w-6 h-6 text-primary" />
                        Insurance Overview
                    </h2>
                    <p className="text-brand-muted text-xs sm:text-sm mt-0.5">High-level KPIs and operational insurance status.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        className="btn-primary flex items-center gap-2 h-10 px-4"
                        onClick={() => triggerToast("Initializing new insurance provider workflow...", "info")}
                    >
                        <Plus className="w-4 h-4" /> Add Provider
                    </button>
                </div>
            </div>

            {/* KPI Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {kpis.map((kpi, idx) => (
                    <KpiCard key={idx} {...kpi} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Area: Recent Verifications */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="admin-card overflow-hidden">
                        <div className="p-4 border-b border-brand-border flex items-center justify-between bg-white">
                            <h3 className="text-sm font-bold text-navy flex items-center gap-2">
                                <FileCheck className="w-4 h-4 text-primary" />
                                Recent Verification Requests
                            </h3>
                            <Link href="/admin/insurance/verifications" className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest px-2 py-1 bg-primary/5 rounded">
                                View Queue
                            </Link>
                        </div>
                        <DataTable
                            headers={["Patient Name", "Provider", "Method", "Requested", "Status"]}
                        >
                            {recentVerifications.map((ver, idx) => (
                                <tr key={idx} className="hover:bg-brand-bg/30 transition-colors group cursor-pointer">
                                    <td>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-navy">{ver.patient}</span>
                                            <span className="text-[9px] text-brand-muted font-mono">{ver.id}</span>
                                        </div>
                                    </td>
                                    <td><span className="text-xs font-medium text-charcoal">{ver.provider}</span></td>
                                    <td>
                                        <span className={cn(
                                            "text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border",
                                            ver.type === "Auto" ? "bg-purple-50 text-purple-600 border-purple-100" : "bg-blue-50 text-blue-600 border-blue-100"
                                        )}>
                                            {ver.type}
                                        </span>
                                    </td>
                                    <td><span className="text-[10px] font-medium text-brand-muted">{ver.date}</span></td>
                                    <td><StatusBadge status={ver.status} /></td>
                                </tr>
                            ))}
                        </DataTable>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Quick Actions Card */}
                        <div className="admin-card p-5">
                            <h3 className="text-sm font-bold text-navy mb-4 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-primary" />
                                Insurance Quick Actions
                            </h3>
                            <div className="space-y-2">
                                {[
                                    { label: "Add Provider", href: "/admin/insurance/providers", icon: Plus },
                                    { label: "Add Plan", href: "/admin/insurance/plans", icon: FileText },
                                    { label: "Create Rule", href: "/admin/insurance/coverage-rules", icon: BookCheck },
                                    { label: "Patient Policy", href: "/admin/insurance/patient-records", icon: Users },
                                ].map((action, idx) => (
                                    <Link
                                        key={idx}
                                        href={action.href}
                                        className="flex items-center justify-between p-3 bg-brand-bg rounded-xl hover:bg-primary/5 group transition-colors border border-brand-border/40"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-brand-border group-hover:border-primary/20 group-hover:text-primary transition-all">
                                                <action.icon className="w-4 h-4" />
                                            </div>
                                            <span className="text-xs font-bold text-navy group-hover:text-primary">{action.label}</span>
                                        </div>
                                        <ChevronRight className="w-3.5 h-3.5 text-brand-muted group-hover:translate-x-0.5 transition-transform" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Top Provider Acceptance Distribution */}
                        <div className="admin-card p-5">
                            <h3 className="text-sm font-bold text-navy mb-4 flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-primary" />
                                Distribution
                            </h3>
                            <div className="space-y-4 pt-2">
                                {[
                                    { name: "Blue Cross", percent: 42, color: "bg-blue-500" },
                                    { name: "Aetna", percent: 28, color: "bg-emerald-500" },
                                    { name: "Cigna", percent: 18, color: "bg-orange-500" },
                                    { name: "UnitedHealthcare", percent: 12, color: "bg-purple-500" },
                                ].map((provider, idx) => (
                                    <div key={idx} className="space-y-1.5">
                                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                                            <span className="text-navy">{provider.name}</span>
                                            <span className="text-brand-muted">{provider.percent}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-brand-bg rounded-full overflow-hidden">
                                            <div
                                                className={cn("h-full rounded-full transition-all duration-500", provider.color)}
                                                style={{ width: `${provider.percent}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Widget: Alerts & Reminders */}
                <div className="space-y-6">
                    <div className="admin-card p-5 bg-gradient-to-br from-white to-brand-bg/30">
                        <h3 className="text-xs font-black text-brand-muted uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-orange-500" />
                            Expiring Policies
                        </h3>
                        <div className="space-y-3">
                            {policyExpirations.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-white border border-brand-border rounded-xl shadow-premium-sm transition-all hover:border-primary/20">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center border border-red-100 shrink-0">
                                            <Users className="w-3.5 h-3.5 text-red-500" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-bold text-navy leading-none">{item.patient}</span>
                                            <span className="text-[9px] text-brand-muted font-semibold mt-1 uppercase">{item.provider}</span>
                                        </div>
                                    </div>
                                    <span className={cn("text-[10px] font-black uppercase tracking-tighter", item.color)}>
                                        {item.expiry}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 py-2 border border-brand-border rounded-lg text-[10px] font-bold text-navy hover:bg-white transition-all uppercase tracking-wider">
                            See All Alerts
                        </button>
                    </div>

                    <div className="admin-card p-5 relative overflow-hidden shadow-premium-sm">
                        <div className="relative z-10">
                            <h3 className="text-sm font-bold text-navy mb-2">Publish Coverage</h3>
                            <p className="text-[11px] text-brand-muted leading-relaxed mb-4">
                                Update the accepted insurance providers and patient instructions on the clinic's public website.
                            </p>
                            <Link href="/admin/insurance/website-content" className="btn-secondary w-full flex items-center justify-center gap-2 py-2 text-xs font-bold">
                                <Globe className="w-3.5 h-3.5" /> Website Content
                            </Link>
                        </div>
                        <div className="absolute -bottom-6 -right-6 opacity-[0.03] scale-150 rotate-12 pointer-events-none">
                            <ShieldPlus className="w-32 h-32 text-navy" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InsuranceOverview;
