"use client";

import React, { useState } from "react";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import Modal from "@/components/admin/shared/Modal";
import { useToast } from "@/components/admin/shared/ToastProvider";
import {
    Building2,
    MapPin,
    PhoneCall,
    Clock,
    Plus,
    Search,
    MoreVertical,
    Route,
    Trash2,
    CheckCircle2
} from "lucide-react";

import { cn } from "@/lib/admin-utils";

export const initialLocations = [
    { id: "LOC-01", name: "Main Clinic Centre", address: "123 Healthcare Blvd, Downtown, Metropolis", phone: "+1 (555) 123-4567", hours: "Mon-Sat: 8AM-8PM", status: "Active", primary: true },
    { id: "LOC-02", name: "Westside Branch", address: "456 Wellness Way, Westside, Metropolis", phone: "+1 (555) 987-6543", hours: "Mon-Fri: 9AM-6PM", status: "Active", primary: false },
    { id: "LOC-03", name: "North Pediatrics", address: "789 Kids Lane, North Hills, Metropolis", phone: "+1 (555) 456-7890", hours: "Mon-Fri: 9AM-5PM", status: "Maintenance", primary: false },
];

const LocationsPage = () => {
    const { triggerToast } = useToast();
    const [locations, setLocations] = useState(initialLocations);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLocation, setEditingLocation] = useState(null);

    const [formData, setFormData] = useState({
        name: "", address: "", phone: "", hours: "", status: "Active", primary: false
    });

    const openCreateModal = () => {
        setEditingLocation(null);
        setFormData({ name: "", address: "", phone: "", hours: "", status: "Active", primary: false });
        setIsModalOpen(true);
    };

    const openEditModal = (loc) => {
        setEditingLocation(loc);
        setFormData({ ...loc });
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to remove this location?")) {
            setLocations(locations.filter(l => l.id !== id));
            triggerToast("Location removed successfully", "success");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // If making primary, un-primary others
        let updatedLocs = [...locations];
        if (formData.primary) {
            updatedLocs = updatedLocs.map(l => ({ ...l, primary: false }));
        }

        if (editingLocation) {
            setLocations(updatedLocs.map(l => l.id === editingLocation.id ? { ...l, ...formData } : l));
            triggerToast("Location updated successfully", "success");
        } else {
            const newLoc = {
                id: `LOC-0${locations.length + 1}`,
                ...formData
            };
            setLocations([...updatedLocs, newLoc]);
            triggerToast("New location added successfully", "success");
        }

        setIsModalOpen(false);
    };

    const filteredLocations = locations.filter(loc =>
        loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-navy">Clinic Network</h2>
                    <p className="text-brand-muted text-xs sm:text-sm">Manage physical clinic branches, addresses, and hours.</p>
                </div>
                <button
                    className="btn-primary h-10 px-4 text-xs sm:text-sm"
                    onClick={openCreateModal}
                >
                    <Plus className="w-4 h-4" />
                    Add Location
                </button>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {[
                    { label: "Total Centers", value: locations.length },
                    { label: "Active Nodes", value: locations.filter(l => l.status === 'Active').length },
                    { label: "Maintenance", value: locations.filter(l => l.status === 'Maintenance').length },
                    { label: "Primary HQ", value: locations.filter(l => l.primary).length }
                ].map((stat, idx) => (
                    <div key={idx} className="admin-card p-3 sm:p-4 flex flex-col">
                        <span className="text-[10px] sm:text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1 truncate">{stat.label}</span>
                        <span className="text-lg sm:text-xl font-bold text-navy">{stat.value}</span>
                    </div>
                ))}
            </div>

            {/* Filter Bar */}
            <div className="admin-card p-3 sm:p-4">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                    <input
                        type="text"
                        placeholder="Search locations by name or address..."
                        className="input-base pl-10 h-10 text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {filteredLocations.length > 0 ? filteredLocations.map((loc, idx) => (
                    <div key={idx} className="admin-card p-4 sm:p-6 relative overflow-hidden group hover:shadow-premium transition-all">
                        {loc.primary && (
                            <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-700 text-[9px] sm:text-[10px] font-black uppercase px-2 py-1 rounded-md">
                                Primary Branch
                            </div>
                        )}

                        <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-brand-bg rounded-xl sm:rounded-2xl flex items-center justify-center border border-brand-border text-primary shrink-0 group-hover:scale-105 transition-transform">
                                <Building2 className="w-5 h-5 sm:w-7 sm:h-7" />
                            </div>
                            <div className="pt-0.5 sm:pt-1 pr-12">
                                <h3 className="text-base sm:text-xl font-bold text-navy mb-1 line-clamp-1">{loc.name}</h3>
                                <StatusBadge status={loc.status} />
                            </div>
                        </div>

                        <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                            <div className="flex items-start gap-2 sm:gap-3">
                                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-muted shrink-0 mt-0.5" />
                                <span className="text-xs sm:text-sm font-medium text-charcoal">{loc.address}</span>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3">
                                <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-muted shrink-0" />
                                <span className="text-xs sm:text-sm font-medium text-charcoal">{loc.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3">
                                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-muted shrink-0" />
                                <span className="text-xs sm:text-sm font-medium text-charcoal">{loc.hours}</span>
                            </div>
                        </div>

                        <div className="border-t border-brand-border pt-3 sm:pt-4 flex items-center justify-between">
                            <button
                                className="text-[10px] sm:text-xs font-bold text-brand-muted hover:text-navy flex items-center gap-1.5 sm:gap-2"
                                onClick={() => triggerToast(`Opening map for ${loc.name}`, "info")}
                            >
                                <Route className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> View Map
                            </button>
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <button
                                    className="p-1.5 sm:p-2 hover:bg-red-50 text-brand-muted hover:text-red-500 rounded-lg transition-colors shrink-0"
                                    onClick={() => handleDelete(loc.id)}
                                >
                                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </button>
                                <button
                                    className="btn-secondary py-1 text-[10px] sm:text-xs px-2 sm:px-3 h-8 sm:h-9"
                                    onClick={() => openEditModal(loc)}
                                >
                                    Edit Details
                                </button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="lg:col-span-2 admin-card p-12 text-center">
                        <MapPin className="w-12 h-12 text-brand-border mx-auto mb-3" />
                        <p className="font-bold text-navy text-lg">No locations found</p>
                        <p className="text-sm text-brand-muted mt-1">Try adjusting your search query.</p>
                    </div>
                )}

                {/* Empty State / Add New */}
                <button
                    className="admin-card p-4 sm:p-6 border-dashed border-2 hover:border-primary/50 hover:bg-brand-bg/50 transition-colors flex flex-col items-center justify-center text-center min-h-[220px] sm:min-h-[280px]"
                    onClick={openCreateModal}
                >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-brand-bg rounded-full flex items-center justify-center mb-3 sm:mb-4 text-brand-muted">
                        <Plus className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-navy mb-1 sm:mb-2">Add New Location</h3>
                    <p className="text-[11px] sm:text-sm text-brand-muted max-w-xs px-2">Open a new branch or add an administrative office to your network.</p>
                </button>
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingLocation ? "Edit Location" : "Add New Location"}
                maxWidth="max-w-2xl"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-bold text-navy">Location Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                className="input-base"
                                placeholder="e.g. Northside Branch"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-bold text-navy">Full Address <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                className="input-base"
                                placeholder="e.g. 123 Health Ave, Suite 200, City"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-navy">Phone Number <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                className="input-base"
                                placeholder="+1 (555) 000-0000"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-navy">Operating Hours <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                className="input-base"
                                placeholder="Mon-Fri: 9AM-5PM"
                                value={formData.hours}
                                onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
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
                                <option>Maintenance</option>
                            </select>
                        </div>
                        <div className="space-y-2 flex items-center pt-8">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded border-brand-border text-primary focus:ring-primary"
                                    checked={formData.primary}
                                    onChange={(e) => setFormData({ ...formData, primary: e.target.checked })}
                                />
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-navy">Primary Branch</span>
                                    <span className="text-[10px] text-brand-muted">Set as the main headquarters</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-brand-border flex items-center justify-end gap-3">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            {editingLocation ? "Save Changes" : "Create Location"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default LocationsPage;
