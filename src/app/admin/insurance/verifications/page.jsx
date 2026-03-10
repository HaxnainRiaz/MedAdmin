"use client";

import React, { useState } from "react";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import Modal from "@/components/admin/shared/Modal";
import DataTable from "@/components/admin/shared/DataTable";
import { useToast } from "@/components/admin/shared/ToastProvider";
import {
    Search,
    Filter,
    FileCheck,
    Clock,
    User,
    Calendar,
    ArrowUpRight,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ChevronRight,
    Play,
    History,
    MoreVertical,
    Building2,
    ShieldCheck,
    Zap,
    Lock,
    Unlock,
    HelpCircle,
    Eye
} from "lucide-react";
import { cn } from "@/lib/admin-utils";

const initialQueue = [
    { id: "VER-201", patient: "Michael Brown", provider: "Blue Cross", appointmentDate: "Mar 12, 2026", type: "Pre-Auth", status: "Pending", requested: "2h ago", assigned: "Sarah J." },
    { id: "VER-202", patient: "Emma Davis", provider: "Aetna", appointmentDate: "Mar 12, 2026", type: "New Policy", status: "In Review", requested: "4h ago", assigned: "Admin" },
    { id: "VER-203", patient: "James Wilson", provider: "Cigna", appointmentDate: "Mar 13, 2026", type: "Annual Review", status: "Verified", requested: "Yesterday", assigned: "Sarah J." },
    { id: "VER-204", patient: "Sarah Miller", provider: "UnitedHealthcare", appointmentDate: "Mar 11, 2026", type: "Pre-Auth", status: "Rejected", requested: "Yesterday", assigned: "Unassigned" },
    { id: "VER-205", patient: "David Smith", provider: "Blue Cross", appointmentDate: "Mar 15, 2026", type: "New Policy", status: "Pending", requested: "24h ago", assigned: "Unassigned" },
];

const VerificationsPage = () => {
    const { triggerToast } = useToast();
    const [queue, setQueue] = useState(initialQueue);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const filteredQueue = queue.filter(r =>
        r.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.provider.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenRequest = (request) => {
        setSelectedRequest(request);
        setIsDetailsOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-navy flex items-center gap-2">
                        <FileCheck className="w-6 h-6 text-primary" />
                        Verification Queue
                    </h2>
                    <p className="text-brand-muted text-xs sm:text-sm mt-0.5">Workflow for confirming insurance coverage ahead of appointments.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="btn-secondary h-10 px-4 flex items-center gap-2 shadow-premium-sm font-black text-xs uppercase tracking-widest">
                        <History className="w-4 h-4" />
                        Full History
                    </button>
                    <button
                        className="btn-primary h-10 px-4 flex items-center gap-2 shadow-premium font-black text-xs uppercase tracking-widest"
                        onClick={() => triggerToast("Assigning next pending task to your session...", "info")}
                    >
                        <Play className="w-4 h-4" />
                        Process Next
                    </button>
                </div>
            </div>

            {/* Quick Filter Bubbles */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                {[
                    { label: "All Requests", count: queue.length, active: true },
                    { label: "Pending", count: queue.filter(r => r.status === "Pending").length, color: "text-orange-500 bg-orange-50" },
                    { label: "High Priority", count: 3, color: "text-red-500 bg-red-50" },
                    { label: "Unassigned", count: queue.filter(r => r.assigned === "Unassigned").length },
                    { label: "Completed Today", count: 12, color: "text-emerald-500 bg-emerald-50" },
                ].map((filter, idx) => (
                    <button
                        key={idx}
                        className={cn(
                            "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-brand-border transition-all flex items-center gap-2 shadow-premium-sm",
                            filter.active ? "bg-navy text-white border-navy" : "bg-white text-brand-muted hover:border-primary/20 hover:text-navy",
                            filter.color
                        )}
                    >
                        {filter.label}
                        <span className="opacity-40">{filter.count}</span>
                    </button>
                ))}
            </div>

            <div className="admin-card overflow-hidden">
                <div className="p-4 border-b border-brand-border bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                        <input
                            type="text"
                            placeholder="Search by patient or provider..."
                            className="input-base pl-10 h-11 text-xs font-bold uppercase tracking-widest"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <DataTable
                    headers={["Patient Context", "Insurace Identity", "Task Info", "Assigned To", "Status", { content: "Actions", className: "text-right" }]}
                >
                    {filteredQueue.map((req, idx) => (
                        <tr key={idx} className="hover:bg-brand-bg/30 transition-colors group cursor-pointer" onClick={() => handleOpenRequest(req)}>
                            <td>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-brand-bg border border-brand-border flex items-center justify-center font-black text-xs text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-premium-sm">
                                        {req.patient[0]}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black text-navy leading-none">{req.patient}</span>
                                        <span className="text-[10px] text-brand-muted font-bold mt-1 uppercase tracking-tighter opacity-70">Appt: {req.appointmentDate}</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="flex flex-col">
                                    <span className="text-xs font-black text-charcoal leading-none">{req.provider}</span>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-brand-muted opacity-60">{req.type}</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-3 h-3 text-brand-muted" />
                                        <span className="text-[10px] font-black text-brand-muted uppercase">{req.requested}</span>
                                    </div>
                                    {idx === 0 && <span className="mt-1 text-[8px] font-black uppercase text-red-500 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded italic shadow-premium-sm">ASAP - Surgery</span>}
                                </div>
                            </td>
                            <td>
                                <span className="text-[10px] font-black text-navy uppercase tracking-widest italic">{req.assigned}</span>
                            </td>
                            <td><StatusBadge status={req.status} /></td>
                            <td className="text-right">
                                <button className="p-2 hover:bg-white rounded-lg transition-all border border-transparent hover:border-brand-border shadow-premium-sm text-brand-muted hover:text-primary">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </DataTable>
            </div>

            {/* Verification Detail Drawer / Modal */}
            <Modal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                title="Review Coverage Details"
                maxWidth="max-w-4xl"
            >
                {selectedRequest && (
                    <div className="space-y-8">
                        <div className="bg-brand-bg rounded-[2.5rem] p-6 border border-brand-border flex flex-col md:flex-row items-center gap-6">
                            <div className="w-20 h-20 rounded-3xl bg-white border border-brand-border flex items-center justify-center font-black text-2xl text-primary shadow-premium">
                                {selectedRequest.patient.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                                    <h3 className="text-2xl font-black text-navy">{selectedRequest.patient}</h3>
                                    <StatusBadge status={selectedRequest.status} />
                                </div>
                                <div className="flex items-center justify-center md:justify-start gap-4 text-xs font-bold text-brand-muted uppercase tracking-widest">
                                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {selectedRequest.appointmentDate}</span>
                                    <span className="w-1 h-1 rounded-full bg-brand-border" />
                                    <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> {selectedRequest.provider}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Assigned Specialist</p>
                                <div className="px-4 py-2 bg-white border border-brand-border rounded-xl font-black text-xs text-navy shadow-premium-sm">{selectedRequest.assigned}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black text-navy uppercase tracking-widest italic flex items-center gap-2 pl-2">
                                        <Zap className="w-4 h-4 text-emerald-500" />
                                        Real-time Eligibility
                                    </h4>
                                    <div className="p-5 bg-navy text-white rounded-[2rem] shadow-premium relative overflow-hidden group">
                                        <div className="relative z-10 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Status Code</span>
                                                <span className="text-xs font-black text-emerald-400">SUCCESS - 200</span>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase opacity-60">Deductible Met</p>
                                                <p className="text-xl font-black">$4,250.00 / $5,000</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10">
                                                <div>
                                                    <p className="text-[9px] font-black uppercase opacity-40">Office Copay</p>
                                                    <p className="text-sm font-black">$25.00</p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black uppercase opacity-40">Coinsurance</p>
                                                    <p className="text-sm font-black">20%</p>
                                                </div>
                                            </div>
                                        </div>
                                        <ShieldCheck className="absolute -bottom-6 -right-6 w-24 h-24 text-white opacity-[0.05] group-hover:scale-110 transition-transform" />
                                    </div>
                                </div>

                                <div className="space-y-4 pt-2">
                                    <h4 className="text-xs font-black text-navy uppercase tracking-widest italic flex items-center gap-2 pl-2">
                                        <Clock className="w-4 h-4 text-orange-500" />
                                        Verification Notes
                                    </h4>
                                    <textarea className="input-base min-h-[120px] text-xs font-bold leading-relaxed shadow-premium-sm" placeholder="Add internal notes for billing/front-desk team..." defaultValue="Plan is active. Telehealth specifically excluded from this sub-plan. Patient prefers video calls - need to notify them regarding OOP costs."></textarea>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black text-navy uppercase tracking-widest italic flex items-center gap-2 pl-2">
                                        <CreditCard className="w-4 h-4 text-primary" />
                                        Verification Method
                                    </h4>
                                    <div className="grid grid-cols-1 gap-3">
                                        {[
                                            { label: "Phone Verification", sub: "Manual call to provider center", icon: Building2 },
                                            { label: "Payer Portal", sub: "Verified via insurer admin site", icon: Globe },
                                            { label: "Clearinghouse", sub: "Electronic 270/271 sync", icon: Zap },
                                        ].map((method, idx) => (
                                            <button key={idx} className="flex items-center gap-4 p-4 border border-brand-border rounded-2xl bg-white hover:border-primary/20 hover:bg-brand-bg transition-all group/opt">
                                                <div className="w-10 h-10 rounded-xl bg-brand-bg flex items-center justify-center border border-brand-border group-hover/opt:border-primary/20 group-hover/opt:text-primary transition-all shadow-premium-sm">
                                                    <method.icon className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 text-left min-w-0">
                                                    <p className="text-xs font-black text-navy uppercase leading-none mb-1">{method.label}</p>
                                                    <p className="text-[9px] font-bold text-brand-muted opacity-60 italic">{method.sub}</p>
                                                </div>
                                                <div className="w-5 h-5 rounded-full border-2 border-brand-border group-hover/opt:border-primary group-hover/opt:bg-primary transition-all" />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-5 bg-orange-50/50 border border-orange-100 rounded-[2rem] space-y-4">
                                    <div className="flex items-center gap-3">
                                        <HelpCircle className="w-5 h-5 text-orange-500" />
                                        <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Self-Pay Alternative</p>
                                    </div>
                                    <p className="text-[10px] font-bold text-brand-muted leading-relaxed">
                                        If coverage cannot be verified, the system will automatically default this appointment to **Self-Pay (Uninsured)** status.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-6 border-t border-brand-border">
                            <button className="flex-1 btn-secondary py-3.5 text-xs font-black uppercase tracking-widest" onClick={() => setIsDetailsOpen(false)}>Save for Later</button>
                            <button
                                className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-100 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-100 transition-all shadow-premium-sm"
                                onClick={() => { setIsDetailsOpen(false); triggerToast("Coverage verification rejected", "error"); }}
                            >
                                <XCircle className="w-4 h-4" /> Reject Request
                            </button>
                            <button
                                className="flex-2 btn-primary py-3.5 text-xs font-black uppercase tracking-widest shadow-premium flex items-center justify-center gap-2"
                                onClick={() => { setIsDetailsOpen(false); triggerToast("Patient coverage confirmed successfully", "success"); }}
                            >
                                <CheckCircle2 className="w-4 h-4" /> Mark Verified
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default VerificationsPage;
