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

const SpecialtiesPage = () => {
    const { triggerToast } = useToast();
    const [specialties, setSpecialties] = useState(initialSpecialties);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSpecialty, setEditingSpecialty] = useState(null);

    const [formData, setFormData] = useState({
        name: "", slug: "", status: "Active", doctors: 0, services: 0
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
        }
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
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-navy">Specialties</h2>
                    <p className="text-brand-muted text-xs sm:text-sm">Manage medical categories and slugs.</p>
                </div>
                <button
                    className="btn-primary flex-1 sm:flex-none py-2 px-3 text-xs sm:text-sm whitespace-nowrap"
                    onClick={openCreateModal}
                >
                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Add Specialty
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {specialties.map((spec, idx) => (
                    <div key={idx} className="admin-card p-4 sm:p-6 flex flex-col group transition-all hover:shadow-premium relative">
                        <div className="flex items-start justify-between mb-4 sm:mb-6">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 text-primary rounded-2xl flex items-center justify-center border border-blue-100 group-hover:scale-110 transition-transform">
                                <Shapes className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <StatusBadge status={spec.status} />
                                <div className="flex items-center gap-0.5 sm:gap-1">
                                    <button
                                        className="p-1.5 hover:bg-brand-bg rounded-lg text-brand-muted hover:text-navy transition-colors"
                                        onClick={() => openEditModal(spec)}
                                    >
                                        <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                    <button
                                        className="p-1.5 hover:bg-red-50 rounded-lg text-brand-muted hover:text-red-500 transition-colors"
                                        onClick={() => handleDelete(spec.id)}
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
                                <div className="flex items-center gap-1 sm:gap-1.5">
                                    <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-muted shrink-0" />
                                    <span className="text-[11px] sm:text-xs font-bold text-navy">{spec.doctors}</span>
                                    <span className="text-[10px] text-brand-muted hidden xs:inline">Doctors</span>
                                </div>
                                <div className="flex items-center gap-1 sm:gap-1.5">
                                    <Activity className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-muted shrink-0" />
                                    <span className="text-[11px] sm:text-xs font-bold text-navy">{spec.services}</span>
                                    <span className="text-[10px] text-brand-muted hidden xs:inline">Services</span>
                                </div>
                            </div>
                            <button
                                className="text-primary text-[11px] sm:text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all shrink-0"
                                onClick={() => openEditModal(spec)}
                            >
                                Manage <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            </button>
                        </div>
                    </div>
                ))}

                <button
                    className="border-2 border-dashed border-brand-border rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center text-center hover:border-primary/50 hover:bg-white transition-all group min-h-[180px] sm:min-h-[220px]"
                    onClick={openCreateModal}
                >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-bg flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                        <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-brand-muted group-hover:text-primary" />
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-navy">Append Specialty</p>
                    <p className="text-[10px] text-brand-muted mt-1 uppercase tracking-widest font-black">Fast Create</p>
                </button>
            </div>

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
                        <button type="submit" className="btn-primary">
                            {editingSpecialty ? "Save Changes" : "Create Specialty"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default SpecialtiesPage;
