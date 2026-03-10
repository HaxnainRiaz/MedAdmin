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
    Building2,
    Globe,
    Phone,
    Mail,
    MoreVertical,
    Edit2,
    Trash2,
    Star,
    ExternalLink,
    Zap
} from "lucide-react";
import { cn } from "@/lib/admin-utils";

const initialProviders = [
    { id: "IP-001", name: "Blue Cross Blue Shield", code: "BCBS", payerId: "80811", website: "https://www.bcbs.com", phone: "+1 (800) 262-2583", status: "Active", isFeatured: true, plans: 12 },
    { id: "IP-002", name: "Aetna", code: "AET", payerId: "60054", website: "https://www.aetna.com", phone: "+1 (800) 872-3862", status: "Active", isFeatured: true, plans: 8 },
    { id: "IP-003", name: "Cigna", code: "CI", payerId: "62308", website: "https://www.cigna.com", phone: "+1 (800) 997-1654", status: "Active", isFeatured: false, plans: 15 },
    { id: "IP-004", name: "UnitedHealthcare", code: "UHC", payerId: "87726", website: "https://www.uhc.com", phone: "+1 (866) 633-2446", status: "Inactive", isFeatured: false, plans: 6 },
];

const ProvidersPage = () => {
    const { triggerToast } = useToast();
    const [providers, setProviders] = useState(initialProviders);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProvider, setEditingProvider] = useState(null);

    const filteredProviders = providers.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleToggleFeatured = (id) => {
        setProviders(providers.map(p => p.id === id ? { ...p, isFeatured: !p.isFeatured } : p));
        triggerToast("Provider prominence updated", "success");
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this provider? This may affect linked plans and rules.")) {
            setProviders(providers.filter(p => p.id !== id));
            triggerToast("Provider archived successfully", "success");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-navy flex items-center gap-2">
                        <Building2 className="w-6 h-6 text-primary" />
                        Insurance Providers
                    </h2>
                    <p className="text-brand-muted text-xs sm:text-sm">Manage insurance companies accepted by the clinic.</p>
                </div>
                <button
                    className="btn-primary flex items-center gap-2 h-10 px-4"
                    onClick={() => { setEditingProvider(null); setIsModalOpen(true); }}
                >
                    <Plus className="w-4 h-4" /> Add Provider
                </button>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Providers", value: providers.length, icon: Building2, color: "text-blue-500" },
                    { label: "Active", value: providers.filter(p => p.status === 'Active').length, icon: Zap, color: "text-emerald-500" },
                    { label: "Featured", value: providers.filter(p => p.isFeatured).length, icon: Star, color: "text-orange-500" },
                    { label: "Total Plans", value: providers.reduce((acc, p) => acc + p.plans, 0), icon: Globe, color: "text-purple-500" },
                ].map((stat, idx) => (
                    <div key={idx} className="admin-card p-4 transition-all hover:border-primary/30 group">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest leading-none">{stat.label}</span>
                            <stat.icon className={cn("w-4 h-4", stat.color)} />
                        </div>
                        <span className="text-xl font-bold text-navy leading-none">{stat.value}</span>
                    </div>
                ))}
            </div>

            {/* List Section */}
            <div className="admin-card overflow-hidden">
                <div className="p-4 border-b border-brand-border bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                        <input
                            type="text"
                            placeholder="Search by name, code or payer ID..."
                            className="input-base pl-10 h-10 text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                        <select className="input-base h-10 text-xs sm:text-sm w-36">
                            <option>All Status</option>
                            <option>Active</option>
                            <option>Inactive</option>
                        </select>
                        <button className="btn-secondary h-10 px-3">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <DataTable
                    headers={["Provider Name", "Payer ID", "Plans", "Status", "Featured", { content: "Actions", className: "text-right" }]}
                >
                    {filteredProviders.map((p, idx) => (
                        <tr key={idx} className="hover:bg-brand-bg/30 transition-colors group">
                            <td>
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-brand-bg border border-brand-border rounded-xl flex items-center justify-center font-bold text-xs text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                                        {p.code}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm font-bold text-navy truncate">{p.name}</span>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <Globe className="w-3 h-3 text-brand-muted" />
                                            <span className="text-[10px] text-brand-muted truncate max-w-[150px]">{p.website.replace('https://www.', '')}</span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td><span className="text-xs font-mono font-bold text-charcoal">{p.payerId}</span></td>
                            <td><span className="text-xs font-bold text-navy bg-primary/5 px-2 py-0.5 rounded-lg">{p.plans} Plans</span></td>
                            <td><StatusBadge status={p.status} /></td>
                            <td>
                                <button
                                    onClick={() => handleToggleFeatured(p.id)}
                                    className={cn(
                                        "p-2 rounded-lg transition-all",
                                        p.isFeatured ? "text-orange-500 bg-orange-50" : "text-brand-muted hover:text-navy hover:bg-brand-bg"
                                    )}
                                    title={p.isFeatured ? "Featured on Website" : "Mark as Featured"}
                                >
                                    <Star className={cn("w-4 h-4", p.isFeatured && "fill-current")} />
                                </button>
                            </td>
                            <td className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                    <button className="p-2 hover:bg-brand-bg rounded-lg transition-colors text-brand-muted hover:text-primary">
                                        <ExternalLink className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 hover:bg-brand-bg rounded-lg transition-colors text-brand-muted hover:text-navy">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(p.id)}
                                        className="p-2 hover:bg-red-50 rounded-lg transition-colors text-brand-muted hover:text-red-500"
                                    >
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
                title={editingProvider ? "Edit Insurance Provider" : "Add Insurance Provider"}
                maxWidth="max-w-xl"
            >
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 space-y-2">
                            <label className="text-xs font-bold text-navy uppercase">Provider Name</label>
                            <input type="text" className="input-base" placeholder="e.g. Blue Cross Blue Shield" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-navy uppercase">Internal Code</label>
                            <input type="text" className="input-base" placeholder="e.g. BCBS" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-navy uppercase">Payer ID</label>
                            <input type="text" className="input-base" placeholder="e.g. 12345" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-navy uppercase">Contact Phone</label>
                            <input type="text" className="input-base" placeholder="+1 (800) 000-0000" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-navy uppercase">Website URL</label>
                            <input type="text" className="input-base" placeholder="https://..." />
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-brand-bg rounded-xl border border-brand-border/50">
                        <div className="flex-1">
                            <p className="text-xs font-bold text-navy">Featured Provider</p>
                            <p className="text-[10px] text-brand-muted">Display this insurance logo prominently on the website footer/content.</p>
                        </div>
                        <button className="w-12 h-6 bg-brand-border rounded-full relative">
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all"></div>
                        </button>
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                        <button className="flex-1 btn-secondary py-2.5" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        <button className="flex-1 btn-primary py-2.5" onClick={() => { setIsModalOpen(false); triggerToast("New provider registered", "success"); }}>Save Provider</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ProvidersPage;
