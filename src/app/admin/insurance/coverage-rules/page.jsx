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
    BookCheck,
    Building2,
    Stethoscope,
    BriefcaseMedical,
    MapPin,
    ArrowRight,
    CheckCircle2,
    MoreVertical,
    X,
    Calendar,
    Settings,
    Edit3,
    Trash2,
    Globe,
    Zap,
    Users
} from "lucide-react";
import { cn } from "@/lib/admin-utils";

const initialRules = [
    { id: "RUL-001", provider: "Blue Cross", plan: "Bronze PPO", scope: "Clinic Level", locations: ["Northside", "Downtown"], status: "Active", updated: "2 days ago" },
    { id: "RUL-002", provider: "Aetna", plan: "Silver HMO", scope: "Service Specific", locations: ["Southside"], status: "Active", updated: "5 days ago" },
    { id: "RUL-003", provider: "Cigna", plan: "Open Access Plus", scope: "Doctor Specific", locations: ["All Branches"], status: "Inactive", updated: "1 week ago" },
];

const CoverageRulesPage = () => {
    const { triggerToast } = useToast();
    const [rules, setRules] = useState(initialRules);
    const [isBuilderOpen, setIsBuilderOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredRules = rules.filter(r =>
        r.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.plan.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = (id) => {
        if (confirm("Deactivate this coverage rule? This will stop accepting this plan at the specified locations.")) {
            setRules(rules.filter(r => r.id !== id));
            triggerToast("Rule deactivated successfully", "success");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-navy flex items-center gap-2">
                        <BookCheck className="w-6 h-6 text-primary" />
                        Coverage Rules
                    </h2>
                    <p className="text-brand-muted text-xs sm:text-sm mt-0.5">Define where and how specific insurance plans are accepted.</p>
                </div>
                <button
                    className="btn-primary flex items-center gap-2 h-10 px-4"
                    onClick={() => setIsBuilderOpen(true)}
                >
                    <Plus className="w-4 h-4" /> Create Coverage Rule
                </button>
            </div>

            <div className="admin-card overflow-hidden">
                <div className="p-4 border-b border-brand-border bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                        <input
                            type="text"
                            placeholder="Search by provider or plan..."
                            className="input-base pl-10 h-10 text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <DataTable
                    headers={["Provider & Plan", "Coverage Scope", "Accepted Locations", "Status", "Last Updated", { content: "Actions", className: "text-right" }]}
                >
                    {filteredRules.map((rule, idx) => (
                        <tr key={idx} className="hover:bg-brand-bg/30 transition-colors group">
                            <td>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-navy">{rule.provider}</span>
                                    <span className="text-[10px] text-brand-muted font-bold mt-0.5">{rule.plan}</span>
                                </div>
                            </td>
                            <td>
                                <span className={cn(
                                    "px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                                    rule.scope === "Clinic Level" ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-purple-50 text-purple-600 border-purple-100"
                                )}>
                                    {rule.scope}
                                </span>
                            </td>
                            <td>
                                <div className="flex flex-wrap gap-1 max-w-[180px]">
                                    {rule.locations.map((loc, i) => (
                                        <span key={i} className="px-1.5 py-0.5 bg-brand-bg rounded-[4px] border border-brand-border text-[9px] font-black text-brand-muted uppercase tracking-tighter shadow-premium-sm">{loc}</span>
                                    ))}
                                </div>
                            </td>
                            <td><StatusBadge status={rule.status} /></td>
                            <td><span className="text-[10px] text-brand-muted font-bold uppercase">{rule.updated}</span></td>
                            <td className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                    <button className="p-2 hover:bg-brand-bg rounded-lg transition-colors text-brand-muted hover:text-navy">
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(rule.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors text-brand-muted hover:text-red-500">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </DataTable>
            </div>

            {/* Coverage Rule Builder Modal */}
            <Modal
                isOpen={isBuilderOpen}
                onClose={() => setIsBuilderOpen(false)}
                title="Coverage Rule Builder"
                maxWidth="max-w-4xl"
            >
                <div className="space-y-8">
                    {/* Step 1: Provider & Plan */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        <div className="space-y-4">
                            <h3 className="text-sm font-black text-navy uppercase tracking-widest flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-primary" />
                                01. Context Selection
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest pl-1">Insurance Provider</label>
                                    <select className="input-base h-11 text-xs">
                                        <option>Select Provider...</option>
                                        <option>Blue Cross Blue Shield</option>
                                        <option>Aetna</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest pl-1">Target Plan</label>
                                    <select className="input-base h-11 text-xs">
                                        <option>Common to all Plans</option>
                                        <option>Bronze PPO</option>
                                        <option>Silver HMO</option>
                                    </select>
                                </div>
                                <div className="p-3 bg-brand-bg/50 border border-brand-border rounded-xl">
                                    <p className="text-[10px] text-brand-muted leading-relaxed font-bold">
                                        Rule updates might take up to 10 minutes to reflect in the provider's API syncs if using automated verifications.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Step 2: Mapping Scope */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-black text-navy uppercase tracking-widest flex items-center gap-2">
                                <Globe className="w-4 h-4 text-emerald-500" />
                                02. Coverage Scope
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: "Whole Clinic", icon: Building2, desc: "Accepted everywhere" },
                                    { label: "Specific Branch", icon: MapPin, desc: "Select locations" },
                                    { label: "By Doctor", icon: Stethoscope, desc: "Based on staff" },
                                    { label: "By Service", icon: BriefcaseMedical, desc: "Treatment types" },
                                ].map((type, idx) => (
                                    <button
                                        key={idx}
                                        className="flex flex-col items-center gap-3 p-4 border border-brand-border rounded-2xl hover:border-primary/50 hover:bg-brand-bg transition-all group/opt"
                                    >
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-brand-border group-hover/opt:border-primary/20 group-hover/opt:text-primary transition-all">
                                            <type.icon className="w-5 h-5" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[11px] font-black text-navy uppercase tracking-tighter leading-none mb-1">{type.label}</p>
                                            <p className="text-[9px] text-brand-muted leading-tight">{type.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Mapping Interface Area (Conditional) */}
                    <div className="p-6 bg-brand-bg border border-brand-border border-dashed rounded-[2.5rem] space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-brand-border shadow-premium-sm">
                                    <MapPin className="w-4 h-4 text-emerald-500" />
                                </div>
                                <h4 className="text-xs font-black text-navy uppercase tracking-widest">Available Mappings (Locations)</h4>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest bg-white px-3 py-1.5 rounded-lg border border-brand-border shadow-premium-sm">Select All</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {["Northside Main Branch", "Southside Satellite", "Downtown Surgery Center", "East End Clinic", "Healthcare West", "Central Admin Office"].map((loc, idx) => (
                                <label key={idx} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-brand-border shadow-premium-sm hover:border-primary/30 transition-all group/check cursor-pointer">
                                    <input type="checkbox" className="w-5 h-5 rounded-md border-brand-border text-primary focus:ring-primary h-4 w-4 shrink-0" />
                                    <span className="text-[11px] font-bold text-navy truncate flex-1">{loc}</span>
                                    <MapPin className="w-3.5 h-3.5 text-brand-muted group-hover/check:text-emerald-500 transition-colors" />
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-6 border-t border-brand-border">
                        <button className="flex-1 btn-secondary py-3.5 text-xs font-black uppercase tracking-widest" onClick={() => setIsBuilderOpen(false)}>Cancel Session</button>
                        <button className="flex-2 btn-primary py-3.5 text-xs font-black uppercase tracking-widest shadow-premium" onClick={() => { setIsBuilderOpen(false); triggerToast("Coverage rules applied for Bronze PPO", "success") }}>Apply Coverage Matrix</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default CoverageRulesPage;
