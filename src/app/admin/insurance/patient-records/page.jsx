"use client";

import React, { useState } from "react";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import Modal from "@/components/admin/shared/Modal";
import DataTable from "@/components/admin/shared/DataTable";
import { useToast } from "@/components/admin/shared/ToastProvider";
import {
    Search,
    Filter,
    Plus,
    Users,
    Building2,
    FileCheck,
    Calendar,
    Contact,
    ShieldCheck,
    CreditCard,
    MoreVertical,
    Eye,
    Edit2,
    Trash2,
    Image,
    Upload,
    History,
    Zap,
    AlertCircle
} from "lucide-react";
import { cn } from "@/lib/admin-utils";

const initialRecords = [
    { id: "POL-4001", patient: "Michael Brown", provider: "Blue Cross", plan: "Bronze PPO", memberId: "XYZ-123456", group: "BC-6789", relation: "Self", expiry: "12/2026", status: "Verified", isPrimary: true },
    { id: "POL-4002", patient: "Emma Davis", provider: "Aetna", plan: "Silver HMO", memberId: "AET-998877", group: "GRP-001", relation: "Spouse", expiry: "06/2025", status: "Pending", isPrimary: true },
    { id: "POL-4003", patient: "James Wilson", provider: "Cigna", plan: "Open Access Plus", memberId: "CI-554433", group: "CIG-999", relation: "Parent", expiry: "01/2024", status: "Expired", isPrimary: true },
    { id: "POL-4004", patient: "Michael Brown", provider: "Aetna", plan: "Medicare", memberId: "MC-123", group: "MED-001", relation: "Self", expiry: "Indefinite", status: "Verified", isPrimary: false },
];

const PatientInsuranceRecordsPage = () => {
    const { triggerToast } = useToast();
    const [records, setRecords] = useState(initialRecords);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const filteredRecords = records.filter(r =>
        r.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.memberId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.provider.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleVerifyNow = (id) => {
        triggerToast("Initiating real-time Verification for policy " + id, "info");
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-navy flex items-center gap-2">
                        <Users className="w-6 h-6 text-primary" />
                        Patient Insurance Records
                    </h2>
                    <p className="text-brand-muted text-xs sm:text-sm mt-0.5">Manage and verify insurance policies linked to specific patient profiles.</p>
                </div>
                <button
                    className="btn-primary flex items-center gap-2 h-10 px-4"
                    onClick={() => setIsAddModalOpen(true)}
                >
                    <Plus className="w-4 h-4" /> Link New Policy
                </button>
            </div>

            {/* Verification Statistics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Pending Verification", count: records.filter(r => r.status === 'Pending').length, icon: History, color: "orange" },
                    { label: "Expired Policies", count: records.filter(r => r.status === 'Expired').length, icon: AlertCircle, color: "red" },
                    { label: "Primary Coverages", count: records.filter(r => r.isPrimary).length, icon: ShieldCheck, color: "blue" },
                ].map((stat, idx) => (
                    <div key={idx} className="admin-card p-5 border-l-4 border-l-brand-border hover:border-l-primary/50 transition-all flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase text-brand-muted tracking-widest">{stat.label}</p>
                            <h4 className="text-2xl font-black text-navy leading-none">{stat.count}</h4>
                        </div>
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-brand-bg border border-brand-border")}>
                            <stat.icon className={cn("w-5 h-5", stat.color === "orange" ? "text-orange-500" : stat.color === "red" ? "text-red-500" : "text-blue-500")} />
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
                            placeholder="Search by patient, ID or provider..."
                            className="input-base pl-10 h-10 text-sm font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                        <button className="btn-secondary h-10 px-4 whitespace-nowrap flex items-center gap-2 group">
                            <Filter className="w-4 h-4 group-hover:text-primary transition-colors" />
                            Advanced Filter
                        </button>
                    </div>
                </div>

                <DataTable
                    headers={["Patient & Member ID", "Insurance Context", "Policy Details", "Status", { content: "Actions", className: "text-right" }]}
                >
                    {filteredRecords.map((rec, idx) => (
                        <tr key={idx} className="hover:bg-brand-bg/30 transition-colors group">
                            <td>
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-brand-bg border border-brand-border flex items-center justify-center font-black text-xs text-primary group-hover:bg-primary group-hover:text-white transition-all uppercase shadow-premium-sm">
                                        {rec.patient.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black text-navy leading-none">{rec.patient}</span>
                                        <span className="text-[10px] text-brand-muted font-mono tracking-tighter mt-1">{rec.memberId}</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="flex flex-col">
                                    <span className="text-xs font-black text-charcoal">{rec.provider}</span>
                                    <span className="text-[10px] text-brand-muted font-bold tracking-tighter opacity-80">{rec.plan}</span>
                                </div>
                            </td>
                            <td>
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col items-center">
                                        <span className="text-[10px] font-black text-brand-muted leading-tight uppercase opacity-50">Expiry</span>
                                        <span className="text-xs font-bold text-navy leading-tight">{rec.expiry}</span>
                                    </div>
                                    <div className="w-px h-6 bg-brand-border mx-1" />
                                    {rec.isPrimary && (
                                        <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded text-[9px] font-black uppercase tracking-widest leading-none">Primary</span>
                                    )}
                                </div>
                            </td>
                            <td><StatusBadge status={rec.status} /></td>
                            <td className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                    <button
                                        title="Verify Now"
                                        onClick={() => handleVerifyNow(rec.id)}
                                        className="p-2 hover:bg-emerald-50 rounded-lg transition-colors text-brand-muted hover:text-emerald-500"
                                    >
                                        <FileCheck className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 hover:bg-brand-bg rounded-lg transition-colors text-brand-muted hover:text-navy">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 hover:bg-brand-bg rounded-lg transition-colors text-brand-muted hover:text-primary">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </DataTable>
            </div>

            {/* Add Policy Record Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Link Patient Insurance Policy"
                maxWidth="max-w-3xl"
            >
                <div className="space-y-8">
                    {/* Search Patient Context */}
                    <div className="relative">
                        <div className="p-4 bg-brand-bg border border-brand-border rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-brand-border shadow-premium-sm">
                                    <Search className="w-5 h-5 text-brand-muted" />
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest pl-1">Search Context</p>
                                    <input type="text" placeholder="Start typing patient name..." className="bg-transparent border-none focus:ring-0 text-navy font-black text-lg p-0 h-auto" />
                                </div>
                            </div>
                            <button className="btn-secondary px-4 py-2 text-xs font-black uppercase tracking-widest bg-white">Select</button>
                        </div>
                        <div className="absolute right-4 -bottom-3 px-2 py-0.5 bg-primary text-white text-[9px] font-black uppercase rounded shadow-premium">Required Step</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-navy uppercase tracking-widest flex items-center gap-2 pl-1 italic">
                                <Building2 className="w-3.5 h-3.5 text-primary" />
                                Policy details
                            </h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest pl-1">Provider</label>
                                        <select className="input-base text-xs font-bold leading-none h-11">
                                            <option>Select Provider...</option>
                                            <option>Blue Cross</option>
                                            <option>Aetna</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest pl-1">Target Plan</label>
                                        <select className="input-base text-xs font-bold leading-none h-11">
                                            <option>Select Plan...</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest pl-1">Member ID</label>
                                    <input type="text" className="input-base text-sm font-bold h-11" placeholder="e.g. ABC-123456789" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest pl-1">Group No.</label>
                                        <input type="text" className="input-base text-sm font-bold h-11" placeholder="Optional" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest pl-1">Expiration</label>
                                        <input type="month" className="input-base text-sm font-bold h-11" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-navy uppercase tracking-widest flex items-center gap-2 pl-1 italic">
                                <Zap className="w-3.5 h-3.5 text-emerald-500" />
                                Compliance & Media
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 p-3 bg-brand-bg rounded-xl border border-brand-border/40">
                                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-brand-border text-primary shadow-premium-sm">
                                        <ShieldCheck className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-black text-navy uppercase leading-none">Primary Insurance</p>
                                        <p className="text-[9px] text-brand-muted font-bold mt-1 opacity-60">Bill this provider first for all claims.</p>
                                    </div>
                                    <input type="checkbox" className="w-5 h-5 rounded-md border-brand-border text-primary focus:ring-primary h-4 w-4" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest pl-1">Insurance Card (Front)</label>
                                    <div className="border-2 border-dashed border-brand-border rounded-2xl p-6 flex flex-col items-center justify-center bg-white hover:border-primary/30 transition-all cursor-pointer group/upload">
                                        <Upload className="w-6 h-6 text-brand-muted group-hover/upload:text-primary mb-2 transition-colors" />
                                        <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest group-hover/upload:text-navy">Upload JPEG/PDF</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 pt-6 border-t border-brand-border">
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="verifyAuto" className="w-4 h-4 rounded border-brand-border text-primary" />
                            <label htmlFor="verifyAuto" className="text-[10px] font-black text-brand-muted uppercase tracking-tighter cursor-pointer">Verify coverage automatically after saving</label>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="btn-secondary py-3 px-6 text-xs font-black uppercase tracking-widest" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                            <button className="btn-primary py-3 px-8 text-xs font-black uppercase tracking-widest shadow-premium" onClick={() => { setIsAddModalOpen(false); triggerToast("Record successfully synced with patient profile", "success"); }}>Commence Mapping</button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default PatientInsuranceRecordsPage;
