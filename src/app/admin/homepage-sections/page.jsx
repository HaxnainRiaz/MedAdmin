"use client";

import React, { useState } from "react";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import Modal from "@/components/admin/shared/Modal";
import {
    PanelsTopLeft,
    Plus,
    Eye,
    Settings2,
    Image as ImageIcon,
    Type,
    GripVertical,
    MoreVertical,
    Trash2,
    ToggleLeft,
    ToggleRight
} from "lucide-react";
import { cn } from "@/lib/admin-utils";
import { useToast } from "@/components/admin/shared/ToastProvider";

const sectionTypes = ["Hero", "Stats", "Featured Items", "Carousel", "Testimonials", "Call to Action", "Gallery", "Team", "FAQ Preview"];

const initialSections = [
    { id: "SEC-1", title: "Hero Banner", type: "Hero", status: "Published", order: 1, lastEdited: "Today" },
    { id: "SEC-2", title: "Trust Badges & Stats", type: "Stats", status: "Published", order: 2, lastEdited: "Last Week" },
    { id: "SEC-3", title: "Core Services Intro", type: "Featured Items", status: "Published", order: 3, lastEdited: "2 Weeks Ago" },
    { id: "SEC-4", title: "Meet Available Doctors", type: "Carousel", status: "Published", order: 4, lastEdited: "Yesterday" },
    { id: "SEC-5", title: "Patient Testimonials", type: "Testimonials", status: "Draft", order: 5, lastEdited: "3 Days Ago" },
    { id: "SEC-6", title: "Final CTA to Book", type: "Call to Action", status: "Published", order: 6, lastEdited: "Last Month" },
];

const HomepageSectionsPage = () => {
    const { triggerToast } = useToast();
    const [sections, setSections] = useState(initialSections);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ title: "", type: "Hero", status: "Draft" });

    const handleAddSection = (e) => {
        e.preventDefault();
        const newSection = {
            id: `SEC-${Date.now()}`,
            ...formData,
            order: sections.length + 1,
            lastEdited: "Just Now"
        };
        setSections([...sections, newSection]);
        setIsModalOpen(false);
        setFormData({ title: "", type: "Hero", status: "Draft" });
        triggerToast(`Section "${newSection.title}" added`, "success");
    };

    const toggleStatus = (id) => {
        setSections(sections.map(sec => {
            if (sec.id === id) {
                const newStatus = sec.status === "Published" ? "Draft" : "Published";
                triggerToast(`${sec.title} set to ${newStatus}`, newStatus === "Published" ? "success" : "info");
                return { ...sec, status: newStatus };
            }
            return sec;
        }));
    };

    const deleteSection = (id) => {
        const sec = sections.find(s => s.id === id);
        if (confirm(`Are you sure you want to remove the "${sec.title}" section?`)) {
            setSections(sections.filter(s => s.id !== id));
            triggerToast(`"${sec.title}" removed`, "success");
        }
    };

    const getSectionIcon = (type) => {
        switch (type) {
            case "Hero": return <ImageIcon className="w-6 h-6 text-primary" />;
            case "Stats": return <Type className="w-6 h-6 text-blue-500" />;
            default: return <PanelsTopLeft className="w-6 h-6 text-brand-muted" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-navy">Homepage Components</h2>
                    <p className="text-brand-muted text-sm">Control the layout, content blocks, and visibility of the front page.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        className="btn-secondary"
                        onClick={() => triggerToast("Opening live preview...", "info")}
                    >
                        <Eye className="w-4 h-4" />
                        Live Preview
                    </button>
                    <button
                        className="btn-primary"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <Plus className="w-4 h-4" />
                        Add Section
                    </button>
                </div>
            </div>

            <div className="admin-card overflow-hidden">
                <div className="p-4 border-b border-brand-border flex justify-between items-center">
                    <span className="font-bold text-navy text-sm">Active Sections ({sections.length})</span>
                    <span className="text-brand-muted italic text-sm">Click a section to configure it</span>
                </div>

                <div className="p-4 space-y-3">
                    {sections.map((sec) => (
                        <div key={sec.id} className="flex items-center gap-4 p-4 border border-brand-border rounded-xl bg-white hover:border-primary/30 hover:shadow-sm transition-all group">
                            <button className="text-brand-muted hover:text-navy cursor-grab active:cursor-grabbing shrink-0">
                                <GripVertical className="w-5 h-5" />
                            </button>
                            <div className="w-12 h-12 bg-brand-bg rounded-lg border border-brand-border flex items-center justify-center shrink-0">
                                {getSectionIcon(sec.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-navy truncate">{sec.title}</h4>
                                <div className="flex items-center gap-3 mt-1 text-[10px] text-brand-muted uppercase font-bold tracking-widest">
                                    <span>Type: {sec.type}</span>
                                    <span className="w-1 h-1 rounded-full bg-brand-border"></span>
                                    <span>Edited {sec.lastEdited}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                <StatusBadge status={sec.status} />
                                <div className="w-px h-6 bg-brand-border"></div>
                                <button
                                    className="btn-secondary py-1.5 px-3 text-xs"
                                    onClick={() => triggerToast(`Configuring "${sec.title}"`, "info")}
                                >
                                    <Settings2 className="w-3.5 h-3.5" /> Configure
                                </button>
                                <button
                                    className={cn("p-1.5 rounded-lg transition-colors", sec.status === "Published" ? "text-emerald-500 hover:bg-emerald-50" : "text-brand-muted hover:bg-brand-bg")}
                                    onClick={() => toggleStatus(sec.id)}
                                    title={sec.status === "Published" ? "Hide section" : "Publish section"}
                                >
                                    {sec.status === "Published" ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                                </button>
                                <button
                                    className="p-1.5 hover:bg-red-50 rounded-lg text-brand-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => deleteSection(sec.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}

                    <button
                        className="w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-brand-border rounded-xl text-brand-muted hover:bg-brand-bg hover:text-navy hover:border-primary/30 transition-all font-bold group"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <div className="w-10 h-10 rounded-full bg-brand-bg border border-brand-border flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Plus className="w-5 h-5 text-primary" />
                        </div>
                        Add New Content Block
                        <span className="text-xs font-medium text-brand-muted font-normal mt-1">Insert features, testimonials, galleries...</span>
                    </button>
                </div>
            </div>

            {/* Add Section Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add Homepage Section"
                maxWidth="max-w-lg"
            >
                <form onSubmit={handleAddSection} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-navy">Section Title <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                className="input-base"
                                placeholder="e.g. Patient Testimonials"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-navy">Block Type</label>
                            <select
                                className="input-base"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                {sectionTypes.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-navy">Initial Status</label>
                            <select
                                className="input-base"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="Published">Published</option>
                                <option value="Draft">Draft (Hidden)</option>
                            </select>
                        </div>
                    </div>
                    <div className="pt-6 border-t border-brand-border flex items-center justify-end gap-3">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary">Add Section</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default HomepageSectionsPage;
