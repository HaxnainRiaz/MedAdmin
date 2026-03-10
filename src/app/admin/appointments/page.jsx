"use client";

import React, { useState } from "react";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import Modal from "@/components/admin/shared/Modal";
import DataTable from "@/components/admin/shared/DataTable";
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
    CreditCard,
    LayoutList,
    Grid,
    ChevronDown,
    Trash2,
    RefreshCw
} from "lucide-react";
import { cn, formatDate } from "@/lib/admin-utils";
import AppointmentDetailPanel from "@/components/admin/appointments/AppointmentDetailPanel";

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

    // View states
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isSplitView, setIsSplitView] = useState(false);
    const [activeApt, setActiveApt] = useState(null);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [viewMode, setViewMode] = useState("table"); // table, calendar

    // Advanced Filters
    const [filters, setFilters] = useState({
        doctor: "All",
        specialty: "All",
        mode: "All",
        payment: "All"
    });
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Filtering logic
    const filteredAppointments = appointments.filter(apt => {
        const matchesTab = activeTab === "All" || apt.status === activeTab;
        const matchesSearch = apt.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
            apt.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            apt.doctor.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDoctor = filters.doctor === "All" || apt.doctor === filters.doctor;
        const matchesSpecialty = filters.specialty === "All" || apt.specialty === filters.specialty;
        const matchesMode = filters.mode === "All" || apt.mode === filters.mode;
        const matchesPayment = filters.payment === "All" || apt.payment === filters.payment;

        return matchesTab && matchesSearch && matchesDoctor && matchesSpecialty && matchesMode && matchesPayment;
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
        if (window.innerWidth > 1024) {
            setIsSplitView(true);
        } else {
            setIsDetailModalOpen(true);
        }
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-navy">Appointments</h2>
                    <p className="text-brand-muted text-xs sm:text-sm">Manage bookings and schedules.</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex items-center bg-brand-bg p-1 rounded-xl mr-2">
                        <button
                            onClick={() => setViewMode("table")}
                            className={cn("p-2 rounded-lg transition-all", viewMode === "table" ? "bg-white text-primary shadow-sm" : "text-brand-muted")}
                        >
                            <LayoutList className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode("calendar")}
                            className={cn("p-2 rounded-lg transition-all", viewMode === "calendar" ? "bg-white text-primary shadow-sm" : "text-brand-muted")}
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                    </div>
                    <button className="btn-secondary flex-1 sm:flex-none py-2 px-3 text-xs sm:text-sm whitespace-nowrap">
                        <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Export
                    </button>
                    <button className="btn-primary flex-1 sm:flex-none py-2 px-3 text-xs sm:text-sm whitespace-nowrap">
                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        New Booking
                    </button>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {[
                    { label: "Total", value: appointments.length, color: "blue" },
                    { label: "Pending", value: appointments.filter(a => a.status === 'Pending').length, color: "orange" },
                    { label: "Confirmed", value: appointments.filter(a => a.status === 'Confirmed').length, color: "green" },
                    { label: "Cancelled", value: appointments.filter(a => a.status === 'Cancelled').length, color: "red" },
                ].map((stat, idx) => (
                    <div key={idx} className="admin-card p-3 sm:p-4 flex flex-col">
                        <span className="text-[10px] sm:text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1 truncate">{stat.label}</span>
                        <span className="text-lg sm:text-xl font-bold text-navy">{stat.value}</span>
                    </div>
                ))}
            </div>

            {/* Main Table Section */}
            <div className="admin-card overflow-hidden">
                {/* Filters & Search */}
                <div className="p-3 sm:p-4 border-b border-brand-border space-y-3 sm:space-y-4">
                    <div className="flex items-center">
                        {/* Tabs - Scrollable on mobile */}
                        <div className="flex items-center bg-brand-bg p-1 rounded-xl overflow-x-auto scrollbar-hide w-full sm:w-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => { setActiveTab(tab); setSelectedIds([]); }}
                                    className={cn(
                                        "px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-bold rounded-lg transition-all whitespace-nowrap",
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

                    <div className="flex gap-2 sm:gap-4 md:flex-row w-full">
                        <div className="relative flex-1 min-w-0">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted shrink-0" />
                            <input
                                type="text"
                                placeholder="Search patient, doctor, or ID..."
                                className="input-base pl-9 h-10 text-sm w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className={cn("btn-secondary h-10 px-3 flex items-center gap-2 text-sm", isFilterOpen && "bg-primary/5 text-primary border-primary/20")}
                            >
                                <Filter className="w-4 h-4 shrink-0" />
                                <span className="hidden sm:inline">Filters</span>
                                {Object.values(filters).filter(v => v !== 'All').length > 0 && (
                                    <span className="w-5 h-5 bg-primary text-white rounded-full text-[10px] flex items-center justify-center">
                                        {Object.values(filters).filter(v => v !== 'All').length}
                                    </span>
                                )}
                            </button>
                            <button className="btn-secondary h-10 px-3 flex items-center gap-2 text-sm max-w-[120px] sm:max-w-none">
                                <Calendar className="w-4 h-4 shrink-0" />
                                <span className="hidden sm:inline truncate">Date Range</span>
                            </button>
                        </div>
                    </div>

                    {isFilterOpen && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-brand-bg rounded-xl border border-brand-border animate-in slide-in-from-top-2">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-brand-muted uppercase">Doctor</label>
                                <select
                                    className="input-base h-9 text-xs"
                                    value={filters.doctor}
                                    onChange={(e) => setFilters({ ...filters, doctor: e.target.value })}
                                >
                                    <option>All</option>
                                    <option>Dr. Robert Smith</option>
                                    <option>Dr. Lisa Wong</option>
                                    <option>Dr. Sarah Miller</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-brand-muted uppercase">Specialty</label>
                                <select
                                    className="input-base h-9 text-xs"
                                    value={filters.specialty}
                                    onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}
                                >
                                    <option>All</option>
                                    <option>Cardiology</option>
                                    <option>Dermatology</option>
                                    <option>Pediatrics</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-brand-muted uppercase">Mode</label>
                                <select
                                    className="input-base h-9 text-xs"
                                    value={filters.mode}
                                    onChange={(e) => setFilters({ ...filters, mode: e.target.value })}
                                >
                                    <option>All</option>
                                    <option>In-Person</option>
                                    <option>Video</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-brand-muted uppercase">Payment</label>
                                <select
                                    className="input-base h-9 text-xs"
                                    value={filters.payment}
                                    onChange={(e) => setFilters({ ...filters, payment: e.target.value })}
                                >
                                    <option>All</option>
                                    <option>Paid</option>
                                    <option>Unpaid</option>
                                    <option>Refunded</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Table / Calendar View */}
                {viewMode === "table" ? (
                    <div className="flex h-full min-h-[600px] overflow-hidden">
                        <div className={cn("flex-1 transition-all duration-300 overflow-y-auto", isSplitView ? "hidden xl:block" : "block")}>
                            <DataTable
                                headers={[
                                    <input
                                        type="checkbox"
                                        className="rounded border-brand-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                                        onChange={toggleSelectAll}
                                        checked={selectedIds.length === filteredAppointments.length && filteredAppointments.length > 0}
                                    />,
                                    "Ref ID",
                                    "Patient",
                                    "Doctor",
                                    "Schedule",
                                    "Type",
                                    "Status",
                                    { content: "Action", className: "text-right" }
                                ]}
                                mobileContent={filteredAppointments.length > 0 ? filteredAppointments.map((apt, idx) => (
                                    <div key={idx} className="bg-white p-4 rounded-xl border border-brand-border shadow-soft flex flex-col gap-3 relative">
                                        <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-brand-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                                                    checked={selectedIds.includes(apt.id)}
                                                    onChange={() => toggleSelect(apt.id)}
                                                />
                                                <span className="font-bold text-navy text-sm">{apt.id}</span>
                                            </div>
                                            <StatusBadge status={apt.status} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] uppercase tracking-widest text-brand-muted font-bold">Patient</span>
                                                <span className="text-sm font-semibold text-charcoal">{apt.patient}</span>
                                                <span className="text-[10px] text-brand-muted truncate block">{apt.email}</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] uppercase tracking-widest text-brand-muted font-bold">Doctor</span>
                                                <span className="text-sm font-semibold text-charcoal">{apt.doctor}</span>
                                                <span className="text-[10px] text-brand-muted truncate block">{apt.specialty}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1 mt-1">
                                            <span className="text-[10px] uppercase tracking-widest text-brand-muted font-bold">Schedule</span>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1.5 text-navy font-medium text-sm">
                                                    <Calendar className="w-4 h-4 text-brand-muted" /> {formatDate(apt.date)} at {apt.time}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className={cn("px-2 py-1 rounded text-[10px] font-bold", apt.type === 'First Visit' ? 'bg-blue-50 text-primary' : 'bg-brand-bg text-charcoal')}>{apt.type}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pt-3 border-t border-brand-border mt-1">
                                            <button className="w-full btn-secondary text-xs sm:text-sm py-2" onClick={() => openDetails(apt)}>View Details</button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="p-8 text-center text-brand-muted">
                                        <p className="font-bold text-navy text-base">No appointments found</p>
                                    </div>
                                )}
                            >
                                {filteredAppointments.length > 0 ? filteredAppointments.map((apt, idx) => (
                                    <tr key={idx} className={cn("hover:bg-brand-bg/30 transition-colors group cursor-pointer", selectedIds.includes(apt.id) || activeApt?.id === apt.id ? "bg-primary/5 hover:bg-primary/10" : "")} onClick={(e) => {
                                        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
                                            openDetails(apt);
                                        }
                                    }}>
                                        <td onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                className="rounded border-brand-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                                                checked={selectedIds.includes(apt.id)}
                                                onChange={() => toggleSelect(apt.id)}
                                            />
                                        </td>
                                        <td>
                                            <span className="text-sm font-bold text-navy hover:underline">{apt.id}</span>
                                            <p className="text-[10px] text-brand-muted">via {apt.source}</p>
                                        </td>
                                        <td>
                                            <div className="flex flex-col min-w-[120px]">
                                                <span className="text-[13px] font-semibold text-navy">{apt.patient}</span>
                                                <span className="text-[11px] text-brand-muted">{apt.email}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex flex-col min-w-[120px]">
                                                <span className="text-[13px] text-charcoal font-medium">{apt.doctor}</span>
                                                <span className="text-[11px] text-brand-muted">{apt.specialty}</span>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-1.5 text-[13px] text-charcoal font-medium">
                                                    <Calendar className="w-3.5 h-3.5 text-brand-muted" />
                                                    {formatDate(apt.date)}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[11px] text-brand-muted mt-0.5">
                                                    <Clock className="w-3.5 h-3.5 text-primary/60" />
                                                    {apt.time}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={cn(
                                                "inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold border whitespace-nowrap",
                                                apt.mode === "Video" ? "bg-purple-50 text-purple-700 border-purple-100" : "bg-blue-50 text-blue-700 border-blue-100"
                                            )}>
                                                {apt.mode === "Video" ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                                                {apt.mode}
                                            </div>
                                        </td>
                                        <td>
                                            <StatusBadge status={apt.status} />
                                        </td>
                                        <td className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button className="p-2 hover:bg-brand-bg rounded-lg transition-colors text-brand-muted hover:text-primary" onClick={() => openDetails(apt)}>
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <div className="relative group/more">
                                                    <button className="p-2 hover:bg-brand-bg rounded-lg transition-colors text-brand-muted hover:text-navy">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </button>
                                                    <div className="absolute right-0 top-full mt-1 hidden group-hover/more:block z-50 bg-white border border-brand-border rounded-xl shadow-premium p-1 min-w-[140px] text-left">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); alert('Reschedule'); }}
                                                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-navy hover:bg-brand-bg rounded-lg"
                                                        >
                                                            <RefreshCw className="w-3.5 h-3.5" /> Reschedule
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleUpdateStatus(apt.id, 'Cancelled'); }}
                                                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" /> Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-12 text-center text-brand-muted">
                                            <div className="flex flex-col items-center justify-center">
                                                <Calendar className="w-10 h-10 text-brand-border mb-3" />
                                                <p className="font-bold text-navy text-base">No appointments found</p>
                                                <p className="text-xs">Try adjusting your filters or search query.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </DataTable>
                        </div>

                        {/* Side Panel for Split View */}
                        {isSplitView && activeApt && (
                            <div className="w-[450px] shrink-0 border-l border-brand-border">
                                <AppointmentDetailPanel
                                    appointment={activeApt}
                                    onClose={() => setIsSplitView(false)}
                                    onUpdateStatus={handleUpdateStatus}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <div className="max-w-md mx-auto space-y-4">
                            <div className="w-20 h-20 bg-blue-50 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                                <Grid className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-navy">Calendar View Under Development</h3>
                            <p className="text-brand-muted text-sm leading-relaxed">
                                We are integrating a full drag-and-drop calendar for easier doctor scheduling. For now, use the table view for management.
                            </p>
                            <button onClick={() => setViewMode("table")} className="btn-primary px-8">Back to Table</button>
                        </div>
                    </div>
                )}

                {/* Bulk Action Bar */}
                {selectedIds.length > 0 && (
                    <div className="p-3 sm:p-4 bg-navy text-white flex flex-col sm:flex-row items-center justify-between gap-3 animate-in slide-in-from-bottom-2">
                        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                            <span className="text-xs sm:text-sm font-medium whitespace-nowrap">{selectedIds.length} selected</span>
                            <div className="flex items-center gap-2 flex-1">
                                <button className="flex-1 sm:flex-none px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-[11px] font-bold transition-colors" onClick={() => handleBulkStatusChange('Confirmed')}>Confirm</button>
                                <button className="flex-1 sm:flex-none px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-bold transition-colors" onClick={() => handleBulkStatusChange('Cancelled')}>Cancel</button>
                            </div>
                        </div>
                        <button className="text-[11px] text-white/60 hover:text-white transition-colors underline" onClick={() => setSelectedIds([])}>Clear selection</button>
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
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-brand-bg p-3 sm:p-4 rounded-xl border border-brand-border gap-4">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div>
                                    <span className="text-[9px] sm:text-[10px] text-brand-muted uppercase font-black tracking-widest block mb-1">Booking Ref</span>
                                    <span className="font-bold text-navy bg-white px-2 py-1 rounded shadow-sm text-xs sm:text-sm border border-brand-border">{activeApt.id}</span>
                                </div>
                                <div className="h-8 w-px bg-brand-border hidden sm:block"></div>
                                <div>
                                    <span className="text-[9px] sm:text-[10px] text-brand-muted uppercase font-black tracking-widest block mb-1">Current Status</span>
                                    <StatusBadge status={activeApt.status} />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                {activeApt.status === "Pending" && (
                                    <button className="btn-primary flex-1 sm:flex-none py-1.5 text-[11px] sm:text-xs" onClick={() => handleUpdateStatus(activeApt.id, "Confirmed")}>Confirm Booking</button>
                                )}
                                {activeApt.status !== "Cancelled" && (
                                    <button className="btn-secondary flex-1 sm:flex-none py-1.5 text-[11px] sm:text-xs text-red-600 hover:bg-red-50 border-red-100" onClick={() => handleUpdateStatus(activeApt.id, "Cancelled")}>Cancel</button>
                                )}
                            </div>
                        </div>

                        {/* Details grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                            {/* Patient Info */}
                            <div className="space-y-4">
                                <h4 className="text-[11px] font-black text-brand-muted uppercase tracking-widest border-b border-brand-border pb-2 flex items-center gap-2"><UserCircle className="w-4 h-4" /> Patient Info</h4>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-[10px] uppercase text-brand-muted tracking-wider font-bold">Full Name</p>
                                        <p className="text-navy font-bold text-sm sm:text-base">{activeApt.patient}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-brand-muted tracking-wider font-bold">Contact</p>
                                        <div className="flex flex-col gap-1.5 mt-1.5">
                                            <a href={`mailto:${activeApt.email}`} className="text-[13px] text-primary flex items-center gap-2 hover:underline truncate"><Mail className="w-3.5 h-3.5 shrink-0" /> {activeApt.email}</a>
                                            <a href={`tel:${activeApt.phone}`} className="text-[13px] text-charcoal flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-brand-muted shrink-0" /> {activeApt.phone}</a>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-brand-muted tracking-wider font-bold">Payment Status</p>
                                        <p className={cn("text-[11px] font-bold px-2 py-1 mt-1 rounded inline-flex items-center gap-1.5", activeApt.payment === "Paid" ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700")}>
                                            <CreditCard className="w-3 h-3" /> {activeApt.payment}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Schedule Info */}
                            <div className="space-y-4">
                                <h4 className="text-[11px] font-black text-brand-muted uppercase tracking-widest border-b border-brand-border pb-2 flex items-center gap-2"><Calendar className="w-4 h-4" /> Schedule & Provider</h4>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-[10px] uppercase text-brand-muted tracking-wider font-bold">Assigned Provider</p>
                                        <p className="text-navy font-bold text-sm sm:text-base">{activeApt.doctor}</p>
                                        <p className="text-[13px] text-charcoal">{activeApt.specialty}</p>
                                    </div>
                                    <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                                        <p className="text-[10px] uppercase text-primary tracking-wider font-bold flex items-center gap-2"><Clock className="w-3 h-3" /> Date & Time</p>
                                        <div className="mt-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                            <span className="text-base sm:text-lg font-black text-navy">{formatDate(activeApt.date)}</span>
                                            <span className="text-sm font-bold text-primary">{activeApt.time}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-brand-muted tracking-wider font-bold">Appointment Mode</p>
                                        <p className="text-[13px] text-charcoal flex items-center gap-1.5 mt-1.5 font-medium">
                                            {activeApt.mode === "Video" ? <Video className="w-4 h-4 text-purple-600" /> : <MapPin className="w-4 h-4 text-blue-600" />}
                                            {activeApt.mode} Consultation
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notes Section */}
                        <div className="space-y-3 pt-6 border-t border-brand-border">
                            <h4 className="text-[11px] font-black text-brand-muted uppercase tracking-widest flex items-center gap-2"><FileText className="w-4 h-4" /> Patient Notes</h4>
                            <div className="bg-brand-bg rounded-xl p-3 sm:p-4 border border-brand-border">
                                {activeApt.notes ? (
                                    <p className="text-sm text-charcoal italic leading-relaxed">"{activeApt.notes}"</p>
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
