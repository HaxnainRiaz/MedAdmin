"use client";

import React, { useState } from "react";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import Modal from "@/components/admin/shared/Modal";
import DataTable from "@/components/admin/shared/DataTable";
import {
    CircleHelp,
    Search,
    Plus,
    MoreHorizontal,
    ChevronDown,
    Edit2,
    Trash2,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/admin-utils";

const initialFaqs = [
    { id: "FAQ-1", question: "Do you accept international insurance?", answer: "Yes, we accept a variety of international insurance plans. Please contact our billing department to verify your specific provider and coverage ahead of your visit.", category: "Billing", status: "Published", views: 1250 },
    { id: "FAQ-2", question: "How early should I arrive for my appointment?", answer: "We recommend arriving 15 minutes before your scheduled appointment time to complete any necessary paperwork or vitals checks.", category: "General", status: "Published", views: 980 },
    { id: "FAQ-3", question: "Can I request my medical records online?", answer: "Yes, you can access your medical records securely through our patient portal at any time.", category: "Records", status: "Published", views: 850 },
    { id: "FAQ-4", question: "What should I bring to my first visit?", answer: "Please bring a valid photo ID, your insurance card, and any relevant past medical records or list of current medications.", category: "General", status: "Draft", views: 0 },
    { id: "FAQ-5", question: "Do you offer virtual consultations?", answer: "Yes, we offer Telehealth appointments for many types of routine follow-ups and minor urgent care issues.", category: "Services", status: "Published", views: 2100 },
];

const FaqPage = () => {
    const [faqs, setFaqs] = useState(initialFaqs);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All Categories");
    const [selectedIds, setSelectedIds] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState(null);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    const [formData, setFormData] = useState({
        question: "", answer: "", category: "General", status: "Draft"
    });

    const triggerToast = () => {
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
    };

    // Selection Handlers
    const toggleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(filteredFaqs.map(f => f.id));
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
    const handleBulkDelete = () => {
        if (confirm(`Are you sure you want to delete ${selectedIds.length} FAQs?`)) {
            setFaqs(faqs.filter(f => !selectedIds.includes(f.id)));
            setSelectedIds([]);
            triggerToast();
        }
    };

    const handleBulkStatusChange = (newStatus) => {
        setFaqs(faqs.map(f =>
            selectedIds.includes(f.id) ? { ...f, status: newStatus } : f
        ));
        setSelectedIds([]);
        triggerToast();
    };

    const categories = ["All Categories", ...Array.from(new Set(initialFaqs.map(f => f.category)))];

    const filteredFaqs = faqs.filter(f => {
        const matchesCategory = categoryFilter === "All Categories" || f.category === categoryFilter;
        const matchesSearch = f.question.toLowerCase().includes(searchQuery.toLowerCase()) || f.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const openCreateModal = () => {
        setEditingFaq(null);
        setFormData({ question: "", answer: "", category: "General", status: "Draft" });
        setIsModalOpen(true);
    };

    const openEditModal = (faq) => {
        setEditingFaq(faq);
        setFormData({ question: faq.question, answer: faq.answer, category: faq.category, status: faq.status });
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this FAQ?")) {
            setFaqs(faqs.filter(f => f.id !== id));
            triggerToast();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingFaq) {
            setFaqs(faqs.map(f => f.id === editingFaq.id ? { ...f, ...formData } : f));
        } else {
            const newFaq = {
                id: `FAQ-${faqs.length + 10}`,
                ...formData,
                views: 0
            };
            setFaqs([newFaq, ...faqs]);
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
                    <span className="font-bold text-sm">FAQ updated successfully!</span>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-navy">Help Center FAQs</h2>
                    <p className="text-brand-muted text-xs sm:text-sm">Manage help center articles and patient support queries.</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto">
                    <button className="btn-secondary h-10 px-4 text-xs sm:text-sm">
                        Categories
                    </button>
                    <button className="btn-primary h-10 px-4 text-xs sm:text-sm" onClick={openCreateModal}>
                        <Plus className="w-4 h-4" />
                        Add FAQ
                    </button>
                </div>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {[
                    { label: "Total Articles", value: faqs.length, color: "blue" },
                    { label: "Total Views", value: faqs.reduce((acc, f) => acc + (f.views || 0), 0), color: "purple" },
                    { label: "Published", value: faqs.filter(f => f.status === 'Published').length, color: "green" },
                    { label: "Drafts", value: faqs.filter(f => f.status === 'Draft').length, color: "orange" }
                ].map((stat, idx) => (
                    <div key={idx} className="admin-card p-3 sm:p-4 flex flex-col">
                        <span className="text-[10px] sm:text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1 truncate">{stat.label}</span>
                        <span className="text-lg sm:text-xl font-bold text-navy">{stat.value.toLocaleString()}</span>
                    </div>
                ))}
            </div>

            <div className="admin-card overflow-hidden">
                <div className="p-3 sm:p-4 border-b border-brand-border flex flex-col lg:flex-row gap-3 sm:gap-4 items-center justify-between">
                    <div className="relative flex-1 w-full lg:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                        <input
                            type="text"
                            placeholder="Search questions or answers..."
                            className="input-base pl-10 h-10 text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full lg:w-auto">
                        <select
                            className="input-base text-xs sm:text-sm h-10 flex-1 lg:w-48"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            {categories.map((cat, idx) => (
                                <option key={idx} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <DataTable
                    headers={[
                        <input
                            type="checkbox"
                            className="rounded border-brand-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                            onChange={toggleSelectAll}
                            checked={selectedIds.length === filteredFaqs.length && filteredFaqs.length > 0}
                        />,
                        "Question",
                        "Category",
                        "Status & Reach",
                        { content: "Actions", className: "text-right" }
                    ]}
                >
                    {filteredFaqs.length > 0 ? filteredFaqs.map((faq, idx) => (
                        <tr key={idx} className={cn("hover:bg-brand-bg/30 transition-colors group cursor-pointer", selectedIds.includes(faq.id) ? "bg-primary/5" : "")} onClick={() => openEditModal(faq)}>
                            <td onClick={(e) => e.stopPropagation()}>
                                <input
                                    type="checkbox"
                                    className="rounded border-brand-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                                    checked={selectedIds.includes(faq.id)}
                                    onChange={() => toggleSelect(faq.id)}
                                />
                            </td>
                            <td>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100 shrink-0 group-hover:bg-primary group-hover:text-white transition-colors mt-0.5">
                                        <CircleHelp className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-navy hover:text-primary transition-colors">{faq.question}</p>
                                        <p className="text-xs text-charcoal mt-1 line-clamp-1 max-w-[250px] sm:max-w-[400px]">{faq.answer}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="align-top">
                                <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-white border border-brand-border rounded-lg text-[10px] font-bold text-brand-muted">
                                    {faq.category}
                                </div>
                            </td>
                            <td className="align-top">
                                <div className="flex flex-col gap-1.5 min-w-[100px]">
                                    <StatusBadge status={faq.status} />
                                    <span className="text-[10px] font-black tracking-widest uppercase text-brand-muted">{faq.views.toLocaleString()} views</span>
                                </div>
                            </td>
                            <td className="text-right align-top" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-end gap-1">
                                    <button className="p-2 hover:bg-brand-bg rounded-lg transition-colors text-brand-muted hover:text-primary" onClick={() => openEditModal(faq)}>
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 hover:bg-red-50 rounded-lg transition-colors text-brand-muted hover:text-red-500" onClick={() => handleDelete(faq.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="5" className="px-6 py-12 text-center text-brand-muted">
                                <div className="flex flex-col items-center justify-center">
                                    <CircleHelp className="w-10 h-10 text-brand-border mb-3" />
                                    <p className="font-bold text-navy text-base">No FAQs found</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </DataTable>

                {/* Bulk Action Bar */}
                {selectedIds.length > 0 && (
                    <div className="p-3 sm:p-4 bg-navy text-white flex flex-col sm:flex-row items-center justify-between gap-3 animate-in slide-in-from-bottom-2">
                        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                            <span className="text-xs sm:text-sm font-medium whitespace-nowrap">{selectedIds.length} FAQs selected</span>
                            <div className="flex items-center gap-2 flex-1">
                                <button className="flex-1 sm:flex-none px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-[11px] font-bold transition-colors" onClick={() => handleBulkStatusChange('Published')}>Publish</button>
                                <button className="flex-1 sm:flex-none px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-bold transition-colors" onClick={() => handleBulkStatusChange('Draft')}>Draft</button>
                                <button className="flex-1 sm:flex-none px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-[11px] font-bold transition-colors" onClick={handleBulkDelete}>Delete</button>
                            </div>
                        </div>
                        <button className="text-[11px] text-white/60 hover:text-white transition-colors underline" onClick={() => setSelectedIds([])}>Clear selection</button>
                    </div>
                )}
            </div>

            {/* Create/Edit FAQ Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingFaq ? "Edit FAQ" : "Add New FAQ"}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-navy">Question <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                className="input-base"
                                placeholder="e.g., Do you accept insurance?"
                                value={formData.question}
                                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-navy">Answer <span className="text-red-500">*</span></label>
                            <textarea
                                required
                                className="input-base min-h-[120px] resize-y py-3"
                                placeholder="Detailed answer..."
                                value={formData.answer}
                                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                            ></textarea>
                            <p className="text-[10px] text-brand-muted font-bold">You can use basic Markdown for formatting (bold, italics, links).</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-navy">Category</label>
                                <select
                                    className="input-base"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    {categories.filter(c => c !== "All Categories").map((c, i) => (
                                        <option key={i} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-navy">Status</label>
                                <select
                                    className="input-base"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="Published">Published</option>
                                    <option value="Draft">Draft</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-brand-border flex items-center justify-end gap-3">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            {editingFaq ? "Save Changes" : "Create FAQ"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default FaqPage;
