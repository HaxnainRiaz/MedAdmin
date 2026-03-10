"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import KpiCard from "@/components/admin/dashboard/KpiCard";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import Modal from "@/components/admin/shared/Modal";
import DataTable from "@/components/admin/shared/DataTable";
import { useToast } from "@/components/admin/shared/ToastProvider";
import {
    Calendar,
    Users,
    MessageSquare,
    Stethoscope,
    ArrowRight,
    AlertCircle,
    Clock,
    CheckCircle2,
    MoreVertical,
    ExternalLink,
    Eye,
    X,
    ChevronRight
} from "lucide-react";
import { cn } from "@/lib/admin-utils";

const DashboardPage = () => {
    const router = useRouter();
    const { triggerToast } = useToast();

    const kpis = [
        { title: "Today's Appointments", value: "24", trend: "up", trendValue: "+12%", icon: Calendar, color: "blue" },
        { title: "New Inquiries", value: "18", trend: "up", trendValue: "+5%", icon: MessageSquare, color: "purple" },
        { title: "Active Doctors", value: "42", trend: "down", trendValue: "-2%", icon: Stethoscope, color: "green" },
        { title: "Total Subscribers", value: "1,280", trend: "up", trendValue: "+24%", icon: Users, color: "orange" },
    ];

    const [recentAppointments, setRecentAppointments] = useState([
        { id: "APT-001", patient: "John Doe", doctor: "Dr. Sarah Smith", time: "10:30 AM", status: "Confirmed", mode: "In-Person" },
        { id: "APT-002", patient: "Emma Wilson", doctor: "Dr. Michael Chen", time: "11:15 AM", status: "Pending", mode: "Video" },
        { id: "APT-003", patient: "Robert Brown", doctor: "Dr. Sarah Smith", time: "12:00 PM", status: "Confirmed", mode: "In-Person" },
        { id: "APT-004", patient: "Alice Green", doctor: "Dr. James Bond", time: "02:30 PM", status: "Cancelled", mode: "Video" },
    ]);

    const [alerts, setAlerts] = useState([
        { id: 1, title: "Dr. Smith Unavailable", desc: "Emergency leave today. 4 appointments need rescheduling.", type: "error" },
        { id: 2, title: "Broken Route Alert", desc: "/blog/health-tips is returning 404.", type: "warning" },
        { id: 3, title: "Subscribers Export Ready", desc: "The requested CSV file is ready for download.", type: "success" },
    ]);

    // Appointment quick-action popup
    const [activeAptPopup, setActiveAptPopup] = useState(null);
    // Book appointment modal
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [bookForm, setBookForm] = useState({ patient: "", doctor: "Dr. Sarah Smith", time: "", mode: "In-Person" });

    const handleBookAppointment = (e) => {
        e.preventDefault();
        const newApt = {
            id: `APT-00${recentAppointments.length + 1}`,
            ...bookForm,
            status: "Pending"
        };
        setRecentAppointments([newApt, ...recentAppointments]);
        setIsBookingOpen(false);
        setBookForm({ patient: "", doctor: "Dr. Sarah Smith", time: "", mode: "In-Person" });
        triggerToast(`Appointment for ${newApt.patient} booked`, "success");
    };

    const changeAptStatus = (id, status) => {
        setRecentAppointments(recentAppointments.map(a => a.id === id ? { ...a, status } : a));
        setActiveAptPopup(null);
        triggerToast(`Appointment status changed to ${status}`, "success");
    };

    const dismissAlert = (id) => {
        setAlerts(alerts.filter(a => a.id !== id));
    };

    return (
        <div className="space-y-8">
            {/* Top Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-navy">Welcome back, Admin</h2>
                    <p className="text-brand-muted">Here's what's happening at Medify today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary inline-flex items-center gap-2"
                    >
                        <ExternalLink className="w-4 h-4" />
                        View Site
                    </a>
                    <button className="btn-primary" onClick={() => setIsBookingOpen(true)}>
                        <Calendar className="w-4 h-4" />
                        Book Appointment
                    </button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {kpis.map((kpi, idx) => (
                    <KpiCard key={idx} {...kpi} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 overflow-x-hidden">
                {/* Main Content: Recent Appointments */}
                <div className="lg:col-span-2 space-y-6 lg:space-y-8 min-w-0">
                    <div className="admin-card">
                        <div className="p-4 sm:p-6 border-b border-brand-border flex items-center justify-between gap-4">
                            <h3 className="text-base sm:text-lg font-bold text-navy truncate">Upcoming Appointments</h3>
                            <button
                                className="text-primary text-xs sm:text-sm font-semibold flex items-center gap-1 hover:underline whitespace-nowrap shrink-0"
                                onClick={() => router.push("/admin/appointments")}
                            >
                                <span className="hidden sm:inline">View all</span>
                                <span className="sm:hidden">All</span>
                                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                        </div>
                        <DataTable
                            headers={[
                                "ID",
                                "Patient",
                                "Doctor",
                                "Time",
                                "Status",
                                { content: "Action", className: "hidden space-x-1 sm:table-cell text-right" }
                            ]}
                            mobileContent={recentAppointments.map((apt, idx) => (
                                <div key={idx} className="bg-white p-4 rounded-xl border border-brand-border shadow-soft flex flex-col gap-3">
                                    <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                                        <span className="font-bold text-navy text-sm">{apt.id}</span>
                                        <StatusBadge status={apt.status} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] uppercase tracking-widest text-brand-muted font-bold">Patient</span>
                                            <span className="text-sm font-semibold text-charcoal">{apt.patient}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] uppercase tracking-widest text-brand-muted font-bold">Doctor</span>
                                            <span className="text-sm font-semibold text-charcoal">{apt.doctor}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-3 mt-1 border-t border-brand-border">
                                        <div className="flex items-center gap-1.5 text-navy font-medium text-sm">
                                            <Clock className="w-4 h-4 text-brand-muted" /> {apt.time}
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="text-primary text-xs font-bold px-2 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">Manage</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        >
                            {recentAppointments.map((apt, idx) => (
                                <tr key={idx} className="hover:bg-brand-bg/50 space-x-1 transition-colors group relative">
                                    <td className="font-semibold text-navy">{apt.id}</td>
                                    <td className="text-charcoal font-medium">
                                        {apt.patient}
                                    </td>
                                    <td className="text-charcoal bg-transparent">
                                        {apt.doctor}
                                    </td>
                                    <td className="text-charcoal whitespace-nowrap">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5 text-brand-muted" />
                                            <span className="text-[13px]">{apt.time}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <StatusBadge status={apt.status} />
                                    </td>
                                    <td className="text-right">
                                        <button
                                            onClick={() => setActiveAptPopup(activeAptPopup === apt.id ? null : apt.id)}
                                            className="p-1.5 hover:bg-brand-bg rounded-lg transition-colors text-brand-muted hover:text-navy"
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                        {activeAptPopup === apt.id && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-40"
                                                    onClick={() => setActiveAptPopup(null)}
                                                />
                                                <div className="absolute right-4 mt-1 sm:right-10 z-50 bg-white border border-brand-border rounded-xl shadow-premium p-1 min-w-[180px] text-left">
                                                    <button
                                                        onClick={() => { router.push("/admin/appointments"); setActiveAptPopup(null); }}
                                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-navy hover:bg-brand-bg rounded-lg transition-colors font-medium whitespace-nowrap"
                                                    >
                                                        <Eye className="w-4 h-4 text-brand-muted" /> View Details
                                                    </button>
                                                    <button
                                                        onClick={() => { changeAptStatus(apt.id, "Confirmed"); setActiveAptPopup(null); }}
                                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors font-medium whitespace-nowrap"
                                                    >
                                                        <CheckCircle2 className="w-4 h-4" /> Confirm
                                                    </button>
                                                    <button
                                                        onClick={() => { changeAptStatus(apt.id, "Cancelled"); setActiveAptPopup(null); }}
                                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium whitespace-nowrap"
                                                    >
                                                        <X className="w-4 h-4" /> Cancel
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </DataTable>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="admin-card p-4 sm:p-6">
                            <h3 className="text-base sm:text-lg font-bold text-navy mb-4 sm:mb-6">Operations Status</h3>
                            <div className="space-y-3 sm:space-y-4">
                                {[
                                    { label: "Phone Support", status: "Active", time: "08:00 - 20:00" },
                                    { label: "Critical Inquiries", status: "2 Pending", time: "5m ago" },
                                    { label: "Server Load", status: "Normal", time: "99.9% uptime" }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 sm:p-4 bg-brand-bg rounded-xl gap-3">
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-sm font-semibold text-navy truncate">{item.label}</span>
                                            <span className="text-[11px] text-brand-muted whitespace-nowrap">{item.time}</span>
                                        </div>
                                        <div className="shrink-0">
                                            <StatusBadge status={item.status} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="admin-card p-4 sm:p-6">
                            <h3 className="text-base sm:text-lg font-bold text-navy mb-4 sm:mb-6">Content Summary</h3>
                            <div className="space-y-3 sm:space-y-4">
                                <div className="flex items-center justify-between p-3 sm:p-4 border border-brand-border rounded-xl gap-3 bg-white/50">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-navy truncate">Draft Posts</p>
                                            <p className="text-[11px] text-brand-muted whitespace-nowrap">5 waiting</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => router.push("/admin/blog")}
                                        className="text-[11px] font-bold text-primary hover:underline whitespace-nowrap shrink-0"
                                    >
                                        Review <ChevronRight className="w-3.5 h-3.5 inline" />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-3 sm:p-4 border border-brand-border rounded-xl gap-3 bg-white/50">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-navy truncate">FAQ Updates</p>
                                            <p className="text-[11px] text-brand-muted whitespace-nowrap">All published</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => router.push("/admin/faq")}
                                        className="text-[11px] font-bold text-primary hover:underline whitespace-nowrap shrink-0"
                                    >
                                        View <ChevronRight className="w-3.5 h-3.5 inline" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Alerts & Activity */}
                <div className="space-y-6 lg:space-y-8 min-w-0">
                    <div className="admin-card p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-bold text-navy mb-4 sm:mb-6">System Alerts</h3>
                        <div className="space-y-3 sm:space-y-4">
                            {alerts.length > 0 ? alerts.map((alert, idx) => (
                                <div key={idx} className={cn(
                                    "p-3 sm:p-4 rounded-xl border flex gap-3 group relative transition-all",
                                    alert.type === "error" ? "bg-red-50 border-red-100" :
                                        alert.type === "warning" ? "bg-orange-50 border-orange-100" :
                                            "bg-emerald-50 border-emerald-100"
                                )}>
                                    <AlertCircle className={cn(
                                        "w-5 h-5 mt-0.5 shrink-0",
                                        alert.type === "error" ? "text-red-600" :
                                            alert.type === "warning" ? "text-orange-600" :
                                                "text-emerald-600"
                                    )} />
                                    <div className="flex-1 min-w-0 mr-4 sm:mr-0">
                                        <p className="text-xs sm:text-sm font-bold text-navy line-clamp-1">{alert.title}</p>
                                        <p className="text-[11px] sm:text-xs text-charcoal/80 leading-relaxed mt-1 line-clamp-2">{alert.desc}</p>
                                    </div>
                                    <button
                                        onClick={() => dismissAlert(alert.id)}
                                        className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity p-1.5 hover:bg-black/5 rounded-lg shrink-0 absolute top-2 right-2 sm:static"
                                    >
                                        <X className="w-3.5 h-3.5 text-charcoal/60" />
                                    </button>
                                </div>
                            )) : (
                                <div className="py-10 text-center bg-brand-bg rounded-xl border border-dashed border-brand-border">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-500/50 mx-auto mb-3" />
                                    <p className="text-sm font-bold text-navy">No new alerts</p>
                                    <p className="text-xs text-brand-muted">Everything is running smoothly</p>
                                </div>
                            )}
                        </div>
                        {alerts.length > 0 && (
                            <button
                                onClick={() => setAlerts([])}
                                className="w-full mt-4 sm:mt-6 py-2 sm:py-2.5 text-xs font-bold text-brand-muted hover:text-navy transition-colors border border-brand-border rounded-lg hover:bg-brand-bg/50"
                            >
                                Dismiss All
                            </button>
                        )}
                    </div>

                    <div className="admin-card p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-bold text-navy mb-5 sm:mb-8">Recent Activity</h3>
                        <div className="space-y-6 sm:space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-px before:bg-brand-border">
                            {[
                                { actor: "John Admin", action: "published a blog post", target: "Healthy Heart Tips", time: "2h ago", link: "/admin/blog" },
                                { actor: "Sarah Support", action: "resolved inquiry", target: "Pricing Question", time: "4h ago", link: "/admin/inquiries" },
                                { actor: "System", action: "updated legal document", target: "Privacy Policy", time: "1d ago", link: "/admin/legal" },
                                { actor: "Mike Op", action: "added new doctor", target: "Dr. Rachel Green", time: "1d ago", link: "/admin/doctors" },
                            ].map((activity, idx) => (
                                <div key={idx} className="flex gap-4 relative group">
                                    <div className="w-[23px] h-[23px] rounded-full bg-white border-2 border-primary shrink-0 z-10 shadow-sm group-hover:scale-110 transition-transform"></div>
                                    <div className="flex flex-col min-w-0 pt-0.5">
                                        <div className="text-[13px] sm:text-sm text-charcoal leading-snug">
                                            <span className="font-bold text-navy whitespace-nowrap">{activity.actor}</span> {activity.action}{" "}
                                            <button
                                                onClick={() => router.push(activity.link)}
                                                className="font-bold text-navy hover:text-primary transition-colors underline-offset-2 hover:underline decoration-primary/30 text-left"
                                            >
                                                "{activity.target}"
                                            </button>
                                        </div>
                                        <span className="text-[10px] text-brand-muted mt-1.5 font-medium">{activity.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Book Appointment Modal */}
            <Modal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                title="Book New Appointment"
                maxWidth="max-w-lg"
            >
                <form onSubmit={handleBookAppointment} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-navy">Patient Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                className="input-base"
                                placeholder="e.g. John Doe"
                                value={bookForm.patient}
                                onChange={(e) => setBookForm({ ...bookForm, patient: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-navy">Doctor <span className="text-red-500">*</span></label>
                            <select
                                className="input-base"
                                value={bookForm.doctor}
                                onChange={(e) => setBookForm({ ...bookForm, doctor: e.target.value })}
                            >
                                <option>Dr. Sarah Smith</option>
                                <option>Dr. Michael Chen</option>
                                <option>Dr. Robert Smith</option>
                                <option>Dr. Lisa Wong</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-navy">Time <span className="text-red-500">*</span></label>
                                <input
                                    type="time"
                                    required
                                    className="input-base"
                                    value={bookForm.time}
                                    onChange={(e) => setBookForm({ ...bookForm, time: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-navy">Mode</label>
                                <select
                                    className="input-base"
                                    value={bookForm.mode}
                                    onChange={(e) => setBookForm({ ...bookForm, mode: e.target.value })}
                                >
                                    <option>In-Person</option>
                                    <option>Video</option>
                                    <option>Phone</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="pt-6 border-t border-brand-border flex items-center justify-end gap-3">
                        <button type="button" onClick={() => setIsBookingOpen(false)} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary">
                            <Calendar className="w-4 h-4" /> Book Appointment
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default DashboardPage;
