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

export const initialLocations = [
    { id: "LOC-01", name: "Main Clinic Centre", address: "123 Healthcare Blvd, Downtown, Metropolis", phone: "+1 (555) 123-4567", hours: "Mon-Sat: 8AM-8PM", status: "Active", primary: true },
    { id: "LOC-02", name: "Westside Branch", address: "456 Wellness Way, Westside, Metropolis", phone: "+1 (555) 987-6543", hours: "Mon-Fri: 9AM-6PM", status: "Active", primary: false },
    { id: "LOC-03", name: "North Pediatrics", address: "789 Kids Lane, North Hills, Metropolis", phone: "+1 (555) 456-7890", hours: "Mon-Fri: 9AM-5PM", status: "Maintenance", primary: false },
];

const LocationsPage = () => {
    const { triggerToast } = useToast();
    const [locations, setLocations] = useState(initialLocations);
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

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-navy">Clinic Locations</h2>
                    <p className="text-brand-muted text-sm">Manage physical clinic branches, addresses, and hours.</p>
                </div>
                <button
                    className="btn-primary"
                    onClick={openCreateModal}
                >
                    <Plus className="w-4 h-4" />
                    Add Location
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {locations.map((loc, idx) => (
                    <div key={idx} className="admin-card p-6 relative overflow-hidden group hover:shadow-premium transition-all">
                        {loc.primary && (
                            <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase px-2 py-1 rounded-md">
                                Primary Branch
                            </div>
                        )}

                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-14 h-14 bg-brand-bg rounded-2xl flex items-center justify-center border border-brand-border text-primary shrink-0 group-hover:scale-105 transition-transform">
                                <Building2 className="w-7 h-7" />
                            </div>
                            <div className="pt-1 pr-6">
                                <h3 className="text-xl font-bold text-navy mb-1">{loc.name}</h3>
                                <StatusBadge status={loc.status} />
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-brand-muted shrink-0 mt-0.5" />
                                <span className="text-sm font-medium text-charcoal">{loc.address}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <PhoneCall className="w-4 h-4 text-brand-muted shrink-0" />
                                <span className="text-sm font-medium text-charcoal">{loc.phone}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="w-4 h-4 text-brand-muted shrink-0" />
                                <span className="text-sm font-medium text-charcoal">{loc.hours}</span>
                            </div>
                        </div>

                        <div className="border-t border-brand-border pt-4 flex items-center justify-between">
                            <button
                                className="text-xs font-bold text-brand-muted hover:text-navy flex items-center gap-2"
                                onClick={() => triggerToast(`Opening map for ${loc.name}`, "info")}
                            >
                                <Route className="w-4 h-4" /> View Map
                            </button>
                            <div className="flex items-center gap-2">
                                <button
                                    className="p-1.5 hover:bg-red-50 text-brand-muted hover:text-red-500 rounded-lg transition-colors"
                                    onClick={() => handleDelete(loc.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <button
                                    className="btn-secondary py-1.5 px-3 text-xs"
                                    onClick={() => openEditModal(loc)}
                                >
                                    Edit Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Empty State / Add New */}
                <button
                    className="admin-card p-6 border-dashed border-2 hover:border-primary/50 hover:bg-brand-bg/50 transition-colors flex flex-col items-center justify-center text-center min-h-[280px]"
                    onClick={openCreateModal}
                >
                    <div className="w-16 h-16 bg-brand-bg rounded-full flex items-center justify-center mb-4 text-brand-muted">
                        <Plus className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-navy mb-2">Add New Location</h3>
                    <p className="text-sm text-brand-muted max-w-xs">Open a new branch or add an administrative office to your network.</p>
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
