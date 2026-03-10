"use client";

import React from "react";
import { useToast } from "@/components/admin/shared/ToastProvider";
import {
    BarChart3,
    TrendingUp,
    Users,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Filter,
    Download
} from "lucide-react";
import { cn } from "@/lib/admin-utils";

const AnalyticsPage = () => {
    const { triggerToast } = useToast();

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-navy">Operational Analytics</h2>
                    <p className="text-brand-muted text-xs sm:text-sm">Monitor clinic performance and growth trends.</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <button className="btn-secondary flex-1 sm:flex-none py-2 px-3 text-xs sm:text-sm whitespace-nowrap" onClick={() => triggerToast("Filter changed to Last 30 Days", "info")}>
                        <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Last 30 Days
                    </button>
                    <button className="btn-primary flex-1 sm:flex-none py-2 px-3 text-xs sm:text-sm whitespace-nowrap" onClick={() => triggerToast("Generating PDF Report... Download will start shortly.", "success")}>
                        <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Report
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[
                    { label: "Bookings conversion", value: "24.5%", trend: "up", change: "+4.2%" },
                    { label: "Avg. Appt. Time", value: "42 min", trend: "down", change: "-2.1%" },
                    { label: "Patient Retention", value: "68%", trend: "up", change: "+1.5%" },
                ].map((stat, idx) => (
                    <div key={idx} className="admin-card p-4 sm:p-6">
                        <p className="text-[10px] sm:text-xs font-bold text-brand-muted uppercase tracking-wider mb-2">{stat.label}</p>
                        <div className="flex items-end gap-3">
                            <h3 className="text-2xl sm:text-3xl font-black text-navy leading-none">{stat.value}</h3>
                            <div className={cn(
                                "flex items-center text-[10px] font-black px-1.5 py-0.5 rounded-lg mb-1",
                                stat.trend === "up" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                            )}>
                                {stat.trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {stat.change}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <div className="admin-card p-4 sm:p-6 min-h-[350px] sm:min-h-[400px] flex flex-col">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-3">
                        <h3 className="font-bold text-navy flex items-center gap-2 text-base sm:text-lg">
                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                            Appointment Trends
                        </h3>
                        <div className="flex items-center gap-3 sm:gap-4 text-[10px] font-bold text-brand-muted">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-primary"></div>
                                Confirmed
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-brand-border"></div>
                                Cancelled
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex items-end justify-between gap-1 sm:gap-2 pt-4 sm:pt-8 min-h-0">
                        {[45, 60, 35, 80, 55, 90, 75, 40, 65, 85, 50, 70].map((h, i) => (
                            <div key={i} className="flex-1 group relative h-full flex flex-col justify-end">
                                <div
                                    className="bg-primary/20 hover:bg-primary transition-colors rounded-t-sm sm:rounded-t-lg relative"
                                    style={{ height: `${h}%` }}
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-navy text-white text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                        {h} Bookings
                                    </div>
                                </div>
                                <div className="h-0.5 w-full bg-brand-border mt-2 shrink-0"></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-between mt-3 px-1 sm:px-2 overflow-x-auto scrollbar-hide">
                        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => (
                            <span key={m} className={`text-[8px] sm:text-[10px] font-bold text-brand-muted uppercase ${["Feb", "Apr", "Jun", "Aug", "Oct", "Dec"].includes(m) ? 'block' : 'hidden sm:block'}`}>{m}</span>
                        ))}
                    </div>
                </div>

                <div className="admin-card p-4 sm:p-6 flex flex-col">
                    <h3 className="font-bold text-navy mb-4 sm:mb-6 flex items-center gap-2 text-base sm:text-lg">
                        <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                        Top Performing Doctors
                    </h3>
                    <div className="space-y-4 sm:space-y-6">
                        {[
                            { name: "Dr. Robert Smith", specialty: "Cardiology", appointments: 142, rating: 4.9 },
                            { name: "Dr. Lisa Wong", specialty: "Dermatology", appointments: 128, rating: 4.7 },
                            { name: "Dr. Michael Chen", specialty: "Pediatrics", appointments: 115, rating: 4.8 },
                            { name: "Dr. Sarah Miller", specialty: "Neurology", appointments: 94, rating: 5.0 },
                        ].map((doc, idx) => (
                            <div key={idx} className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-brand-bg rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-navy border border-brand-border shrink-0 text-xs sm:text-sm">
                                        {doc.name.split(' ').pop().charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-navy truncate">{doc.name}</p>
                                        <p className="text-[9px] sm:text-[10px] text-brand-muted uppercase font-black tracking-widest truncate">{doc.specialty}</p>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-sm font-black text-navy leading-none">{doc.appointments}</p>
                                    <p className="text-[9px] sm:text-[10px] text-brand-muted uppercase font-bold mt-0.5">Appts</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        className="mt-6 sm:mt-8 w-full btn-secondary text-[10px] sm:text-xs py-2 uppercase tracking-widest font-black"
                        onClick={() => triggerToast("Opening full leaderboard...", "info")}
                    >View Full Leaderboard</button>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
