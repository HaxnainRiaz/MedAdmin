"use client";

import React, { useState } from "react";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import Modal from "@/components/admin/shared/Modal";
import DataTable from "@/components/admin/shared/DataTable";
import {
    Search,
    Filter,
    Plus,
    MoreVertical,
    Star,
    MapPin,
    Stethoscope,
    Briefcase,
    Languages,
    Eye,
    Edit2,
    Trash2,
    Download,
    Ban,
    CheckCircle2,
    TrendingUp,
    Users,
    Activity,
    Video,
    Shield,
    ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/admin-utils";
import DoctorDetailPanel from "@/components/admin/doctors/DoctorDetailPanel";

const initialDoctors = [
    { id: "DOC-001", name: "Dr. Robert Smith", title: "Senior Cardiologist", specialty: "Cardiology", experience: "15", rating: 4.9, reviews: 120, status: "Active", featured: true, modes: ["In-Person", "Video"], languages: ["English", "Spanish"], acceptedInsurances: ["Blue Cross", "Aetna", "Cigna"] },
    { id: "DOC-002", name: "Dr. Lisa Wong", title: "Dermatology Specialist", specialty: "Dermatology", experience: "8", rating: 4.7, reviews: 85, status: "Active", featured: false, modes: ["In-Person", "Video"], languages: ["English", "Mandarin"], acceptedInsurances: ["UnitedHealthcare", "Aetna"] },
    { id: "DOC-003", name: "Dr. Michael Chen", title: "Pediatric Surgeon", specialty: "Pediatrics", experience: "12", rating: 4.8, reviews: 94, status: "Inactive", featured: false, modes: ["In-Person"], languages: ["English", "Cantonese"], acceptedInsurances: ["Blue Cross", "Cigna"] },
    { id: "DOC-004", name: "Dr. Sarah Miller", title: "Neurologist", specialty: "Neurology", experience: "10", rating: 5.0, reviews: 56, status: "Active", featured: true, modes: ["In-Person", "Video"], languages: ["English", "French"], acceptedInsurances: ["All Major Insurance"] },
];

const DoctorsPage = () => {
    const [doctors, setDoctors] = useState(initialDoctors);
    const [searchQuery, setSearchQuery] = useState("");

    // View and Selection State
    const [selectedIds, setSelectedIds] = useState([]);
    const [isSplitView, setIsSplitView] = useState(false);
    const [activeDoctor, setActiveDoctor] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState(null);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    // Advanced Filters
    const [filters, setFilters] = useState({
        specialty: "All",
        status: "All"
    });
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "", title: "", specialty: "Cardiology", experience: "", status: "Active", featured: false
    });

    const handleSearch = (e) => setSearchQuery(e.target.value);

    const filteredDoctors = doctors.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSpecialty = filters.specialty === "All" || doc.specialty === filters.specialty;
        const matchesStatus = filters.status === "All" || doc.status === filters.status;

        return matchesSearch && matchesSpecialty && matchesStatus;
    });

    const openCreateModal = () => {
        setEditingDoctor(null);
        setFormData({ name: "", title: "", specialty: "Cardiology", experience: "", status: "Active", featured: false });
        setIsModalOpen(true);
    };

    const openEditModal = (doctor) => {
        setEditingDoctor(doctor);
        setFormData({
            name: doctor.name,
            title: doctor.title,
            specialty: doctor.specialty,
            experience: doctor.experience.replace(' Yrs', ''),
            status: doctor.status,
            featured: doctor.featured
        });
        setIsModalOpen(true);
    };

    const openDetails = (doctor) => {
        setActiveDoctor(doctor);
        if (window.innerWidth > 1024) {
            setIsSplitView(true);
        } else {
            // On mobile, just open edit or a dedicated mobile detail view
            openEditModal(doctor);
        }
    };

    const toggleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(filteredDoctors.map(d => d.id));
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

    const handleBulkStatusChange = (newStatus) => {
        setDoctors(doctors.map(doc =>
            selectedIds.includes(doc.id) ? { ...doc, status: newStatus } : doc
        ));
        setSelectedIds([]);
        triggerSuccessToast();
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to remove this doctor?")) {
            setDoctors(doctors.filter(d => d.id !== id));
            if (activeDoctor?.id === id) {
                setIsSplitView(false);
                setActiveDoctor(null);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingDoctor) {
            setDoctors(doctors.map(d => d.id === editingDoctor.id ? { ...d, ...formData, experience: formData.experience, modes: d.modes, languages: d.languages, rating: d.rating, reviews: d.reviews } : d));
        } else {
            const newDoc = {
                id: `DOC-00${doctors.length + 1}`,
                ...formData,
                experience: formData.experience,
                rating: 0,
                reviews: 0,
                modes: ["In-Person"],
                languages: ["English"]
            };
            setDoctors([newDoc, ...doctors]);
        }

        setIsModalOpen(false);
        triggerSuccessToast();
    };

    const triggerSuccessToast = () => {
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
    };

    return (
        <div className="space-y-6 relative">
            {/* Success Toast */}
            {showSuccessToast && (
                <div className="fixed top-24 right-8 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-premium flex items-center gap-3 z-50 animate-in fade-in slide-in-from-top-4">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-bold text-sm">Action completed successfully!</span>
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-navy">Doctors</h2>
                    <p className="text-brand-muted text-xs sm:text-sm">Manage medical staff profiles and visibility.</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                    <button className="btn-secondary h-10 px-3 text-brand-muted hover:text-navy hidden sm:flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                    <button className="btn-primary flex-1 sm:flex-none py-2 px-3 text-xs sm:text-sm whitespace-nowrap" onClick={openCreateModal}>
                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Add Doctor
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {[
                    { label: "Total Doctors", value: doctors.length, icon: Stethoscope, color: "blue" },
                    { label: "Active Staff", value: doctors.filter(d => d.status === 'Active').length, icon: Shield, color: "green" },
                    { label: "Avg. Rating", value: "4.8", icon: Star, color: "orange" },
                    { label: "Appointments", value: "1.2k", icon: Activity, color: "purple" },
                ].map((stat, idx) => (
                    <div key={idx} className="admin-card p-3 sm:p-4 flex flex-col group hover:border-primary/50 transition-all cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] sm:text-xs font-semibold text-brand-muted uppercase tracking-wider">{stat.label}</span>
                            <div className={cn("p-1.5 rounded-lg",
                                stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                                    stat.color === 'green' ? 'bg-emerald-50 text-emerald-600' :
                                        stat.color === 'orange' ? 'bg-orange-50 text-orange-600' : 'bg-purple-50 text-purple-600'
                            )}>
                                <stat.icon className="w-4 h-4" />
                            </div>
                        </div>
                        <span className="text-lg sm:text-2xl font-bold text-navy">{stat.value}</span>
                    </div>
                ))}
            </div>

            <div className="admin-card p-3 sm:p-4 border-b border-brand-border space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-2 flex-1 w-full relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                        <input
                            type="text"
                            placeholder="Search doctors..."
                            className="input-base pl-10 h-10 text-sm w-full"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full lg:w-auto">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={cn("btn-secondary h-10 px-3 flex items-center gap-2 flex-1 lg:flex-none", isFilterOpen && "bg-primary/5 text-primary border-primary/20")}
                        >
                            <Filter className="w-4 h-4" />
                            <span className="text-xs font-bold">Filters</span>
                        </button>
                        <select className="input-base h-10 text-xs font-bold w-full lg:w-48 bg-brand-bg/10 border-brand-border">
                            <option>Sort by: Popularity</option>
                            <option>Short by: Experience</option>
                            <option>Short by: Rating</option>
                        </select>
                    </div>
                </div>

                {isFilterOpen && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-brand-bg rounded-xl border border-brand-border animate-in slide-in-from-top-2">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Specialty</label>
                            <select
                                className="input-base h-9 text-xs"
                                value={filters.specialty}
                                onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}
                            >
                                <option>All</option>
                                <option>Cardiology</option>
                                <option>Dermatology</option>
                                <option>Pediatrics</option>
                                <option>Neurology</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Status</label>
                            <select
                                className="input-base h-9 text-xs"
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            >
                                <option>All</option>
                                <option>Active</option>
                                <option>Inactive</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button className="btn-secondary h-9 w-full text-xs font-bold" onClick={() => setFilters({ specialty: 'All', status: 'All' })}>Reset Filters</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Table or Split View Layout */}
            <div className="flex overflow-hidden min-h-[600px] admin-card">
                <div className={cn("flex-1 overflow-y-auto transition-all duration-300", isSplitView ? "hidden xl:block" : "block")}>
                    <DataTable
                        headers={[
                            <input
                                key="select-all"
                                type="checkbox"
                                className="rounded border-brand-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                                onChange={toggleSelectAll}
                                checked={selectedIds.length === filteredDoctors.length && filteredDoctors.length > 0}
                            />,
                            "Doctor",
                            "Specialty",
                            { content: "Exp", className: "text-center" },
                            "Rating",
                            { content: "Modes", className: "hidden md:table-cell" },
                            "Status",
                            { content: "Actions", className: "text-right" }
                        ]}
                        mobileContent={filteredDoctors.length > 0 ? filteredDoctors.map((doc, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-xl border border-brand-border shadow-soft flex flex-col gap-4 relative">
                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        className="rounded border-brand-border text-primary focus:ring-primary h-4 w-4 cursor-pointer mt-1"
                                        checked={selectedIds.includes(doc.id)}
                                        onChange={() => toggleSelect(doc.id)}
                                    />
                                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center border border-blue-200 shrink-0">
                                        <Stethoscope className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-sm font-bold text-navy truncate">{doc.name}</span>
                                            {doc.featured && <span className="bg-yellow-100 text-yellow-700 text-[10px] font-black uppercase px-2 py-0.5 rounded">Featured</span>}
                                        </div>
                                        <span className="text-[12px] text-brand-muted mt-0.5">{doc.title}</span>
                                    </div>
                                    <StatusBadge status={doc.status} />
                                </div>

                                <div className="grid grid-cols-2 gap-4 bg-brand-bg/50 p-3 rounded-lg border border-brand-border/50">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] uppercase tracking-widest text-brand-muted font-bold">Specialty</span>
                                        <span className="text-sm font-semibold text-charcoal">{doc.specialty}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] uppercase tracking-widest text-brand-muted font-bold">Experience & Rating</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[11px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">{doc.experience}Yrs</span>
                                            <span className="flex items-center gap-1 text-[11px] font-bold text-charcoal">
                                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                {doc.rating}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button className="flex-1 btn-secondary py-2 text-xs" onClick={() => openEditModal(doc)}>Edit Profile</button>
                                    <button className="flex-1 btn-primary py-2 text-xs" onClick={() => openDetails(doc)}>View Details</button>
                                </div>
                            </div>
                        )) : null}
                    >
                        {filteredDoctors.length > 0 ? filteredDoctors.map((doc, idx) => (
                            <tr key={idx} className={cn("hover:bg-brand-bg/30 transition-colors group cursor-pointer", selectedIds.includes(doc.id) || activeDoctor?.id === doc.id ? "bg-primary/5" : "")} onClick={(e) => {
                                if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
                                    openDetails(doc);
                                }
                            }}>
                                <td onClick={(e) => e.stopPropagation()}>
                                    <input
                                        type="checkbox"
                                        className="rounded border-brand-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                                        checked={selectedIds.includes(doc.id)}
                                        onChange={() => toggleSelect(doc.id)}
                                    />
                                </td>
                                <td className="min-w-[180px]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-100 rounded-xl flex items-center justify-center border border-blue-200 shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                                            <Stethoscope className="w-5 h-5 text-primary group-hover:text-white" />
                                        </div>
                                        <div className="flex flex-col min-w-0 flex-1">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <span className="text-sm font-bold text-navy truncate">{doc.name}</span>
                                                {doc.featured && (
                                                    <span className="bg-yellow-100 text-yellow-700 text-[8px] font-black uppercase px-1.5 py-0.5 rounded shrink-0">Featured</span>
                                                )}
                                            </div>
                                            <span className="text-[11px] text-brand-muted line-clamp-1 leading-tight mt-0.5">{doc.title}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className="text-[13px] font-medium text-charcoal">{doc.specialty}</span>
                                </td>
                                <td className="text-center">
                                    <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-brand-bg border border-brand-border rounded-lg text-[11px] font-black whitespace-nowrap">
                                        {doc.experience}Yrs
                                    </div>
                                </td>
                                <td>
                                    <div className="flex items-center gap-1 text-[13px] font-bold text-navy whitespace-nowrap">
                                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                        {doc.rating}
                                        <span className="text-[10px] text-brand-muted font-normal">({doc.reviews})</span>
                                    </div>
                                </td>
                                <td className="hidden md:table-cell">
                                    <div className="flex flex-wrap gap-1 max-w-[120px]">
                                        {doc.modes.map((m, i) => (
                                            <span key={i} className="px-1.5 py-0.5 bg-brand-bg rounded-[4px] border border-brand-border text-[9px] font-black uppercase text-brand-muted">{m}</span>
                                        ))}
                                    </div>
                                </td>
                                <td>
                                    <StatusBadge status={doc.status} />
                                </td>
                                <td className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <button className="p-2 hover:bg-brand-bg rounded-lg transition-colors text-brand-muted hover:text-primary" onClick={() => openDetails(doc)}>
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <div className="relative group/more">
                                            <button className="p-2 hover:bg-brand-bg rounded-lg transition-colors text-brand-muted hover:text-navy">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                            <div className="absolute right-0 top-full mt-1 hidden group-hover/more:block z-50 bg-white border border-brand-border rounded-xl shadow-premium p-1 min-w-[150px] text-left animate-in fade-in zoom-in-95">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); openEditModal(doc); }}
                                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-navy hover:bg-brand-bg rounded-lg"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); if (confirm('Change status?')) setDoctors(doctors.map(d => d.id === doc.id ? { ...d, status: d.status === 'Active' ? 'Inactive' : 'Active' } : d)); triggerSuccessToast(); }}
                                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-orange-600 hover:bg-orange-50 rounded-lg"
                                                >
                                                    {doc.status === 'Active' ? <Ban className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                                                    {doc.status === 'Active' ? 'Deactivate' : 'Activate'}
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(doc.id); }}
                                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" /> Delete Permanently
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="8" className="px-6 py-20 text-center text-brand-muted">
                                    <div className="flex flex-col items-center justify-center max-w-xs mx-auto">
                                        <Stethoscope className="w-12 h-12 text-brand-border mb-4 opacity-40" />
                                        <p className="font-bold text-navy text-lg mb-1">No doctors found</p>
                                        <p className="text-xs">Adjust your search or filters to find what you're looking for.</p>
                                        <button className="mt-4 text-xs font-bold text-primary hover:underline" onClick={() => setFilters({ specialty: 'All', status: 'All' })}>Reset all filters</button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </DataTable>
                </div>

                {/* Side Panel for Doctor Details */}
                {isSplitView && activeDoctor && (
                    <div className="w-[450px] shrink-0 border-l border-brand-border bg-white shadow-soft z-10 transition-all">
                        <DoctorDetailPanel
                            doctor={activeDoctor}
                            onClose={() => setIsSplitView(false)}
                            onEdit={openEditModal}
                            onDelete={handleDelete}
                        />
                    </div>
                )}
            </div>

            {/* Bulk Actions Bar */}
            {selectedIds.length > 0 && (
                <div className="p-3 sm:p-4 bg-navy text-white flex flex-col sm:flex-row items-center justify-between gap-3 animate-in slide-in-from-bottom-2 sticky bottom-4 z-50 rounded-2xl shadow-premium mx-4">
                    <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                        <span className="text-xs sm:text-sm font-medium whitespace-nowrap">{selectedIds.length} doctors selected</span>
                        <div className="flex items-center gap-2 flex-1">
                            <button className="flex-1 sm:flex-none px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-[11px] font-bold transition-colors" onClick={() => handleBulkStatusChange('Active')}>Activate All</button>
                            <button className="flex-1 sm:flex-none px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-bold transition-colors" onClick={() => handleBulkStatusChange('Inactive')}>Deactivate</button>
                            <button className="flex-1 sm:flex-none px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-[11px] font-bold transition-colors" onClick={() => {
                                if (confirm(`Remove ${selectedIds.length} doctors permanently?`)) {
                                    setDoctors(doctors.filter(d => !selectedIds.includes(d.id)));
                                    setSelectedIds([]);
                                    triggerSuccessToast();
                                }
                            }}>Delete</button>
                        </div>
                    </div>
                    <button className="text-[11px] text-white/60 hover:text-white transition-colors underline" onClick={() => setSelectedIds([])}>Clear selection</button>
                </div>
            )}

            {/* Create/Edit Doctor Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingDoctor ? "Edit Doctor Profile" : "Add New Doctor"}
                maxWidth="max-w-2xl"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-navy">Full Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                className="input-base"
                                placeholder="Dr. Jane Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-navy">Job Title <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                className="input-base"
                                placeholder="Senior Surgeon"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-navy">Specialty <span className="text-red-500">*</span></label>
                            <select
                                className="input-base"
                                value={formData.specialty}
                                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                            >
                                <option>Cardiology</option>
                                <option>Dermatology</option>
                                <option>Pediatrics</option>
                                <option>Neurology</option>
                                <option>General Medicine</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-navy">Experience (Years) <span className="text-red-500">*</span></label>
                            <input
                                type="number"
                                required
                                min="0"
                                className="input-base"
                                placeholder="e.g. 10"
                                value={formData.experience}
                                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-navy">Status</label>
                            <select
                                className="input-base"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option>Active</option>
                                <option>Inactive</option>
                                <option>On Leave</option>
                            </select>
                        </div>
                        <div className="space-y-2 flex items-center pt-8">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded border-brand-border text-primary focus:ring-primary"
                                    checked={formData.featured}
                                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                />
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-navy">Featured Doctor</span>
                                    <span className="text-[10px] text-brand-muted">Display on the website homepage</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-brand-border flex items-center justify-end gap-3">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            {editingDoctor ? "Save Changes" : "Create Profile"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default DoctorsPage;
