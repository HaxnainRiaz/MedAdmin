"use client";

import React from "react";
import {
    X,
    User,
    Mail,
    Shield,
    Calendar,
    Activity,
    Key,
    Lock,
    Trash2,
    Edit2,
    CheckCircle2,
    Ban,
    History,
    Fingerprint
} from "lucide-react";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import { cn } from "@/lib/admin-utils";

export default function UserDetailPanel({ user, onClose, onEdit, onDelete, onUpdateStatus }) {
    if (!user) return null;

    return (
        <div className="h-full flex flex-col bg-white border-l border-brand-border animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-brand-border flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black text-brand-muted tracking-widest mb-1">User Profile</span>
                    <h3 className="text-lg font-bold text-navy flex items-center gap-2 italic">
                        {user.id}
                        <StatusBadge status={user.status} />
                    </h3>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-brand-bg rounded-lg transition-colors text-brand-muted hover:text-navy"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 scrollbar-hide">
                {/* Profile Overview */}
                <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center font-bold text-3xl border-2 border-primary/20 shadow-soft">
                        {user.name.charAt(0)}
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-navy">{user.name}</h4>
                        <p className="text-sm text-brand-muted">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-brand-border rounded-xl shadow-premium-sm">
                            <Shield className="w-3.5 h-3.5 text-primary" />
                            <span className="text-xs font-bold text-charcoal">{user.role}</span>
                        </div>
                    </div>
                </div>

                {/* Main Actions */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => onEdit(user)}
                        className="btn-primary w-full py-2.5 text-xs sm:text-sm flex items-center justify-center gap-2"
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit Profile
                    </button>
                    <button
                        onClick={() => onDelete(user.id)}
                        className="btn-secondary w-full py-2.5 text-xs sm:text-sm text-red-600 hover:bg-red-50 border-red-100 flex items-center justify-center gap-2"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                    </button>
                </div>

                {/* Quick Toggle Status */}
                <div className="bg-brand-bg rounded-2xl p-4 border border-brand-border space-y-3">
                    <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Account Controls</p>
                    <div className="flex items-center gap-2">
                        {user.status === "Active" ? (
                            <button
                                onClick={() => onUpdateStatus(user.id, "Inactive")}
                                className="flex-1 btn-secondary bg-white py-2 text-xs flex items-center justify-center gap-2"
                            >
                                <Ban className="w-3.5 h-3.5 text-orange-500" />
                                Suspend Access
                            </button>
                        ) : (
                            <button
                                onClick={() => onUpdateStatus(user.id, "Active")}
                                className="flex-1 btn-secondary bg-white py-2 text-xs flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                Reactivate
                            </button>
                        )}
                        <button className="p-2 bg-white border border-brand-border rounded-xl text-brand-muted hover:text-navy transition-all shadow-sm">
                            <Key className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* System Permissions Info */}
                <section className="space-y-4">
                    <h4 className="text-[11px] font-black text-brand-muted uppercase tracking-widest flex items-center gap-2">
                        <Fingerprint className="w-4 h-4" /> Access & Security
                    </h4>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                                <Lock className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-navy">2FA Authentication</p>
                                <p className="text-xs text-brand-muted">Enabled via SMS (+1 **** 4567)</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-navy">Member Since</p>
                                <p className="text-xs text-brand-muted">{user.created} (Last login 2h ago)</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Activity Log Preview */}
                <section className="space-y-4 pb-6">
                    <h4 className="text-[11px] font-black text-brand-muted uppercase tracking-widest flex items-center gap-2">
                        <History className="w-4 h-4" /> Recent Activity
                    </h4>
                    <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-px before:bg-brand-border">
                        <div className="flex gap-4 relative pl-1">
                            <div className="w-5 h-5 rounded-full bg-emerald-100 border-4 border-white ring-1 ring-emerald-500/20 shrink-0 z-10"></div>
                            <div>
                                <p className="text-xs font-bold text-navy">Updated System Settings</p>
                                <p className="text-[10px] text-brand-muted mt-0.5">Today • 10:45 AM</p>
                            </div>
                        </div>
                        <div className="flex gap-4 relative pl-1">
                            <div className="w-5 h-5 rounded-full bg-blue-100 border-4 border-white ring-1 ring-blue-500/20 shrink-0 z-10"></div>
                            <div>
                                <p className="text-xs font-bold text-navy">Exported Appointments Report</p>
                                <p className="text-[10px] text-brand-muted mt-0.5">Yesterday • 4:20 PM</p>
                            </div>
                        </div>
                        <div className="flex gap-4 relative pl-1">
                            <div className="w-5 h-5 rounded-full bg-brand-bg border-4 border-white ring-1 ring-brand-border shrink-0 z-10"></div>
                            <div>
                                <p className="text-xs font-bold text-brand-muted">Logged In</p>
                                <p className="text-[10px] text-brand-muted mt-0.5">March 19 • 09:00 AM</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-6 border-t border-brand-border bg-brand-bg flex items-center justify-center sticky bottom-0 z-10">
                <button className="text-[13px] font-bold text-primary flex items-center gap-1.5 hover:underline">
                    View Full Audit History
                </button>
            </div>
        </div>
    );
}
