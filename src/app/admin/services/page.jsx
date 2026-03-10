"use client";

import React, { useState } from "react";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import Modal from "@/components/admin/shared/Modal";
import DataTable from "@/components/admin/shared/DataTable";
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

import { cn } from "@/lib/admin-utils";

const ServicesPage = () => {
    const [services, setServices] = useState(mockServices);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All Categories");
    const [statusFilter, setStatusFilter] = useState("All Status");
    const [selectedIds, setSelectedIds] = useState([]);

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

    // Selection Handlers
    const toggleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(filteredServices.map(s => s.id));
        } else {
            setSelectedIds([]);
        }
    };

    const toggleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    // Bulk Actions
    const handleBulkDelete = () => {
        if (confirm(`Are you sure you want to delete ${selectedIds.length} services?`)) {
            setServices(services.filter(s => !selectedIds.includes(s.id)));
            setSelectedIds([]);
            triggerToast();
        }
    };

    const handleBulkStatusChange = (newStatus) => {
        setServices(services.map(s =>
            selectedIds.includes(s.id) ? { ...s, status: newStatus } : s
        ));
        setSelectedIds([]);
        triggerToast();
    };

    // Filtering
    const filteredServices = services.filter(srv => {
        const matchesCategory = categoryFilter === "All Categories" || srv.category === categoryFilter;
        const matchesStatus = statusFilter === "All Status" || srv.status === statusFilter;
        const matchesSearch = srv.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch && matchesStatus;
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
            setSelectedIds(prev => prev.filter(selId => selId !== id));
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
                <div className="fixed top-24 right-8 bg-navy text-white px-6 py-3 rounded-xl shadow-premium flex items-center gap-3 z-50 animate-in fade-in slide-in-from-top-4 border border-white/10">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="font-bold text-sm">Service catalog updated successfully</span>
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-navy">Service Catalog</h2>
                    <p className="text-brand-muted text-xs sm:text-sm">Manage medical procedures, durations and pricing.</p>
                </div>
                <button className="btn-primary flex-1 sm:flex-none py-2 px-3 text-xs sm:text-sm whitespace-nowrap" onClick={openCreateModal}>
                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Create Service
                </button>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {[
                    { label: "Total Services", value: services.length, color: "blue" },
                    { label: "Active", value: services.filter(s => s.status === 'Active').length, color: "green" },
                    { label: "Avg Price", value: "$85.00", color: "orange" },
                    { label: "Drafts", value: services.filter(s => s.status === 'Draft').length, color: "purple" }
                ].map((stat, idx) => (
                    <div key={idx} className="admin-card p-3 sm:p-4 flex flex-col">
                        <span className="text-[10px] sm:text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1 truncate">{stat.label}</span>
                        <span className="text-lg sm:text-xl font-bold text-navy">{stat.value}</span>
                    </div>
                ))}
            </div>

            <div className="admin-card overflow-hidden">
                <div className="p-3 sm:p-4 border-b border-brand-border flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
                    <div className="relative flex-1 w-full lg:min-w-[400px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                        <input
                            type="text"
                            placeholder="Search procedures, descriptions..."
                            className="input-base pl-10 h-10 text-sm"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full lg:w-auto">
                        <select
                            className="input-base text-xs sm:text-sm h-10 w-full lg:w-44"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            {categories.map((cat, idx) => (
                                <option key={idx} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <select
                            className="input-base text-xs sm:text-sm h-10 w-full lg:w-36"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option>All Status</option>
                            <option>Active</option>
                            <option>Draft</option>
                            <option>Inactive</option>
                        </select>
                        <button className="btn-secondary h-10 px-3 shrink-0">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <DataTable
                    headers={[
                        <input
                            type="checkbox"
                            className="rounded border-brand-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                            onChange={toggleSelectAll}
                            checked={selectedIds.length === filteredServices.length && filteredServices.length > 0}
                        />,
                        "Service",
                        "Category",
                        { content: "Details", className: "hidden sm:table-cell" },
                        "Status",
                        { content: "Actions", className: "text-right" }
                    ]}
                >
                    {filteredServices.length > 0 ? filteredServices.map((service, idx) => (
                        <tr key={idx} className={cn("hover:bg-brand-bg/30 transition-colors group", selectedIds.includes(service.id) ? "bg-primary/5" : "")}>
                            <td>
                                <input
                                    type="checkbox"
                                    className="rounded border-brand-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                                    checked={selectedIds.includes(service.id)}
                                    onChange={() => toggleSelect(service.id)}
                                />
                            </td>
                            <td>
                                <div className="flex items-center gap-3 min-w-[200px]">
                                    <div className="w-9 h-9 bg-brand-bg rounded-xl flex items-center justify-center border border-brand-border shrink-0">
                                        <BriefcaseMedical className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm font-bold text-navy">{service.name}</span>
                                        <div className="sm:hidden flex items-center gap-2 mt-0.5">
                                            <span className="text-[10px] text-charcoal font-bold">{service.price}</span>
                                            <span className="text-[10px] text-brand-muted">• {service.duration}</span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] sm:text-[11px] font-bold rounded-lg border border-blue-100 whitespace-nowrap">{service.category}</span>
                            </td>
                            <td className="hidden sm:table-cell">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5 text-xs text-navy font-bold">
                                        <Tag className="w-3 h-3 text-emerald-500" />
                                        {service.price}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[11px] text-brand-muted">
                                        <Clock className="w-3 h-3" />
                                        {service.duration}
                                    </div>
                                </div>
                            </td>
                            <td>
                                <StatusBadge status={service.status} />
                            </td>
                            <td className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                    <button className="p-2 hover:bg-brand-bg rounded-lg transition-colors text-brand-muted hover:text-navy" onClick={() => openEditModal(service)}>
                                        <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                    <button className="p-2 hover:bg-red-50 rounded-lg transition-colors text-brand-muted hover:text-red-500" onClick={() => handleDelete(service.id)}>
                                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="6" className="px-6 py-12 text-center text-brand-muted">
                                <div className="flex flex-col items-center justify-center">
                                    <BriefcaseMedical className="w-10 h-10 text-brand-border mb-3" />
                                    <p className="font-bold text-navy text-base">No services found</p>
                                    <p className="text-xs">Adjust your search or filters to find what you are looking for.</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </DataTable>

                {/* Bulk Action Bar */}
                {selectedIds.length > 0 && (
                    <div className="p-3 sm:p-4 bg-navy text-white flex flex-col sm:flex-row items-center justify-between gap-3 animate-in slide-in-from-bottom-2">
                        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                            <span className="text-xs sm:text-sm font-medium whitespace-nowrap">{selectedIds.length} services selected</span>
                            <div className="flex items-center gap-2 flex-1">
                                <button className="flex-1 sm:flex-none px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-[11px] font-bold transition-colors" onClick={() => handleBulkStatusChange('Active')}>Activate</button>
                                <button className="flex-1 sm:flex-none px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-bold transition-colors" onClick={() => handleBulkStatusChange('Draft')}>Move to Draft</button>
                                <button className="flex-1 sm:flex-none px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-[11px] font-bold transition-colors" onClick={handleBulkDelete}>Delete</button>
                            </div>
                        </div>
                        <button className="text-[11px] text-white/60 hover:text-white transition-colors underline" onClick={() => setSelectedIds([])}>Clear selection</button>
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingService ? "Edit Service" : "Create New Service"}
                maxWidth="max-w-md"
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
                            <select
                                className="input-base"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                {categories.filter(c => c !== 'All Categories').map((cat, idx) => (
                                    <option key={idx} value={cat}>{cat}</option>
                                ))}
                            </select>
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
