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
    Ban
} from "lucide-react";

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
    const [sourceFilter, setSourceFilter] = useState("All Sources");
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    const triggerToast = () => {
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
    };

    const sources = ["All Sources", ...Array.from(new Set(initialSubscribers.map(s => s.source)))];

    const filteredSubscribers = subscribers.filter(s => {
        const matchesSource = sourceFilter === "All Sources" || s.source === sourceFilter;
        const matchesSearch = s.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSource && matchesSearch;
    });

    const handleUnsubscribe = (id) => {
        if (confirm("Are you sure you want to manually mark this user as unsubscribed?")) {
            setSubscribers(subscribers.map(s => s.id === id ? { ...s, status: "Unsubscribed" } : s));
            triggerToast();
        }
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
                    <h2 className="text-2xl font-bold text-navy">News & Subscribers</h2>
                    <p className="text-brand-muted text-sm">Manage newsletter signups and user marketing opt-ins.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-secondary" onClick={() => {
                        // Mock CSV Export
                        triggerToast();
                        alert("CSV Download started...");
                    }}>
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                    { label: "Total Active Subscribers", value: activeCount },
                    { label: "New This Week", value: "3" },
                    { label: "Unsubscribed", value: unsubCount },
                ].map((stat, idx) => (
                    <div key={idx} className="admin-card p-6">
                        <span className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2">{stat.label}</span>
                        <div className="flex items-end gap-3 mt-1">
                            <span className="text-3xl font-black text-navy leading-none">{stat.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="admin-card overflow-hidden">
                <div className="p-4 border-b border-brand-border space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                            <input
                                type="text"
                                placeholder="Search by email..."
                                className="input-base pl-10 h-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <select
                                className="input-base text-sm w-48 h-10"
                                value={sourceFilter}
                                onChange={(e) => setSourceFilter(e.target.value)}
                            >
                                {sources.map((src, i) => (
                                    <option key={i} value={src}>{src}</option>
                                ))}
                            </select>
                            <button className="btn-secondary whitespace-nowrap h-10">
                                <Filter className="w-4 h-4" />
                                More Filters
                            </button>
                        </div>
                    </div>
                </div>

                <DataTable
                    headers={[
                        "Email Address",
                        "Source",
                        "Date Subscribed",
                        "Status",
                        { content: "Actions", className: "text-right" }
                    ]}
                >
                    {filteredSubscribers.length > 0 ? filteredSubscribers.map((sub, idx) => (
                        <tr key={idx} className="hover:bg-brand-bg/30 transition-colors group">
                            <td>
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-brand-muted" />
                                    <span className="text-sm font-bold text-navy">{sub.email}</span>
                                </div>
                            </td>
                            <td>
                                <span className="text-xs text-brand-muted font-bold px-2 py-1 bg-brand-bg rounded-lg border border-brand-border">{sub.source}</span>
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
                                {sub.status === "Active" ? (
                                    <button
                                        className="p-2 hover:bg-red-50 rounded-lg transition-colors text-brand-muted hover:text-red-500 flex items-center gap-2 ml-auto text-xs font-bold"
                                        onClick={() => handleUnsubscribe(sub.id)}
                                        title="Unsubscribe User"
                                    >
                                        <Ban className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <span className="text-[10px] text-brand-muted font-bold italic">Unsubscribed</span>
                                )}
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="5" className="px-6 py-12 text-center text-brand-muted">
                                <Mail className="w-12 h-12 text-brand-border mx-auto mb-3" />
                                <p className="font-bold text-navy text-lg">No subscribers found</p>
                            </td>
                        </tr>
                    )}
                </DataTable>
            </div>
        </div>
    );
};

export default SubscribersPage;
