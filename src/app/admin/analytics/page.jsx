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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-navy">Operational Analytics</h2>
                    <p className="text-brand-muted text-sm">Monitor clinic performance, user growth, and content engagement.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="btn-secondary" onClick={() => triggerToast("Filter changed to Last 30 Days", "info")}>
                        <Filter className="w-4 h-4" />
                        Last 30 Days
                    </button>
                    <button className="btn-primary" onClick={() => triggerToast("Generating PDF Report... Download will start shortly.", "success")}>
                        <Download className="w-4 h-4" />
                        Report
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Bookings conversion", value: "24.5%", trend: "up", change: "+4.2%" },
                    { label: "Avg. Appointment Time", value: "42 min", trend: "down", change: "-2.1%" },
                    { label: "Patient Retention", value: "68%", trend: "up", change: "+1.5%" },
                ].map((stat, idx) => (
                    <div key={idx} className="admin-card p-6">
                        <p className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2">{stat.label}</p>
                        <div className="flex items-end gap-3">
                            <h3 className="text-3xl font-black text-navy leading-none">{stat.value}</h3>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="admin-card p-6 min-h-[400px] flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-bold text-navy flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary" />
                            Appointment Trends
                        </h3>
                        <div className="flex items-center gap-4 text-[10px] font-bold text-brand-muted">
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

                    <div className="flex-1 flex items-end justify-between gap-2 pt-8">
                        {[45, 60, 35, 80, 55, 90, 75, 40, 65, 85, 50, 70].map((h, i) => (
                            <div key={i} className="flex-1 group relative">
                                <div
                                    className="bg-primary/20 hover:bg-primary transition-colors rounded-t-lg relative"
                                    style={{ height: `${h}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-navy text-white text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {h} Bookings
                                    </div>
                                </div>
                                <div className="h-0.5 w-full bg-brand-border mt-2"></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-between mt-4 px-2">
                        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => (
                            <span key={m} className="text-[10px] font-bold text-brand-muted uppercase">{m}</span>
                        ))}
                    </div>
                </div>

                <div className="admin-card p-6 flex flex-col">
                    <h3 className="font-bold text-navy mb-6 flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-500" />
                        Top Performing Doctors
                    </h3>
                    <div className="space-y-6">
                        {[
                            { name: "Dr. Robert Smith", specialty: "Cardiology", appointments: 142, rating: 4.9 },
                            { name: "Dr. Lisa Wong", specialty: "Dermatology", appointments: 128, rating: 4.7 },
                            { name: "Dr. Michael Chen", specialty: "Pediatrics", appointments: 115, rating: 4.8 },
                            { name: "Dr. Sarah Miller", specialty: "Neurology", appointments: 94, rating: 5.0 },
                        ].map((doc, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-brand-bg rounded-xl flex items-center justify-center font-bold text-navy border border-brand-border">
                                        {doc.name.split(' ').pop().charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-navy">{doc.name}</p>
                                        <p className="text-[10px] text-brand-muted uppercase font-black tracking-widest">{doc.specialty}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-navy">{doc.appointments}</p>
                                    <p className="text-[10px] text-brand-muted uppercase font-bold">Appts</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        className="mt-8 w-full btn-secondary text-xs uppercase tracking-widest font-black"
                        onClick={() => triggerToast("Opening full leaderboard...", "info")}
                    >View Full Leaderboard</button>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
