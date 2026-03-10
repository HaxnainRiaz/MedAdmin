"use client";

import React from "react";
import {
    X,
    UserCircle,
    Mail,
    Phone,
    Calendar,
    Clock,
    MapPin,
    Video,
    CreditCard,
    FileText,
    ExternalLink,
    RefreshCw,
    Ban,
    ChevronRight,
    History
} from "lucide-react";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import { cn, formatDate } from "@/lib/admin-utils";

export default function AppointmentDetailPanel({ appointment, onClose, onUpdateStatus }) {
    if (!appointment) return null;

    return (
        <div className="h-full flex flex-col bg-white border-l border-brand-border animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-brand-border flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black text-brand-muted tracking-widest mb-1">Appointment Details</span>
                    <h3 className="text-lg font-bold text-navy flex items-center gap-2">
                        {appointment.id}
                        <StatusBadge status={appointment.status} />
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
                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    {appointment.status === 'Pending' && (
                        <button
                            onClick={() => onUpdateStatus(appointment.id, 'Confirmed')}
                            className="btn-primary w-full py-2.5 text-xs sm:text-sm"
                        >
                            Confirm
                        </button>
                    )}
                    <button
                        className="btn-secondary w-full py-2.5 text-xs sm:text-sm flex items-center justify-center gap-2"
                        onClick={() => alert('Reschedule flow')}
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Reschedule
                    </button>
                    {appointment.status !== 'Cancelled' && (
                        <button
                            onClick={() => onUpdateStatus(appointment.id, 'Cancelled')}
                            className="col-span-1 btn-secondary w-full py-2.5 text-xs sm:text-sm text-red-600 hover:bg-red-50 border-red-100 flex items-center justify-center gap-2"
                        >
                            <Ban className="w-3.5 h-3.5" />
                            Cancel
                        </button>
                    )}
                </div>

                {/* Patient Info */}
                <section className="space-y-4">
                    <h4 className="text-[11px] font-black text-brand-muted uppercase tracking-widest flex items-center gap-2">
                        <UserCircle className="w-4 h-4" /> Patient Information
                    </h4>
                    <div className="bg-brand-bg rounded-2xl p-4 sm:p-5 border border-brand-border space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl border border-brand-border flex items-center justify-center text-primary font-bold text-xl shadow-sm">
                                {appointment.patient.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-navy">{appointment.patient}</p>
                                <p className="text-xs text-brand-muted">Gender Unknown • Age Unknown</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            <div className="flex items-center gap-3 text-sm text-charcoal">
                                <Mail className="w-4 h-4 text-brand-muted shrink-0" />
                                <span className="truncate">{appointment.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-charcoal">
                                <Phone className="w-4 h-4 text-brand-muted shrink-0" />
                                {appointment.phone}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Schedule & Service */}
                <section className="space-y-4">
                    <h4 className="text-[11px] font-black text-brand-muted uppercase tracking-widest flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> Schedule & Provider
                    </h4>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-navy">{formatDate(appointment.date)}</p>
                                <p className="text-xs text-brand-muted">{appointment.time} • {appointment.mode} Consultation</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-navy">{appointment.doctor}</p>
                                <p className="text-xs text-brand-muted">{appointment.specialty}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-navy">{appointment.payment} Payment</p>
                                <p className="text-xs text-brand-muted">Payment status and billing info</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Notes */}
                <section className="space-y-4">
                    <h4 className="text-[11px] font-black text-brand-muted uppercase tracking-widest flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Consultation Notes
                    </h4>
                    <div className="bg-brand-bg rounded-2xl p-4 border border-brand-border min-h-[100px]">
                        <p className="text-sm text-charcoal italic leading-relaxed">
                            {appointment.notes || "No patient notes provided for this appointment."}
                        </p>
                    </div>
                </section>

                {/* History Timeline */}
                <section className="space-y-4 pb-6">
                    <h4 className="text-[11px] font-black text-brand-muted uppercase tracking-widest flex items-center gap-2">
                        <History className="w-4 h-4" /> History Timeline
                    </h4>
                    <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-px before:bg-brand-border">
                        <div className="flex gap-4 relative">
                            <div className="w-[23px] h-[23px] rounded-full bg-white border-2 border-emerald-500 shrink-0 z-10 shadow-sm"></div>
                            <div className="pt-0.5">
                                <p className="text-sm font-bold text-navy">Appointment Booked</p>
                                <p className="text-[11px] text-brand-muted mt-0.5">March 20, 2024 • 10:42 AM via Website</p>
                            </div>
                        </div>
                        <div className="flex gap-4 relative">
                            <div className="w-[23px] h-[23px] rounded-full bg-white border-2 border-brand-border shrink-0 z-10 shadow-sm"></div>
                            <div className="pt-0.5">
                                <p className="text-sm font-bold text-brand-muted">Status Updated to {appointment.status}</p>
                                <p className="text-[11px] text-brand-muted mt-0.5">Processing update...</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Footer Actions */}
            <div className="p-4 sm:p-6 border-t border-brand-border bg-brand-bg flex items-center justify-between sticky bottom-0 z-10">
                <button className="text-[13px] font-bold text-primary flex items-center gap-1.5 hover:underline">
                    View Full Patient History
                    <ChevronRight className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2">
                    <button className="p-2 bg-white border border-brand-border rounded-xl text-brand-muted hover:text-navy hover:border-navy transition-all shadow-sm">
                        <ExternalLink className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
