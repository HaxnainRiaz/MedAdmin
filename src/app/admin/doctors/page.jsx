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
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/admin-utils";

const initialDoctors = [
    { id: "DOC-001", name: "Dr. Robert Smith", title: "Senior Cardiologist", specialty: "Cardiology", experience: "15", rating: 4.9, reviews: 120, status: "Active", featured: true, modes: ["In-Person", "Video"], languages: ["English", "Spanish"] },
    { id: "DOC-002", name: "Dr. Lisa Wong", title: "Dermatology Specialist", specialty: "Dermatology", experience: "8", rating: 4.7, reviews: 85, status: "Active", featured: false, modes: ["In-Person", "Video"], languages: ["English", "Mandarin"] },
    { id: "DOC-003", name: "Dr. Michael Chen", title: "Pediatric Surgeon", specialty: "Pediatrics", experience: "12", rating: 4.8, reviews: 94, status: "Inactive", featured: false, modes: ["In-Person"], languages: ["English", "Cantonese"] },
    { id: "DOC-004", name: "Dr. Sarah Miller", title: "Neurologist", specialty: "Neurology", experience: "10", rating: 5.0, reviews: 56, status: "Active", featured: true, modes: ["In-Person", "Video"], languages: ["English", "French"] },
];

const DoctorsPage = () => {
    const [doctors, setDoctors] = useState(initialDoctors);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState(null);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "", title: "", specialty: "Cardiology", experience: "", status: "Active", featured: false
    });

    const handleSearch = (e) => setSearchQuery(e.target.value);

    const filteredDoctors = doctors.filter(doc =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to remove this doctor?")) {
            setDoctors(doctors.filter(d => d.id !== id));
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

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-navy">Doctors</h2>
                    <p className="text-brand-muted text-xs sm:text-sm">Manage medical staff profiles and visibility.</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                    <button className="btn-secondary flex-1 sm:flex-none py-2 px-3 text-xs sm:text-sm">Download</button>
                    <button className="btn-primary flex-1 sm:flex-none py-2 px-3 text-xs sm:text-sm" onClick={openCreateModal}>
                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="whitespace-nowrap">Add Doctor</span>
                    </button>
                </div>
            </div>

            {/* Filters & Controls */}
            <div className="admin-card p-3 sm:p-4 flex flex-col lg:flex-row gap-3 sm:gap-4 items-center justify-between">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                    <input
                        type="text"
                        placeholder="Search doctors..."
                        className="input-base pl-10 h-10 text-sm"
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>
                <div className="flex items-center gap-2 w-full lg:w-auto">
                    <select className="input-base text-sm py-1.5 h-10 min-w-[120px] sm:min-w-[160px] flex-1">
                        <option>All Specialties</option>
                        <option>Cardiology</option>
                        <option>Dermatology</option>
                        <option>Pediatrics</option>
                        <option>Neurology</option>
                    </select>
                    <button className="btn-secondary h-10 px-3 shrink-0">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Table View */}
            <div className="admin-card overflow-hidden">
                <DataTable
                    headers={[
                        "Doctor",
                        "Specialty",
                        { content: "Exp", className: "text-center" },
                        "Rating",
                        { content: "Modes", className: "hidden md:table-cell" },
                        "Status",
                        { content: "Actions", className: "text-right" }
                    ]}
                >
                    {filteredDoctors.length > 0 ? filteredDoctors.map((doc, idx) => (
                        <tr key={idx} className="hover:bg-brand-bg/30 transition-colors group">
                            <td className="min-w-[180px]">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-100 rounded-xl flex items-center justify-center border border-blue-200 shrink-0">
                                        <Stethoscope className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <span className="text-sm font-bold text-navy">{doc.name}</span>
                                            {doc.featured && (
                                                <span className="bg-yellow-100 text-yellow-700 text-[8px] font-black uppercase px-1.5 py-0.5 rounded shrink-0">Featured</span>
                                            )}
                                        </div>
                                        <span className="text-[11px] text-brand-muted line-clamp-2 leading-tight mt-0.5">{doc.title}</span>
                                    </div>
                                </div>
                            </td>
                            <td className="capitalize text-charcoal whitespace-nowrap">
                                <span className="text-[13px]">{doc.specialty}</span>
                            </td>
                            <td className="text-center">
                                <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-brand-bg rounded-lg text-[11px] font-semibold whitespace-nowrap">
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
                                        <span key={i} className="px-1.5 py-0.5 bg-brand-bg rounded text-[10px] font-semibold text-charcoal/80">{m}</span>
                                    ))}
                                </div>
                            </td>
                            <td>
                                <StatusBadge status={doc.status} />
                            </td>
                            <td className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                    <button className="p-2 hover:bg-brand-bg rounded-lg transition-colors text-brand-muted hover:text-navy" onClick={() => openEditModal(doc)} title="Edit Doctor">
                                        <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                    <button className="p-2 hover:bg-red-50 rounded-lg transition-colors text-brand-muted hover:text-red-500" onClick={() => handleDelete(doc.id)} title="Delete Doctor">
                                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="7" className="px-6 py-12 text-center text-brand-muted">
                                <div className="flex flex-col items-center justify-center">
                                    <Stethoscope className="w-10 h-10 text-brand-border mb-3" />
                                    <p className="font-bold text-navy text-base">No doctors found</p>
                                    <p className="text-xs">We couldn't find any matching profiles.</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </DataTable>
            </div>

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
