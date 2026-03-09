"use client";

import React, { useState } from "react";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import Modal from "@/components/admin/shared/Modal";
import {
    Search,
    Filter,
    Download,
    Plus,
    MoreHorizontal,
    Mail,
    Phone,
    Calendar,
    Clock,
    MapPin,
    ChevronLeft,
    ChevronRight,
    Eye,
    CheckCircle2,
    Video,
    UserCircle,
    FileText,
    CreditCard
} from "lucide-react";
import { cn, formatDate } from "@/lib/admin-utils";

const initialAppointments = [
    { id: "APT-1042", patient: "Sarah Johnson", email: "sarah.j@example.com", phone: "+1 (555) 123-4567", doctor: "Dr. Robert Smith", specialty: "Cardiology", date: "2024-03-24", time: "09:00 AM", mode: "In-Person", source: "Website", status: "Confirmed", payment: "Paid", notes: "First time visit, complained about mild chest pain." },
    { id: "APT-1041", patient: "Michael Brown", email: "m.brown@gmail.com", phone: "+1 (555) 987-6543", doctor: "Dr. Lisa Wong", specialty: "Dermatology", date: "2024-03-24", time: "10:30 AM", mode: "Video", source: "Mobile App", status: "Pending", payment: "Unpaid", notes: "Routine skin checkup." },
    { id: "APT-1040", patient: "Emma Davis", email: "emma.d@outlook.com", phone: "+1 (555) 456-7890", doctor: "Dr. Robert Smith", specialty: "Cardiology", date: "2024-03-24", time: "11:15 AM", mode: "In-Person", source: "Website", status: "Confirmed", payment: "Paid", notes: "Follow up on ECG results." },
    { id: "APT-1039", patient: "David Wilson", email: "david.w@example.com", phone: "+1 (555) 222-3333", doctor: "Dr. Sarah Miller", specialty: "Pediatrics", date: "2024-03-25", time: "03:00 PM", mode: "In-Person", source: "Direct", status: "Cancelled", payment: "Refunded", notes: "Patient cancelled due to conflict." },
    { id: "APT-1038", patient: "Olivia Martinez", email: "olivia.m@example.com", phone: "+1 (555) 888-9999", doctor: "Dr. Lisa Wong", specialty: "Dermatology", date: "2024-03-25", time: "04:30 PM", mode: "Video", source: "Website", status: "Confirmed", payment: "Paid", notes: "" },
];

const tabs = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];

const AppointmentsPage = () => {
    const [appointments, setAppointments] = useState(initialAppointments);
    const [activeTab, setActiveTab] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    // Selection state
    const [selectedIds, setSelectedIds] = useState([]);

    // Modal states
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [activeApt, setActiveApt] = useState(null);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    // Filtering
    const filteredAppointments = appointments.filter(apt => {
        const matchesTab = activeTab === "All" || apt.status === activeTab;
        const matchesSearch = apt.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
            apt.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            apt.doctor.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const triggerToast = () => {
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
    };

    // Selection Handlers
    const toggleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(filteredAppointments.map(a => a.id));
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

    // Bulk Actions
    const handleBulkStatusChange = (newStatus) => {
        setAppointments(appointments.map(apt =>
            selectedIds.includes(apt.id) ? { ...apt, status: newStatus } : apt
        ));
        setSelectedIds([]);
        triggerToast();
    };

    // Single Action Updates
    const handleUpdateStatus = (id, newStatus) => {
        setAppointments(appointments.map(apt => apt.id === id ? { ...apt, status: newStatus } : apt));
        setIsDetailModalOpen(false);
        triggerToast();
    };

    const openDetails = (apt) => {
        setActiveApt(apt);
        setIsDetailModalOpen(true);
    };

    return (
        <div className="space-y-6 relative">
            {/* Success Toast */}
            {showSuccessToast && (
                <div className="fixed top-24 right-8 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-premium flex items-center gap-3 z-50 animate-in fade-in slide-in-from-top-4">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-bold text-sm">Appointments updated successfully!</span>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-navy">Appointments</h2>
                    <p className="text-brand-muted text-sm">Manage all booking requests and clinic schedules.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-secondary">
                        <Download className="w-4 h-4" />
                        Export Form
                    </button>
                    <button className="btn-primary">
                        <Plus className="w-4 h-4" />
                        New Booking
                    </button>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Bookings", value: appointments.length, color: "blue" },
                    { label: "Pending Review", value: appointments.filter(a => a.status === 'Pending').length, color: "orange" },
                    { label: "Confirmed", value: appointments.filter(a => a.status === 'Confirmed').length, color: "green" },
                    { label: "Cancelled", value: appointments.filter(a => a.status === 'Cancelled').length, color: "red" },
                ].map((stat, idx) => (
                    <div key={idx} className="admin-card p-4 flex flex-col">
                        <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1">{stat.label}</span>
                        <span className="text-xl font-bold text-navy">{stat.value}</span>
                    </div>
                ))}
            </div>

            {/* Main Table Section */}
            <div className="admin-card overflow-hidden">
                {/* Filters & Search */}
                <div className="p-4 border-b border-brand-border space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        {/* Tabs */}
                        <div className="flex items-center bg-brand-bg p-1 rounded-xl">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => { setActiveTab(tab); setSelectedIds([]); }}
                                    className={cn(
                                        "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                                        activeTab === tab
                                            ? "bg-white text-primary shadow-sm"
                                            : "text-brand-muted hover:text-navy"
                                    )}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                            <input
                                type="text"
                                placeholder="Search by patient name, ID, or doctor..."
                                className="input-base pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="btn-secondary h-10 px-3">
                                <Calendar className="w-4 h-4" /> Date Range
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-brand-bg/50 text-[10px] uppercase tracking-wider text-brand-muted font-bold">
                                <th className="px-6 py-4 w-12">
                                    <input
                                        type="checkbox"
                                        className="rounded border-brand-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                                        onChange={toggleSelectAll}
                                        checked={selectedIds.length === filteredAppointments.length && filteredAppointments.length > 0}
                                    />
                                </th>
                                <th className="px-6 py-4">Appointment ID</th>
                                <th className="px-6 py-4">Patient Details</th>
                                <th className="px-6 py-4">Doctor & Specialty</th>
                                <th className="px-6 py-4">Date & Time</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border">
                            {filteredAppointments.length > 0 ? filteredAppointments.map((apt, idx) => (
                                <tr key={idx} className={cn("hover:bg-brand-bg/30 transition-colors group cursor-pointer", selectedIds.includes(apt.id) ? "bg-primary/5 hover:bg-primary/10" : "")} onClick={(e) => {
                                    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
                                        openDetails(apt);
                                    }
                                }}>
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            className="rounded border-brand-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                                            checked={selectedIds.includes(apt.id)}
                                            onChange={() => toggleSelect(apt.id)}
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-navy hover:underline">{apt.id}</span>
                                        <p className="text-[10px] text-brand-muted mt-0.5">Via {apt.source}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-navy">{apt.patient}</span>
                                            <span className="text-[10px] text-brand-muted mt-0.5">{apt.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm text-charcoal font-medium">{apt.doctor}</span>
                                            <span className="text-[10px] text-brand-muted">{apt.specialty}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-1.5 text-sm text-charcoal font-medium">
                                                <Calendar className="w-3.5 h-3.5 text-brand-muted" />
                                                {formatDate(apt.date)}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-brand-muted mt-1">
                                                <Clock className="w-3.5 h-3.5 text-primary/60" />
                                                {apt.time}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={cn(
                                            "inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold border",
                                            apt.mode === "Video" ? "bg-purple-50 text-purple-700 border-purple-100" : "bg-blue-50 text-blue-700 border-blue-100"
                                        )}>
                                            {apt.mode === "Video" ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                                            {apt.mode}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={apt.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 hover:bg-brand-bg rounded-lg transition-colors text-brand-muted hover:text-primary" onClick={() => openDetails(apt)}>
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-brand-muted">
                                        <div className="flex flex-col items-center justify-center">
                                            <Calendar className="w-12 h-12 text-brand-border mb-3" />
                                            <p className="font-bold text-navy text-lg">No appointments found</p>
                                            <p className="text-sm">We couldn't find any data matching your filters.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Bulk Action Bar */}
                {selectedIds.length > 0 && (
                    <div className="p-4 bg-navy text-white flex items-center justify-between animate-in slide-in-from-bottom-2">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium">{selectedIds.length} item(s) selected</span>
                            <div className="flex items-center gap-2">
                                <button className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-xs font-bold transition-colors" onClick={() => handleBulkStatusChange('Confirmed')}>Confirm All</button>
                                <button className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-200 rounded-lg text-xs font-bold transition-colors" onClick={() => handleBulkStatusChange('Cancelled')}>Cancel All</button>
                            </div>
                        </div>
                        <button className="text-xs text-white/60 hover:text-white transition-colors underline" onClick={() => setSelectedIds([])}>Clear Selection</button>
                    </div>
                )}
            </div>

            {/* Appointment Detail Modal */}
            <Modal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                title="Appointment Details"
                maxWidth="max-w-3xl"
            >
                {activeApt && (
                    <div className="space-y-8">
                        {/* Status banner */}
                        <div className="flex items-center justify-between bg-brand-bg p-4 rounded-xl border border-brand-border">
                            <div className="flex items-center gap-4">
                                <div>
                                    <span className="text-[10px] text-brand-muted uppercase font-black tracking-widest block mb-1">Booking Ref</span>
                                    <span className="font-bold text-navy bg-white px-2 py-1 rounded shadow-sm text-sm border border-brand-border">{activeApt.id}</span>
                                </div>
                                <div className="h-8 w-px bg-brand-border"></div>
                                <div>
                                    <span className="text-[10px] text-brand-muted uppercase font-black tracking-widest block mb-1">Current Status</span>
                                    <StatusBadge status={activeApt.status} />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {activeApt.status === "Pending" && (
                                    <button className="btn-primary py-1.5 text-xs" onClick={() => handleUpdateStatus(activeApt.id, "Confirmed")}>Confirm Booking</button>
                                )}
                                {activeApt.status !== "Cancelled" && (
                                    <button className="btn-secondary py-1.5 text-xs text-red-600 hover:bg-red-50" onClick={() => handleUpdateStatus(activeApt.id, "Cancelled")}>Cancel</button>
                                )}
                            </div>
                        </div>

                        {/* Details grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Patient Info */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-black text-brand-muted uppercase tracking-widest border-b border-brand-border pb-2 flex items-center gap-2"><UserCircle className="w-4 h-4" /> Patient Info</h4>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-[10px] uppercase text-brand-muted tracking-wider font-bold">Full Name</p>
                                        <p className="text-navy font-bold">{activeApt.patient}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-brand-muted tracking-wider font-bold">Contact</p>
                                        <div className="flex flex-col gap-1 mt-1">
                                            <a href={`mailto:${activeApt.email}`} className="text-sm text-primary flex items-center gap-2 hover:underline"><Mail className="w-3.5 h-3.5" /> {activeApt.email}</a>
                                            <a href={`tel:${activeApt.phone}`} className="text-sm text-charcoal flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-brand-muted" /> {activeApt.phone}</a>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-brand-muted tracking-wider font-bold">Payment Status</p>
                                        <p className={cn("text-xs font-bold px-2 py-1 mt-1 rounded inline-flex items-center gap-1.5", activeApt.payment === "Paid" ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700")}>
                                            <CreditCard className="w-3 h-3" /> {activeApt.payment}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Schedule Info */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-black text-brand-muted uppercase tracking-widest border-b border-brand-border pb-2 flex items-center gap-2"><Calendar className="w-4 h-4" /> Schedule & Provider</h4>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-[10px] uppercase text-brand-muted tracking-wider font-bold">Assigned Provider</p>
                                        <p className="text-navy font-bold">{activeApt.doctor}</p>
                                        <p className="text-xs text-charcoal">{activeApt.specialty}</p>
                                    </div>
                                    <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                                        <p className="text-[10px] uppercase text-primary tracking-wider font-bold flex items-center gap-2"><Clock className="w-3 h-3" /> Date & Time</p>
                                        <div className="mt-1 flex items-baseline gap-2">
                                            <span className="text-lg font-black text-navy">{formatDate(activeApt.date)}</span>
                                            <span className="text-sm font-bold text-primary">{activeApt.time}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-brand-muted tracking-wider font-bold">Appointment Mode</p>
                                        <p className="text-sm text-charcoal flex items-center gap-1.5 mt-1 font-medium">
                                            {activeApt.mode === "Video" ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                                            {activeApt.mode} Consultation
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notes Section */}
                        <div className="space-y-3 pt-6 border-t border-brand-border">
                            <h4 className="text-xs font-black text-brand-muted uppercase tracking-widest flex items-center gap-2"><FileText className="w-4 h-4" /> Patient Notes / Problem</h4>
                            <div className="bg-brand-bg rounded-xl p-4 border border-brand-border">
                                {activeApt.notes ? (
                                    <p className="text-sm text-charcoal italic">"{activeApt.notes}"</p>
                                ) : (
                                    <p className="text-sm text-brand-muted">No notes provided by the patient.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AppointmentsPage;
