"use client";

import React, { useState } from "react";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import DataTable from "@/components/admin/shared/DataTable";
import {
    Search,
    Filter,
    Download,
    Mail,
    Calendar,
    CheckCircle2,
    Ban,
    UserMinus,
    ExternalLink,
    MoreHorizontal,
    TrendingUp,
    Users,
    Trash2
} from "lucide-react";
import { cn } from "@/lib/admin-utils";

const initialSubscribers = [
    { id: "SUB-001", email: "alice.smith@example.com", source: "Footer CTA", date: "2024-03-24", status: "Active" },
    { id: "SUB-002", email: "bob.jones@example.com", source: "Homepage Popup", date: "2024-03-24", status: "Active" },
    { id: "SUB-003", email: "carol.williams@example.com", source: "Blog Post", date: "2024-03-23", status: "Unsubscribed" },
    { id: "SUB-004", email: "dave.brown@example.com", source: "Registration Form", date: "2024-03-22", status: "Active" },
    { id: "SUB-005", email: "eva.davis@example.com", source: "Footer CTA", date: "2024-03-21", status: "Active" },
];

const SubscribersPage = () => {
    const [subscribers, setSubscribers] = useState(initialSubscribers);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    // Advanced Filters
    const [filters, setFilters] = useState({
        source: "All",
        status: "All"
    });
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const triggerToast = () => {
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
    };

    const sources = ["All", ...Array.from(new Set(initialSubscribers.map(s => s.source)))];

    const filteredSubscribers = subscribers.filter(s => {
        const matchesSource = filters.source === "All" || s.source === filters.source;
        const matchesStatus = filters.status === "All" || s.status === filters.status;
        const matchesSearch = s.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSource && matchesStatus && matchesSearch;
    });

    const handleUnsubscribe = (id) => {
        if (confirm("Mark this user as unsubscribed?")) {
            setSubscribers(subscribers.map(s => s.id === id ? { ...s, status: "Unsubscribed" } : s));
            triggerToast();
        }
    };

    const toggleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(filteredSubscribers.map(s => s.id));
        } else {
            setSelectedIds([]);
        }
    };

    const toggleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(selId => selId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleBulkUnsubscribe = () => {
        setSubscribers(subscribers.map(s =>
            selectedIds.includes(s.id) ? { ...s, status: "Unsubscribed" } : s
        ));
        setSelectedIds([]);
        triggerToast();
    };

    const activeCount = subscribers.filter(s => s.status === "Active").length;
    const unsubCount = subscribers.filter(s => s.status === "Unsubscribed").length;

    return (
        <div className="space-y-6 relative">
            {/* Success Toast */}
            {showSuccessToast && (
                <div className="fixed top-24 right-8 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-premium flex items-center gap-3 z-50 animate-in fade-in slide-in-from-top-4">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-bold text-sm">Subscriber updated successfully!</span>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-navy">News & Subscribers</h2>
                    <p className="text-brand-muted text-xs sm:text-sm">Manage newsletter signups and marketing opt-ins.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-secondary h-10 py-2 px-3 text-xs sm:text-sm" onClick={() => {
                        triggerToast();
                        alert("CSV Download started...");
                    }}>
                        <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {[
                    { label: "Active Subscribers", value: activeCount, icon: Users, color: "blue", trend: "+12%" },
                    { label: "Growth Rate", value: "88%", icon: TrendingUp, color: "green", trend: "+5% today" },
                    { label: "Unsubscribed", value: unsubCount, icon: UserMinus, color: "orange", trend: "-2% week" },
                ].map((stat, idx) => (
                    <div key={idx} className="admin-card p-4 sm:p-6 group hover:border-primary/50 transition-all cursor-pointer">
                        <div className="flex items-center justify-between mb-3 min-w-0">
                            <span className="text-[10px] sm:text-xs font-bold text-brand-muted uppercase tracking-wider truncate">{stat.label}</span>
                            <div className={cn("p-1.5 rounded-lg shrink-0",
                                stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                                    stat.color === 'green' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                            )}>
                                <stat.icon className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="flex items-end justify-between gap-2 overflow-hidden">
                            <span className="text-2xl sm:text-3xl font-black text-navy leading-none truncate">{stat.value}</span>
                            <span className={cn("text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap mb-0.5",
                                stat.trend.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                            )}>{stat.trend}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="admin-card overflow-hidden">
                <div className="p-3 sm:p-4 border-b border-brand-border space-y-4">
                    <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                            <input
                                type="text"
                                placeholder="Search by email..."
                                className="input-base pl-10 h-10 text-sm w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className={cn("btn-secondary h-10 px-3 flex items-center gap-2 text-sm", isFilterOpen && "bg-primary/5 text-primary border-primary/20")}
                            >
                                <Filter className="w-4 h-4 shrink-0" />
                                <span className="hidden sm:inline">Advanced Filters</span>
                            </button>
                        </div>
                    </div>

                    {isFilterOpen && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-brand-bg rounded-xl border border-brand-border animate-in slide-in-from-top-2">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Source</label>
                                <select
                                    className="input-base h-9 text-xs"
                                    value={filters.source}
                                    onChange={(e) => setFilters({ ...filters, source: e.target.value })}
                                >
                                    {sources.map(src => <option key={src}>{src}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Status</label>
                                <select
                                    className="input-base h-9 text-xs"
                                    value={filters.status}
                                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                >
                                    <option>All</option>
                                    <option>Active</option>
                                    <option>Unsubscribed</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button className="btn-secondary h-9 w-full text-xs font-bold" onClick={() => setFilters({ source: 'All', status: 'All' })}>Reset Filters</button>
                            </div>
                        </div>
                    )}
                </div>

                <DataTable
                    headers={[
                        <input
                            key="select-all"
                            type="checkbox"
                            className="rounded border-brand-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                            onChange={toggleSelectAll}
                            checked={selectedIds.length === filteredSubscribers.length && filteredSubscribers.length > 0}
                        />,
                        "Email Address",
                        "Source",
                        "Date Subscribed",
                        "Status",
                        { content: "Actions", className: "text-right" }
                    ]}
                    mobileContent={filteredSubscribers.length > 0 ? filteredSubscribers.map((sub, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-xl border border-brand-border shadow-soft flex flex-col gap-3 relative">
                            <div className="flex items-center justify-between border-b border-brand-border pb-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <input
                                        type="checkbox"
                                        className="rounded border-brand-border text-primary focus:ring-primary h-4 w-4 cursor-pointer shrink-0"
                                        checked={selectedIds.includes(sub.id)}
                                        onChange={() => toggleSelect(sub.id)}
                                    />
                                    <div className="flex items-center gap-2 min-w-0">
                                        <Mail className="w-3.5 h-3.5 text-brand-muted shrink-0" />
                                        <span className="text-sm font-bold text-navy truncate">{sub.email}</span>
                                    </div>
                                </div>
                                <StatusBadge status={sub.status} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-brand-muted tracking-widest mb-1">Source</p>
                                    <span className="text-xs font-bold text-charcoal">{sub.source}</span>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-brand-muted tracking-widest mb-1">Joined</p>
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-charcoal">
                                        <Calendar className="w-3 h-3 text-brand-muted" /> {sub.date}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <button className="flex-1 btn-secondary text-xs py-2" onClick={() => handleUnsubscribe(sub.id)}>Unsubscribe</button>
                            </div>
                        </div>
                    )) : null}
                >
                    {filteredSubscribers.length > 0 ? filteredSubscribers.map((sub, idx) => (
                        <tr key={idx} className="hover:bg-brand-bg/30 transition-colors group">
                            <td onClick={(e) => e.stopPropagation()}>
                                <input
                                    type="checkbox"
                                    className="rounded border-brand-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                                    checked={selectedIds.includes(sub.id)}
                                    onChange={() => toggleSelect(sub.id)}
                                />
                            </td>
                            <td>
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-brand-bg border border-brand-border rounded-lg group-hover:bg-primary group-hover:text-white transition-all">
                                        <Mail className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-sm font-bold text-navy truncate">{sub.email}</span>
                                </div>
                            </td>
                            <td>
                                <span className="text-[11px] text-brand-muted font-black uppercase tracking-widest px-2 py-0.5 bg-brand-bg rounded-lg border border-brand-border">{sub.source}</span>
                            </td>
                            <td>
                                <div className="flex items-center gap-1.5 text-xs text-charcoal font-medium">
                                    <Calendar className="w-3.5 h-3.5 text-brand-muted" />
                                    {sub.date}
                                </div>
                            </td>
                            <td>
                                <StatusBadge status={sub.status} />
                            </td>
                            <td className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                    <button className="p-2 hover:bg-brand-bg rounded-lg transition-colors text-brand-muted hover:text-navy group/link">
                                        <ExternalLink className="w-4 h-4" />
                                    </button>
                                    <div className="relative group/more">
                                        <button className="p-2 hover:bg-brand-bg rounded-lg transition-colors text-brand-muted hover:text-navy">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                        <div className="absolute right-0 top-full mt-1 hidden group-hover/more:block z-50 bg-white border border-brand-border rounded-xl shadow-premium p-1 min-w-[140px] text-left animate-in fade-in zoom-in-95">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleUnsubscribe(sub.id); }}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-orange-600 hover:bg-orange-50 rounded-lg"
                                            >
                                                <Ban className="w-3.5 h-3.5" /> Unsubscribe
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); if (confirm('Delete subscriber?')) setSubscribers(subscribers.filter(s => s.id !== sub.id)); triggerToast(); }}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" /> Permanent Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="6" className="px-6 py-16 text-center text-brand-muted">
                                <div className="max-w-xs mx-auto">
                                    <Mail className="w-12 h-12 text-brand-border mx-auto mb-4 opacity-40" />
                                    <p className="font-bold text-navy text-lg leading-tight mb-2">No matching subscribers</p>
                                    <p className="text-xs text-brand-muted">We couldn't find any subscribers matching your current search and filter settings.</p>
                                    <button className="mt-4 text-xs font-bold text-primary hover:underline" onClick={() => setFilters({ source: 'All', status: 'All' })}>Clear all filters</button>
                                </div>
                            </td>
                        </tr>
                    )}
                </DataTable>

                {/* Bulk Action Bar */}
                {selectedIds.length > 0 && (
                    <div className="p-3 sm:p-4 bg-navy text-white flex flex-col sm:flex-row items-center justify-between gap-3 animate-in slide-in-from-bottom-2">
                        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                            <span className="text-xs sm:text-sm font-medium whitespace-nowrap">{selectedIds.length} selected</span>
                            <div className="flex items-center gap-2 flex-1">
                                <button className="flex-1 sm:flex-none px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-bold transition-colors" onClick={handleBulkUnsubscribe}>Unsubscribe All</button>
                                <button className="flex-1 sm:flex-none px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-[11px] font-bold transition-colors" onClick={() => {
                                    if (confirm(`Permanently remove ${selectedIds.length} subscribers?`)) {
                                        setSubscribers(subscribers.filter(s => !selectedIds.includes(s.id)));
                                        setSelectedIds([]);
                                        triggerToast();
                                    }
                                }}>Delete Permamently</button>
                            </div>
                        </div>
                        <button className="text-[11px] text-white/60 hover:text-white transition-colors underline shrink-0" onClick={() => setSelectedIds([])}>Keep all for now</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubscribersPage;
