"use client";

import React, { useState } from "react";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import Modal from "@/components/admin/shared/Modal";
import { mockSpecialties as initialSpecialties } from "@/lib/admin-data";
import { useToast } from "@/components/admin/shared/ToastProvider";
import {
    Plus,
    Search,
    MoreVertical,
    Shapes,
    User,
    Activity,
    ArrowRight,
    Edit2,
    Trash2
} from "lucide-react";
import { cn } from "@/lib/admin-utils";

const SpecialtiesPage = () => {
    const { triggerToast } = useToast();
    const [specialties, setSpecialties] = useState(initialSpecialties);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSpecialty, setEditingSpecialty] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Status");
    const [selectedIds, setSelectedIds] = useState([]);

    const [formData, setFormData] = useState({
        name: "", slug: "", status: "Active", doctors: 0, services: 0
    });

    const filteredSpecialties = specialties.filter(spec => {
        const matchesSearch = spec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            spec.slug.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "All Status" || spec.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const openCreateModal = () => {
        setEditingSpecialty(null);
        setFormData({ name: "", slug: "", status: "Active", doctors: 0, services: 0 });
        setIsModalOpen(true);
    };

    const openEditModal = (spec) => {
        setEditingSpecialty(spec);
        setFormData({ ...spec });
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this specialty?")) {
            setSpecialties(specialties.filter(s => s.id !== id));
            triggerToast("Specialty deleted successfully", "success");
            setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
        }
    };

    const toggleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleBulkDelete = () => {
        if (confirm(`Are you sure you want to delete ${selectedIds.length} categories?`)) {
            setSpecialties(specialties.filter(s => !selectedIds.includes(s.id)));
            setSelectedIds([]);
            triggerToast("Selected specialties deleted", "success");
        }
    };

    const handleBulkStatusChange = (newStatus) => {
        setSpecialties(specialties.map(s =>
            selectedIds.includes(s.id) ? { ...s, status: newStatus } : s
        ));
        setSelectedIds([]);
        triggerToast(`Status updated to ${newStatus}`, "success");
    };

    const generateSlug = (name) => {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        setFormData({ ...formData, name, slug: generateSlug(name) });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingSpecialty) {
            setSpecialties(specialties.map(s => s.id === editingSpecialty.id ? { ...s, ...formData } : s));
            triggerToast("Specialty updated successfully", "success");
        } else {
            const newSpec = {
                id: `SPEC-${Date.now()}`,
                ...formData
            };
            setSpecialties([...specialties, newSpec]);
            triggerToast("New specialty added successfully", "success");
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6 relative">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-navy">Specialties</h2>
                    <p className="text-brand-muted text-xs sm:text-sm">Manage medical categories and SEO slugs.</p>
                </div>
                <button
                    className="btn-primary flex-1 sm:flex-none py-2 px-3 text-xs sm:text-sm whitespace-nowrap"
                    onClick={openCreateModal}
                >
                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Add Specialty
                </button>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {[
                    { label: "Categories", value: specialties.length, color: "blue" },
                    { label: "Active", value: specialties.filter(s => s.status === 'Active').length, color: "green" },
                    { label: "Total Doctors", value: specialties.reduce((acc, s) => acc + (parseInt(s.doctors) || 0), 0), color: "orange" },
                    { label: "Total Services", value: specialties.reduce((acc, s) => acc + (parseInt(s.services) || 0), 0), color: "purple" }
                ].map((stat, idx) => (
                    <div key={idx} className="admin-card p-3 sm:p-4 flex flex-col">
                        <span className="text-[10px] sm:text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1 truncate">{stat.label}</span>
                        <span className="text-lg sm:text-xl font-bold text-navy">{stat.value}</span>
                    </div>
                ))}
            </div>

            {/* Filters Bar */}
            <div className="admin-card p-3 sm:p-4 border-b border-brand-border flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted shrink-0" />
                    <input
                        type="text"
                        placeholder="Search categories or slugs..."
                        className="input-base pl-10 h-10 text-sm w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <select
                        className="input-base h-10 text-sm py-1.5 w-36"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option>All Status</option>
                        <option>Active</option>
                        <option>Inactive</option>
                    </select>
                </div>
            </div>

            {/* Main Grid Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredSpecialties.length > 0 ? filteredSpecialties.map((spec, idx) => (
                    <div
                        key={idx}
                        className={cn(
                            "admin-card p-4 sm:p-6 flex flex-col group transition-all hover:shadow-premium relative overflow-hidden",
                            selectedIds.includes(spec.id) ? "border-primary bg-primary/5 shadow-premium ring-1 ring-primary/20" : ""
                        )}
                        onClick={() => toggleSelect(spec.id)}
                    >
                        {/* Corner Checkbox */}
                        <div className="absolute top-2 left-2 z-10">
                            <input
                                type="checkbox"
                                className="rounded border-brand-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                                checked={selectedIds.includes(spec.id)}
                                onChange={(e) => {
                                    e.stopPropagation();
                                    toggleSelect(spec.id);
                                }}
                            />
                        </div>

                        <div className="flex items-start justify-between mb-4 sm:mb-6">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 text-primary rounded-2xl flex items-center justify-center border border-blue-100 group-hover:scale-110 transition-transform">
                                <Shapes className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div className="flex items-center gap-1.5 sm:gap-2" onClick={(e) => e.stopPropagation()}>
                                <StatusBadge status={spec.status} />
                                <div className="flex items-center gap-0.5 sm:gap-1">
                                    <button
                                        className="p-1.5 hover:bg-brand-bg rounded-lg text-brand-muted hover:text-navy transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openEditModal(spec);
                                        }}
                                    >
                                        <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                    <button
                                        className="p-1.5 hover:bg-red-50 rounded-lg text-brand-muted hover:text-red-500 transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(spec.id);
                                        }}
                                    >
                                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-navy mb-1 truncate">{spec.name}</h3>
                        <p className="text-[11px] sm:text-xs text-brand-muted mb-4 sm:mb-6 truncate">slug: /{spec.slug}</p>

                        <div className="mt-auto pt-4 sm:pt-6 border-t border-brand-border flex items-center justify-between">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="flex items-center gap-1 sm:gap-1.5 font-medium">
                                    <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-muted shrink-0" />
                                    <span className="text-[11px] sm:text-xs font-bold text-navy">{spec.doctors}</span>
                                    <span className="text-[10px] text-brand-muted hidden xs:inline">Doctors</span>
                                </div>
                                <div className="flex items-center gap-1 sm:gap-1.5 font-medium">
                                    <Activity className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-muted shrink-0" />
                                    <span className="text-[11px] sm:text-xs font-bold text-navy">{spec.services}</span>
                                    <span className="text-[10px] text-brand-muted hidden xs:inline">Services</span>
                                </div>
                            </div>
                            <button
                                className="text-primary text-[11px] sm:text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all shrink-0"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openEditModal(spec);
                                }}
                            >
                                Manage <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center text-center">
                        <Shapes className="w-12 h-12 text-brand-border mb-3" />
                        <p className="font-bold text-navy">No specialties found matching your query.</p>
                        <button
                            onClick={() => { setSearchQuery(""); setStatusFilter("All Status"); }}
                            className="text-primary text-xs font-bold mt-2 hover:underline"
                        >
                            Reset filters
                        </button>
                    </div>
                )}

                <button
                    className="border-2 border-dashed border-brand-border rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center text-center hover:border-primary/50 hover:bg-white transition-all group min-h-[180px] sm:min-h-[220px]"
                    onClick={openCreateModal}
                >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-bg flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                        <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-brand-muted group-hover:text-primary" />
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-navy">Create New Category</p>
                    <p className="text-[10px] text-brand-muted mt-1 uppercase tracking-widest font-black">Add Specialties</p>
                </button>
            </div>

            {/* Bulk Action Bar */}
            {selectedIds.length > 0 && (
                <div className="sticky bottom-6 left-0 right-0 z-50 px-4">
                    <div className="mx-auto max-w-4xl bg-navy text-white rounded-2xl p-4 shadow-premium flex items-center justify-between gap-4 animate-in slide-in-from-bottom-8">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-bold">{selectedIds.length} categories selected</span>
                            <div className="w-px h-6 bg-white/20"></div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleBulkStatusChange('Active')}
                                    className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-xs font-bold transition-colors"
                                >
                                    Activate
                                </button>
                                <button
                                    onClick={() => handleBulkStatusChange('Inactive')}
                                    className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-colors"
                                >
                                    Deactivate
                                </button>
                                <button
                                    onClick={handleBulkDelete}
                                    className="px-4 py-1.5 bg-red-500 hover:bg-red-600 rounded-lg text-xs font-bold transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedIds([])}
                            className="text-xs font-bold text-white/60 hover:text-white transition-colors"
                        >
                            Deselect all
                        </button>
                    </div>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingSpecialty ? "Edit Specialty" : "Add New Specialty"}
                maxWidth="max-w-md"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-navy">Specialty Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                className="input-base"
                                placeholder="e.g. Cardiology"
                                value={formData.name}
                                onChange={handleNameChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-navy">URL Slug <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                className="input-base bg-brand-bg/50"
                                placeholder="cardiology"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            />
                            <p className="text-[10px] text-brand-muted">Used for the website URL: medify.com/specialties/<strong>{formData.slug || 'slug'}</strong></p>
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
                            </select>
                        </div>
                    </div>
                    <div className="pt-6 border-t border-brand-border flex items-center justify-end gap-3">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={!formData.name || !formData.slug}>
                            {editingSpecialty ? "Save Changes" : "Create Specialty"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default SpecialtiesPage;
