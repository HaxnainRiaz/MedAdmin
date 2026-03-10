"use client";

import React from "react";
import {
    X,
    Stethoscope,
    Star,
    Calendar,
    Clock,
    MapPin,
    Languages,
    GraduationCap,
    Award,
    Edit2,
    Trash2,
    ExternalLink,
    CheckCircle2,
    Briefcase,
    Activity,
    Video,
    UserCircle
} from "lucide-react";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import { cn } from "@/lib/admin-utils";

export default function DoctorDetailPanel({ doctor, onClose, onEdit, onDelete }) {
    if (!doctor) return null;

    return (
        <div className="h-full flex flex-col bg-white border-l border-brand-border animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-brand-border flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black text-brand-muted tracking-widest mb-1">Doctor Profile</span>
                    <h3 className="text-lg font-bold text-navy flex items-center gap-2 italic">
                        {doctor.id}
                        <StatusBadge status={doctor.status} />
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
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative">
                        <div className="w-24 h-24 bg-blue-50 text-primary rounded-[2rem] flex items-center justify-center border-2 border-primary/20 shadow-soft overflow-hidden">
                            <Stethoscope className="w-10 h-10" />
                        </div>
                        {doctor.featured && (
                            <div className="absolute -top-2 -right-2 bg-yellow-400 text-white p-1.5 rounded-xl shadow-premium border-2 border-white">
                                <Star className="w-3.5 h-3.5 fill-current" />
                            </div>
                        )}
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-navy">{doctor.name}</h4>
                        <p className="text-sm font-bold text-primary">{doctor.title}</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-brand-border rounded-xl shadow-premium-sm">
                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs font-bold text-charcoal">{doctor.rating} ({doctor.reviews} Reviews)</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-brand-border rounded-xl shadow-premium-sm">
                            <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                            <span className="text-xs font-bold text-charcoal">{doctor.experience} Years Exp.</span>
                        </div>
                    </div>
                </div>

                {/* Primary Actions */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => onEdit(doctor)}
                        className="btn-primary w-full py-2.5 text-xs sm:text-sm flex items-center justify-center gap-2"
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit Profile
                    </button>
                    <button
                        onClick={() => onDelete(doctor.id)}
                        className="btn-secondary w-full py-2.5 text-xs sm:text-sm text-red-600 hover:bg-red-50 border-red-100 flex items-center justify-center gap-2"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                    </button>
                </div>

                {/* Info Sections */}
                <div className="space-y-6">
                    {/* Consultation Details */}
                    <div className="admin-card p-4 space-y-4 border-dashed border-2">
                        <h5 className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Consultation Info</h5>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs font-bold text-navy">
                                    <Video className="w-4 h-4 text-emerald-500" />
                                    Modes Supported
                                </div>
                                <div className="flex items-center gap-1">
                                    {doctor.modes.map((m, i) => (
                                        <span key={i} className="text-[10px] bg-brand-bg px-2 py-0.5 rounded-lg border border-brand-border">{m}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs font-bold text-navy">
                                    <Languages className="w-4 h-4 text-purple-500" />
                                    Languages
                                </div>
                                <div className="flex items-center gap-1">
                                    {doctor.languages.map((l, i) => (
                                        <span key={i} className="text-[10px] bg-brand-bg px-2 py-0.5 rounded-lg border border-brand-border">{l}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Schedule Preview */}
                    <section className="space-y-4">
                        <h4 className="text-[11px] font-black text-brand-muted uppercase tracking-widest flex items-center gap-2">
                            <Clock className="w-4 h-4" /> Next Available Slots
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="p-3 rounded-2xl bg-brand-bg border border-brand-border text-center group hover:bg-white hover:border-primary transition-all cursor-pointer">
                                <p className="text-[10px] font-bold text-brand-muted uppercase">Today</p>
                                <p className="text-xs font-black text-navy mt-0.5">02:30 PM</p>
                            </div>
                            <div className="p-3 rounded-2xl bg-brand-bg border border-brand-border text-center group hover:bg-white hover:border-primary transition-all cursor-pointer">
                                <p className="text-[10px] font-bold text-brand-muted uppercase">Tomorrow</p>
                                <p className="text-xs font-black text-navy mt-0.5">09:00 AM</p>
                            </div>
                        </div>
                    </section>

                    {/* Stats & Activity */}
                    <section className="space-y-4">
                        <h4 className="text-[11px] font-black text-brand-muted uppercase tracking-widest flex items-center gap-2">
                            <Activity className="w-4 h-4" /> Monthly Stats
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white border border-brand-border rounded-2xl shadow-premium-sm">
                                <p className="text-[10px] font-bold text-brand-muted uppercase mb-1">Appointments</p>
                                <p className="text-xl font-black text-navy">128</p>
                                <p className="text-[10px] text-emerald-600 font-bold mt-1">+14% vs last mo</p>
                            </div>
                            <div className="p-4 bg-white border border-brand-border rounded-2xl shadow-premium-sm">
                                <p className="text-[10px] font-bold text-brand-muted uppercase mb-1">Growth</p>
                                <p className="text-xl font-black text-navy">92%</p>
                                <p className="text-[10px] text-emerald-600 font-bold mt-1">Positive Feedback</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-6 border-t border-brand-border bg-brand-bg flex items-center justify-between sticky bottom-0 z-10">
                <button className="text-[13px] font-bold text-primary flex items-center gap-1.5 hover:underline group">
                    View Website Profile <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
            </div>
        </div>
    );
}
