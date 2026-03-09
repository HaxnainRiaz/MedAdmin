"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import KpiCard from "@/components/admin/dashboard/KpiCard";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import Modal from "@/components/admin/shared/Modal";
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi, idx) => (
                    <KpiCard key={idx} {...kpi} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Recent Appointments */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="admin-card">
                        <div className="p-6 border-b border-brand-border flex items-center justify-between">
                            <h3 className="text-lg font-bold text-navy">Upcoming Appointments</h3>
                            <button
                                className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline"
                                onClick={() => router.push("/admin/appointments")}
                            >
                                View all <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-brand-bg text-[10px] uppercase tracking-wider text-brand-muted font-bold">
                                        <th className="px-6 py-4">ID</th>
                                        <th className="px-6 py-4">Patient</th>
                                        <th className="px-6 py-4">Doctor</th>
                                        <th className="px-6 py-4">Time</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-border text-sm">
                                    {recentAppointments.map((apt, idx) => (
                                        <tr key={idx} className="hover:bg-brand-bg/50 transition-colors group relative">
                                            <td className="px-6 py-4 font-medium text-navy">{apt.id}</td>
                                            <td className="px-6 py-4 text-charcoal">{apt.patient}</td>
                                            <td className="px-6 py-4 text-charcoal">{apt.doctor}</td>
                                            <td className="px-6 py-4 text-charcoal">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5 text-brand-muted" />
                                                    {apt.time}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={apt.status} />
                                            </td>
                                            <td className="px-6 py-4 relative">
                                                <button
                                                    onClick={() => setActiveAptPopup(activeAptPopup === apt.id ? null : apt.id)}
                                                    className="p-1.5 hover:bg-brand-bg rounded-lg transition-colors"
                                                >
                                                    <MoreVertical className="w-4 h-4 text-brand-muted" />
                                                </button>
                                                {activeAptPopup === apt.id && (
                                                    <div className="absolute right-4 top-12 z-50 bg-white border border-brand-border rounded-xl shadow-premium p-1 min-w-[180px]">
                                                        <button onClick={() => { router.push("/admin/appointments"); setActiveAptPopup(null); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-navy hover:bg-brand-bg rounded-lg transition-colors font-medium">
                                                            <Eye className="w-4 h-4 text-brand-muted" /> View Details
                                                        </button>
                                                        <button onClick={() => changeAptStatus(apt.id, "Confirmed")} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors font-medium">
                                                            <CheckCircle2 className="w-4 h-4" /> Confirm
                                                        </button>
                                                        <button onClick={() => changeAptStatus(apt.id, "Cancelled")} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium">
                                                            <X className="w-4 h-4" /> Cancel
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="admin-card p-6">
                            <h3 className="text-lg font-bold text-navy mb-4">Operations Status</h3>
                            <div className="space-y-4">
                                {[
                                    { label: "Phone Support", status: "Active", time: "08:00 - 20:00" },
                                    { label: "Critical Inquiries", status: "2 Pending", time: "Last check: 5m ago" },
                                    { label: "Server Load", status: "Normal", time: "99.9% uptime" }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-brand-bg rounded-xl">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-navy">{item.label}</span>
                                            <span className="text-xs text-brand-muted">{item.time}</span>
                                        </div>
                                        <StatusBadge status={item.status} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="admin-card p-6">
                            <h3 className="text-lg font-bold text-navy mb-4">Content Summary</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 border border-brand-border rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-navy">Draft Posts</p>
                                            <p className="text-xs text-brand-muted">5 waiting review</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => router.push("/admin/blog")}
                                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                                    >
                                        Review <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-3 border border-brand-border rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-navy">FAQ Updates</p>
                                            <p className="text-xs text-brand-muted">All items published</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => router.push("/admin/faq")}
                                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                                    >
                                        View <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Alerts & Activity */}
                <div className="space-y-6">
                    <div className="admin-card p-6">
                        <h3 className="text-lg font-bold text-navy mb-4">System Alerts</h3>
                        <div className="space-y-3">
                            {alerts.length > 0 ? alerts.map((alert, idx) => (
                                <div key={idx} className={cn(
                                    "p-4 rounded-xl border flex gap-3 group relative",
                                    alert.type === "error" ? "bg-red-50 border-red-100" :
                                        alert.type === "warning" ? "bg-orange-50 border-orange-100" :
                                            "bg-emerald-50 border-emerald-100"
                                )}>
                                    <AlertCircle className={cn(
                                        "w-5 h-5 shrink-0",
                                        alert.type === "error" ? "text-red-600" :
                                            alert.type === "warning" ? "text-orange-600" :
                                                "text-emerald-600"
                                    )} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-navy">{alert.title}</p>
                                        <p className="text-xs text-charcoal/80 leading-relaxed mt-0.5">{alert.desc}</p>
                                    </div>
                                    <button
                                        onClick={() => dismissAlert(alert.id)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 p-0.5 hover:bg-black/10 rounded"
                                    >
                                        <X className="w-3.5 h-3.5 text-charcoal/60" />
                                    </button>
                                </div>
                            )) : (
                                <div className="py-6 text-center">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                                    <p className="text-sm font-bold text-navy">All clear!</p>
                                    <p className="text-xs text-brand-muted">No system alerts</p>
                                </div>
                            )}
                        </div>
                        {alerts.length > 0 && (
                            <button
                                onClick={() => setAlerts([])}
                                className="w-full mt-4 py-2 text-xs font-bold text-brand-muted hover:text-navy transition-colors"
                            >
                                Dismiss All
                            </button>
                        )}
                    </div>

                    <div className="admin-card p-6">
                        <h3 className="text-lg font-bold text-navy mb-4">Recent Activity</h3>
                        <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-px before:bg-brand-border">
                            {[
                                { actor: "John Admin", action: "published a blog post", target: "Healthy Heart Tips", time: "2h ago", link: "/admin/blog" },
                                { actor: "Sarah Support", action: "resolved inquiry", target: "Pricing Question", time: "4h ago", link: "/admin/inquiries" },
                                { actor: "System", action: "updated legal document", target: "Privacy Policy", time: "1d ago", link: "/admin/legal" },
                                { actor: "Mike Op", action: "added new doctor", target: "Dr. Rachel Green", time: "1d ago", link: "/admin/doctors" },
                            ].map((activity, idx) => (
                                <div key={idx} className="flex gap-4 relative">
                                    <div className="w-[22px] h-[22px] rounded-full bg-white border-2 border-primary shrink-0 z-10"></div>
                                    <div className="flex flex-col">
                                        <p className="text-sm text-charcoal">
                                            <span className="font-bold text-navy">{activity.actor}</span> {activity.action}{" "}
                                            <button
                                                onClick={() => router.push(activity.link)}
                                                className="font-bold text-navy hover:text-primary transition-colors underline-offset-2 hover:underline"
                                            >
                                                "{activity.target}"
                                            </button>
                                        </p>
                                        <span className="text-[10px] text-brand-muted mt-1 font-medium">{activity.time}</span>
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
