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
    FileText,
    Building2,
    DollarSign,
    ShieldCheck,
    Lock,
    Unlock,
    MoreVertical,
    Edit3,
    Trash2,
    ChevronDown,
    Zap,
    Briefcase
} from "lucide-react";
import { cn } from "@/lib/admin-utils";

const initialPlans = [
    { id: "PLN-101", name: "Bronze PPO", code: "PPOBRZ", provider: "Blue Cross", type: "PPO", copay: "$40", auth: true, referral: false, status: "Active", enrolled: 245 },
    { id: "PLN-102", name: "Silver HMO", code: "HMOSLV", provider: "Blue Cross", type: "HMO", copay: "$25", auth: false, referral: true, status: "Active", enrolled: 180 },
    { id: "PLN-103", name: "Gold Advantage", code: "GOLDADV", provider: "Aetna", type: "POS", copay: "$15", auth: true, referral: true, status: "Active", enrolled: 420 },
    { id: "PLN-104", name: "Open Access Plus", code: "OAPLUS", provider: "Cigna", type: "OAP", copay: "$30", auth: false, referral: false, status: "Active", enrolled: 312 },
    { id: "PLN-105", name: "Standard HMO", code: "UHCHMO", provider: "UnitedHealthcare", type: "HMO", copay: "$20", auth: true, referral: true, status: "Inactive", enrolled: 0 },
];

const PlansPage = () => {
    const { triggerToast } = useToast();
    const [plans, setPlans] = useState(initialPlans);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);

    const filteredPlans = plans.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.provider.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this plan? This will remove related coverage rules.")) {
            setPlans(plans.filter(p => p.id !== id));
            triggerToast("Insurance plan archived", "success");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-navy flex items-center gap-2">
                        <FileText className="w-6 h-6 text-primary" />
                        Insurance Plans
                    </h2>
                    <p className="text-brand-muted text-xs sm:text-sm mt-0.5">Manage specific sub-plans and benefit structures.</p>
                </div>
                <button
                    className="btn-primary flex items-center gap-2 h-10 px-4"
                    onClick={() => { setEditingPlan(null); setIsModalOpen(true); }}
                >
                    <Plus className="w-4 h-4" /> Add New Plan
                </button>
            </div>

            {/* Quick Summary Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "Active Plans", value: plans.filter(p => p.status === 'Active').length, icon: Zap, color: "text-emerald-500" },
                    { label: "Providers represented", value: [...new Set(plans.map(p => p.provider))].length, icon: Building2, color: "text-blue-500" },
                    { label: "Total Enrollments", value: plans.reduce((acc, p) => acc + p.enrolled, 0).toLocaleString(), icon: Briefcase, color: "text-purple-500" },
                ].map((stat, idx) => (
                    <div key={idx} className="admin-card p-4 transition-all hover:border-primary/20 group cursor-default">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-brand-bg flex items-center justify-center border border-brand-border shrink-0">
                                <stat.icon className={cn("w-5 h-5", stat.color)} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-bold text-brand-muted tracking-widest">{stat.label}</span>
                                <span className="text-xl font-black text-navy leading-none mt-1">{stat.value}</span>
                            </div>
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
                            placeholder="Search by plan name, code or provider..."
                            className="input-base pl-10 h-10 text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <select className="input-base h-10 text-xs sm:text-sm w-full sm:w-40">
                            <option>All Providers</option>
                            <option>Blue Cross</option>
                            <option>Aetna</option>
                            <option>Cigna</option>
                        </select>
                        <button className="btn-secondary h-10 px-3 shrink-0">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <DataTable
                    headers={["Plan Details", "Provider", "Type", "Pre-Auth/Ref", "Copay", "Status", { content: "Actions", className: "text-right" }]}
                >
                    {filteredPlans.map((pl, idx) => (
                        <tr key={idx} className="hover:bg-brand-bg/30 transition-colors group cursor-pointer">
                            <td>
                                <div className="flex flex-col min-w-[150px]">
                                    <span className="text-sm font-bold text-navy">{pl.name}</span>
                                    <span className="text-[10px] text-brand-muted font-mono uppercase font-black tracking-widest mt-1">{pl.code}</span>
                                </div>
                            </td>
                            <td>
                                <div className="flex items-center gap-2 font-medium text-xs text-charcoal">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    {pl.provider}
                                </div>
                            </td>
                            <td>
                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-muted bg-brand-bg border border-brand-border px-1.5 py-0.5 rounded-lg">{pl.type}</span>
                            </td>
                            <td>
                                <div className="flex items-center gap-1.5">
                                    <div
                                        className={cn("p-1 rounded-md border", pl.auth ? "bg-orange-50 text-orange-600 border-orange-100" : "bg-brand-bg text-brand-muted border-brand-border/40")}
                                        title={pl.auth ? "Pre-Authorization Required" : "No Pre-Auth Required"}
                                    >
                                        <Lock className="w-3.5 h-3.5" />
                                    </div>
                                    <div
                                        className={cn("p-1 rounded-md border", pl.referral ? "bg-purple-50 text-purple-600 border-purple-100" : "bg-brand-bg text-brand-muted border-brand-border/40")}
                                        title={pl.referral ? "Referral Required" : "No Referral Required"}
                                    >
                                        <Building2 className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                            </td>
                            <td><span className="text-sm font-bold text-navy">{pl.copay}</span></td>
                            <td><StatusBadge status={pl.status} /></td>
                            <td className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                    <button className="p-2 hover:bg-brand-bg rounded-lg transition-colors text-brand-muted hover:text-navy">
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(pl.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors text-brand-muted hover:text-red-500">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </DataTable>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingPlan ? "Edit Insurance Plan" : "Create New Insurance Plan"}
                maxWidth="max-w-2xl"
            >
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 sm:gap-6">
                        <div className="col-span-2 sm:col-span-1 space-y-2">
                            <label className="text-xs font-bold text-navy uppercase tracking-widest">Provider Parent</label>
                            <select className="input-base">
                                <option>Select Provider...</option>
                                <option>Blue Cross Blue Shield</option>
                                <option>Aetna</option>
                                <option>Cigna</option>
                            </select>
                        </div>
                        <div className="col-span-2 sm:col-span-1 space-y-2">
                            <label className="text-xs font-bold text-navy uppercase tracking-widest">Plan Display Name</label>
                            <input type="text" className="input-base" placeholder="e.g. Choice Silver HMO" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-navy uppercase tracking-widest">Internal Plan Code</label>
                            <input type="text" className="input-base" placeholder="e.g. SLV-HMO-01" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-navy uppercase tracking-widest">Plan Type</label>
                            <input type="text" className="input-base" placeholder="e.g. PPO, HMO, EPO" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-navy uppercase tracking-widest">Fixed Copay ($)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                                <input type="number" className="input-base pl-10" placeholder="0.00" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                            { label: "Pre-Authorization Required", desc: "Require staff to obtain auth before treatment.", icon: Lock },
                            { label: "Referral Required", desc: "Require a referral from primary physician.", icon: Building2 },
                        ].map((rule, idx) => (
                            <div key={idx} className="p-4 bg-brand-bg rounded-xl border border-brand-border/40 hover:border-primary/20 transition-all flex items-start gap-4">
                                <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center border border-brand-border shrink-0">
                                    <rule.icon className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-navy leading-none mb-1">{rule.label}</p>
                                    <p className="text-[9px] text-brand-muted leading-relaxed line-clamp-2">{rule.desc}</p>
                                </div>
                                <input type="checkbox" className="w-5 h-5 rounded-md mt-1 border-brand-border text-primary focus:ring-primary h-4 w-4" />
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-brand-border">
                        <button className="flex-1 btn-secondary py-3 text-xs font-bold" onClick={() => setIsModalOpen(false)}>Discard</button>
                        <button className="flex-2 btn-primary py-3 text-xs font-bold" onClick={() => { setIsModalOpen(false); triggerToast("Insurance plan created", "success") }}>Create Plan Interface</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default PlansPage;
