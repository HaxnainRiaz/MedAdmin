"use client";

import React, { useState } from "react";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import Modal from "@/components/admin/shared/Modal";
import {
    History,
    Search,
    Filter,
    Download,
    Eye,
    User,
    Clock,
    Laptop,
    ShieldAlert,
    X
} from "lucide-react";
import { cn } from "@/lib/admin-utils";
import { useToast } from "@/components/admin/shared/ToastProvider";

const initialAuditLogs = [
    { id: "LOG-542", action: "Deleted Appointment", user: "Dr. Robert Smith", entity: "Appointment APT-1039", ip: "192.168.1.104", date: "Today, 10:45 AM", severity: "high", detail: "Dr. Robert Smith permanently deleted patient appointment APT-1039 scheduled for March 10, 2024 with patient Michael Brown. Action was triggered from the Appointments management panel. This action cannot be undone." },
    { id: "LOG-541", action: "Updated Settings", user: "John Admin", entity: "Global Settings", ip: "192.168.1.1", date: "Today, 09:30 AM", severity: "medium", detail: "Admin user John Admin modified the Global Site Settings. Changed fields: contact_email, facility_address, appointment_slot_duration. Previous values were backed up." },
    { id: "LOG-540", action: "Published Blog Post", user: "Jane Editor", entity: "Post 'Heart Health'", ip: "10.0.0.45", date: "Yesterday, 04:15 PM", severity: "low", detail: "Content editor Jane Editor published the blog post 'Heart Health Tips for Winter' (ID: POST-029). Post is now publicly visible on the website." },
    { id: "LOG-539", action: "Created User", user: "John Admin", entity: "User 'Sarah Manager'", ip: "192.168.1.1", date: "Yesterday, 11:20 AM", severity: "medium", detail: "New user account created for Sarah Manager with the role 'Manager'. A welcome email was dispatched. Account is pending email verification." },
    { id: "LOG-538", action: "Login Failed", user: "System", entity: "User 'admin@medify.com'", ip: "45.22.11.90", date: "2 Days Ago", severity: "high", detail: "Multiple failed login attempts detected for admin@medify.com from external IP 45.22.11.90. Account was temporarily locked after 5 consecutive failures. Possible brute force attempt." },
];

const AuditLogsPage = () => {
    const { triggerToast } = useToast();
    const [logs] = useState(initialAuditLogs);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSeverity, setSelectedSeverity] = useState("All");
    const [selectedLog, setSelectedLog] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const openDetail = (log) => {
        setSelectedLog(log);
        setIsDetailOpen(true);
    };

    const filtered = logs.filter(log => {
        const matchesSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.ip.includes(searchQuery) ||
            log.entity.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSeverity = selectedSeverity === "All" || log.severity === selectedSeverity.toLowerCase();
        return matchesSearch && matchesSeverity;
    });

    const severityStyles = {
        high: "bg-red-100 text-red-700",
        medium: "bg-orange-100 text-orange-700",
        low: "bg-emerald-100 text-emerald-700"
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-navy flex items-center gap-2">
                        <History className="w-6 h-6 text-primary" /> System Audit Logs
                    </h2>
                    <p className="text-brand-muted text-sm mt-1">Review all administrative actions, logins, and data changes.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        className="btn-secondary"
                        onClick={() => triggerToast("Generating export... Download will start shortly.", "success")}
                    >
                        <Download className="w-4 h-4" /> Export Last 30 Days
                    </button>
                </div>
            </div>

            <div className="admin-card overflow-hidden">
                <div className="p-4 border-b border-brand-border space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                            <input
                                type="text"
                                placeholder="Search by action, user, entity or IP..."
                                className="input-base pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center bg-brand-bg p-1 rounded-xl">
                                {["All", "High", "Medium", "Low"].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setSelectedSeverity(s)}
                                        className={cn(
                                            "px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
                                            selectedSeverity === s ? "bg-white text-primary shadow-sm" : "text-brand-muted hover:text-navy"
                                        )}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-brand-bg/50 text-[10px] uppercase tracking-wider text-brand-muted font-bold">
                                <th className="px-6 py-4">Action & Entity</th>
                                <th className="px-6 py-4">Performed By</th>
                                <th className="px-6 py-4">Timestamp & IP</th>
                                <th className="px-6 py-4">Severity</th>
                                <th className="px-6 py-4 text-right">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border">
                            {filtered.map((log, idx) => (
                                <tr key={idx} className="hover:bg-brand-bg/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-navy">{log.action}</span>
                                            <span className="text-[10px] text-brand-muted uppercase font-black tracking-widest mt-1">{log.entity}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-1.5 text-xs font-bold text-charcoal">
                                            <User className="w-3 h-3 text-brand-muted" />
                                            {log.user}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="flex items-center gap-1.5 text-xs text-brand-muted font-medium">
                                                <Clock className="w-3 h-3 text-primary" />
                                                {log.date}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-[10px] font-mono text-brand-muted">
                                                <Laptop className="w-3 h-3 text-brand-muted" />
                                                {log.ip}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded",
                                            severityStyles[log.severity]
                                        )}>
                                            {log.severity}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-brand-muted hover:text-primary"
                                            onClick={() => openDetail(log)}
                                            title="View log detail"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <History className="w-10 h-10 text-brand-border mx-auto mb-3" />
                                        <p className="font-bold text-navy">No logs match your filters</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Log Detail Modal */}
            <Modal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                title="Audit Log Detail"
                maxWidth="max-w-lg"
            >
                {selectedLog && (
                    <div className="space-y-6">
                        <div className="flex items-start gap-4 p-4 bg-brand-bg rounded-xl border border-brand-border">
                            <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                                selectedLog.severity === "high" ? "bg-red-100" : selectedLog.severity === "medium" ? "bg-orange-100" : "bg-emerald-100"
                            )}>
                                <ShieldAlert className={cn(
                                    "w-5 h-5",
                                    selectedLog.severity === "high" ? "text-red-500" : selectedLog.severity === "medium" ? "text-orange-500" : "text-emerald-500"
                                )} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-navy text-sm">{selectedLog.action}</h4>
                                    <span className={cn("text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded", severityStyles[selectedLog.severity])}>
                                        {selectedLog.severity}
                                    </span>
                                </div>
                                <p className="text-[10px] text-brand-muted uppercase font-bold tracking-widest">{selectedLog.entity}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-brand-bg rounded-lg p-3 border border-brand-border">
                                    <p className="text-[10px] text-brand-muted font-bold uppercase tracking-widest mb-1">Performed By</p>
                                    <p className="text-sm font-bold text-navy">{selectedLog.user}</p>
                                </div>
                                <div className="bg-brand-bg rounded-lg p-3 border border-brand-border">
                                    <p className="text-[10px] text-brand-muted font-bold uppercase tracking-widest mb-1">IP Address</p>
                                    <p className="text-sm font-mono font-bold text-navy">{selectedLog.ip}</p>
                                </div>
                            </div>
                            <div className="bg-brand-bg rounded-lg p-3 border border-brand-border">
                                <p className="text-[10px] text-brand-muted font-bold uppercase tracking-widest mb-1">Timestamp</p>
                                <p className="text-sm font-bold text-navy">{selectedLog.date}</p>
                            </div>
                            <div className="bg-brand-bg rounded-lg p-3 border border-brand-border">
                                <p className="text-[10px] text-brand-muted font-bold uppercase tracking-widest mb-2">Detail Description</p>
                                <p className="text-sm text-charcoal leading-relaxed">{selectedLog.detail}</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-brand-border flex items-center justify-end gap-3">
                            <button
                                className="btn-secondary"
                                onClick={() => {
                                    setIsDetailOpen(false);
                                    triggerToast("Log flagged for review", "info");
                                }}
                            >
                                Flag for Review
                            </button>
                            <button className="btn-primary" onClick={() => setIsDetailOpen(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AuditLogsPage;
