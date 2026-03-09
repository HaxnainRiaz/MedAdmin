"use client";

import React, { useState } from "react";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import Modal from "@/components/admin/shared/Modal";
import { mockServices } from "@/lib/admin-data";
import {
    Plus,
    Search,
    Filter,
    Clock,
    Tag,
    MoreHorizontal,
    Edit2,
    Eye,
    BriefcaseMedical,
    Trash2,
    CheckCircle2
} from "lucide-react";

const ServicesPage = () => {
    const [services, setServices] = useState(mockServices);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All Categories");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "", category: "Cardiology", duration: "30 mins", price: "Starts at $50", status: "Active"
    });

    const triggerToast = () => {
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
    };

    const handleSearch = (e) => setSearchQuery(e.target.value);

    // Filtering
    const filteredServices = services.filter(srv => {
        const matchesCategory = categoryFilter === "All Categories" || srv.category === categoryFilter;
        const matchesSearch = srv.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const categories = ["All Categories", ...Array.from(new Set(mockServices.map(s => s.category)))];

    const openCreateModal = () => {
        setEditingService(null);
        setFormData({ name: "", category: "Cardiology", duration: "30 mins", price: "Starts at $50", status: "Active" });
        setIsModalOpen(true);
    };

    const openEditModal = (service) => {
        setEditingService(service);
        setFormData({
            name: service.name,
            category: service.category,
            duration: service.duration,
            price: service.price,
            status: service.status
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this service?")) {
            setServices(services.filter(s => s.id !== id));
            triggerToast();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingService) {
            setServices(services.map(s => s.id === editingService.id ? { ...s, ...formData } : s));
        } else {
            const newSrv = {
                id: `SRV-${services.length + 100}`,
                ...formData
            };
            setServices([newSrv, ...services]);
        }

        setIsModalOpen(false);
        triggerToast();
    };

    return (
        <div className="space-y-6 relative">
            {/* Success Toast */}
            {showSuccessToast && (
                <div className="fixed top-24 right-8 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-premium flex items-center gap-3 z-50 animate-in fade-in slide-in-from-top-4">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-bold text-sm">Service catalog updated!</span>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-navy">Service Catalog</h2>
                    <p className="text-brand-muted text-sm">Manage medical procedures, pricing, and booking settings.</p>
                </div>
                <button className="btn-primary" onClick={openCreateModal}>
                    <Plus className="w-4 h-4" />
                    Create Service
                </button>
            </div>

            <div className="admin-card overflow-hidden">
                <div className="p-4 border-b border-brand-border flex flex-wrap items-center justify-between gap-4">
                    <div className="relative flex-1 min-w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                        <input
                            type="text"
                            placeholder="Search services..."
                            className="input-base pl-10"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            className="input-base text-sm w-40"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            {categories.map((cat, idx) => (
                                <option key={idx} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-brand-bg/50 text-[10px] uppercase tracking-wider text-brand-muted font-bold">
                                <th className="px-6 py-4">Service Name</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Duration</th>
                                <th className="px-6 py-4">Price Label</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border">
                            {filteredServices.length > 0 ? filteredServices.map((service, idx) => (
                                <tr key={idx} className="hover:bg-brand-bg/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-brand-bg rounded-xl flex items-center justify-center border border-brand-border shrink-0">
                                                <BriefcaseMedical className="w-4 h-4 text-primary" />
                                            </div>
                                            <span className="text-sm font-bold text-navy">{service.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg border border-blue-100">{service.category}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-xs text-charcoal font-medium">
                                            <Clock className="w-3.5 h-3.5 text-brand-muted" />
                                            {service.duration}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-xs text-navy font-bold">
                                            <Tag className="w-3.5 h-3.5 text-emerald-500" />
                                            {service.price}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={service.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 hover:bg-brand-bg rounded-lg transition-colors text-brand-muted hover:text-primary" onClick={() => openEditModal(service)}>
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 hover:bg-red-50 rounded-lg transition-colors text-brand-muted hover:text-red-500" onClick={() => handleDelete(service.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-brand-muted">
                                        <div className="flex flex-col items-center justify-center">
                                            <BriefcaseMedical className="w-12 h-12 text-brand-border mb-3" />
                                            <p className="font-bold text-navy text-lg">No services found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingService ? "Edit Service" : "Create New Service"}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-navy">Service Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                className="input-base"
                                placeholder="Consultation"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-navy">Category <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                className="input-base"
                                placeholder="Cardiology"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-navy">Average Duration</label>
                                <input
                                    type="text"
                                    className="input-base"
                                    placeholder="45 mins"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-navy">Price Label</label>
                                <input
                                    type="text"
                                    className="input-base"
                                    placeholder="Starts at $150"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-navy">Status</label>
                            <select
                                className="input-base"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option>Active</option>
                                <option>Draft</option>
                                <option>Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-brand-border flex items-center justify-end gap-3">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            {editingService ? "Save Changes" : "Create Service"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ServicesPage;
