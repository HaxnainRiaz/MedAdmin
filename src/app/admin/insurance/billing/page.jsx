"use client";

import React, { useState } from "react";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import Modal from "@/components/admin/shared/Modal";
import DataTable from "@/components/admin/shared/DataTable";
import { useToast } from "@/components/admin/shared/ToastProvider";
import {
    Search,
    Filter,
    CreditCard,
    DollarSign,
    FileText,
    TrendingUp,
    TrendingDown,
    Building2,
    Users,
    Activity,
    BookCheck,
    CheckCircle2,
    XCircle,
    Clock,
    MoreVertical,
    Download,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    LucideHandCoins,
    Plus,
    ChevronRight
} from "lucide-react";
import { cn } from "@/lib/admin-utils";

const initialClaims = [
    { id: "CLM-9001", patient: "Michael Brown", provider: "Blue Cross", date: "Mar 08, 2026", amt: 450, approved: 380, pending: 70, status: "Submitted", ref: "BC-239912" },
    { id: "CLM-9002", patient: "Emma Davis", provider: "Aetna", date: "Mar 05, 2026", amt: 120, approved: 120, pending: 0, status: "Paid", ref: "AET-00102" },
    { id: "CLM-9003", patient: "James Wilson", provider: "Cigna", date: "Mar 02, 2026", amt: 850, approved: 0, pending: 0, status: "Denied", ref: "CIG-99812" },
    { id: "CLM-9004", patient: "Sarah Miller", provider: "UnitedHealthcare", date: "Mar 09, 2026", amt: 300, approved: 280, pending: 20, status: "Partially Approved", ref: "UHC-77123" },
    { id: "CLM-9005", patient: "David Smith", provider: "Blue Cross", date: "Mar 10, 2026", amt: 150, approved: 0, pending: 150, status: "Draft", ref: "N/A" },
];

const BillingPage = () => {
    const { triggerToast } = useToast();
    const [claims, setClaims] = useState(initialClaims);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredClaims = claims.filter(c =>
        c.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.ref.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = [
        { label: "Accounts Receivable", value: "$45,200", trend: "up", change: "+12%" },
        { label: "Pending Claims", value: 42, trend: "up", change: "+5" },
        { label: "Rejection Rate", value: "3.2%", trend: "down", change: "-0.5%" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-navy flex items-center gap-2">
                        <CreditCard className="w-6 h-6 text-primary" />
                        Insurance Billing & Claims
                    </h2>
                    <p className="text-brand-muted text-xs sm:text-sm mt-0.5">Track insurance-related billing references and claim lifecycle.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="btn-secondary h-10 px-4 flex items-center gap-2 shadow-premium-sm font-black text-xs uppercase tracking-widest">
                        <Download className="w-4 h-4" /> Export Report
                    </button>
                    <button className="btn-primary h-10 px-4 flex items-center gap-2 shadow-premium font-black text-xs uppercase tracking-widest">
                        <Plus className="w-4 h-4" /> New Reimbursement
                    </button>
                </div>
            </div>

            {/* Financial Status Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="admin-card p-6 bg-white flex flex-col items-center text-center group hover:bg-navy transition-all duration-300 shadow-premium-sm">
                        <p className="text-[10px] font-black uppercase text-brand-muted tracking-[0.2em] group-hover:text-white/50">{stat.label}</p>
                        <h4 className="text-3xl font-black text-navy mt-2 group-hover:text-white transition-colors">{stat.value}</h4>
                        <div className={cn(
                            "mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-premium-sm",
                            stat.trend === "up" ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white" : "bg-red-50 text-red-600 group-hover:bg-red-500 group-hover:text-white"
                        )}>
                            {stat.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {stat.change}
                        </div>
                    </div>
                ))}
            </div>

            <div className="admin-card overflow-hidden">
                <div className="p-4 border-b border-brand-border bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                        <input
                            type="text"
                            placeholder="Search by patient, provider, or claim ref..."
                            className="input-base pl-10 h-11 text-xs font-bold uppercase tracking-widest"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                        <button className="btn-secondary h-10 px-4 whitespace-nowrap flex items-center gap-2 shadow-premium-sm">
                            <Filter className="w-4 h-4" />
                            Status Filter
                        </button>
                    </div>
                </div>

                <DataTable
                    headers={["Claim/Ref ID", "Patient & Provider", "Service Date", "Amout Billed", "Amout Approved", "Status", { content: "Actions", className: "text-right" }]}
                >
                    {filteredClaims.map((claim, idx) => (
                        <tr key={idx} className="hover:bg-brand-bg/30 transition-colors group cursor-pointer font-medium">
                            <td>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-navy uppercase tracking-widest leading-none">{claim.id}</span>
                                    <span className="text-[9px] text-brand-muted font-mono mt-1 opacity-70">REF: {claim.ref}</span>
                                </div>
                            </td>
                            <td>
                                <div className="flex flex-col">
                                    <span className="text-xs font-black text-navy leading-none underline decoration-primary/20 hover:decoration-primary cursor-pointer transition-all">{claim.patient}</span>
                                    <div className="flex items-center gap-1 mt-1 opacity-60">
                                        <Building2 className="w-2.5 h-2.5 text-brand-muted" />
                                        <span className="text-[9px] font-black uppercase text-brand-muted">{claim.provider}</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span className="text-[10px] font-black text-brand-muted uppercase bg-brand-bg px-2 py-1 rounded-lg border border-brand-border shadow-premium-sm">{claim.date}</span>
                            </td>
                            <td>
                                <span className="text-sm font-black text-navy">${claim.amt.toLocaleString()}</span>
                            </td>
                            <td>
                                <div className="flex flex-col">
                                    <span className={cn("text-xs font-black", claim.approved > 0 ? "text-emerald-500" : "text-brand-muted opacity-40")}>
                                        ${claim.approved.toLocaleString()}
                                    </span>
                                    {claim.pending > 0 && <span className="text-[8px] font-black uppercase text-orange-500 italic mt-0.5">Pending: ${claim.pending}</span>}
                                </div>
                            </td>
                            <td><StatusBadge status={claim.status} /></td>
                            <td className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); triggerToast("Downloading remittance advice...", "info"); }}
                                        className="p-2 hover:bg-blue-50 rounded-lg transition-all text-brand-muted hover:text-blue-500 group-hover:scale-110"
                                    >
                                        <Download className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 hover:bg-white rounded-lg transition-all border border-transparent hover:border-brand-border text-brand-muted hover:text-navy group-hover:scale-110">
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </DataTable>
            </div>

            {/* Financial Performance Widget */}
            <div className="p-1 bg-gradient-to-r from-navy via-primary to-emerald-500 rounded-[2.5rem] shadow-premium-xl">
                <div className="bg-white rounded-[2.3rem] p-6 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden group">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-premium-sm border border-emerald-100 group-hover:rotate-12 transition-transform">
                                <ArrowUpRight className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-navy leading-none">Yield Optimization</h3>
                                <p className="text-xs font-bold text-brand-muted uppercase tracking-widest mt-1 opacity-70">Efficiency scorecard for this month</p>
                            </div>
                        </div>
                        <div className="flex gap-8">
                            <div>
                                <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest opacity-40">Clean Claims Rate</p>
                                <p className="text-2xl font-black text-emerald-500">92.4%</p>
                            </div>
                            <div className="w-px h-10 bg-brand-border" />
                            <div>
                                <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest opacity-40">Avg. Pay Cycle</p>
                                <p className="text-2xl font-black text-navy">18 Days</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 w-full md:w-auto h-32 relative bg-brand-bg/50 border border-brand-border rounded-[2rem] overflow-hidden flex items-end justify-between px-6 pb-4">
                        {[20, 45, 30, 60, 40, 85, 55, 95, 70, 45, 30, 20].map((h, i) => (
                            <div key={i} className="w-3 rounded-full bg-primary/20 relative group/bar cursor-help" style={{ height: '80%' }}>
                                <div className="absolute bottom-0 left-0 right-0 bg-primary rounded-full transition-all duration-1000 group-hover/bar:bg-emerald-500" style={{ height: h + '%' }} />
                                <div className="absolute opacity-0 group-hover/bar:opacity-100 -top-8 left-1/2 -translate-x-1/2 bg-navy text-white text-[8px] font-black px-1.5 py-1 rounded-lg pointer-events-none transition-all">${(h * 120).toLocaleString()}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillingPage;
