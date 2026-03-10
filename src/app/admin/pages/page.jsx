"use client";

import React, { useState } from "react";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import Modal from "@/components/admin/shared/Modal";
import DataTable from "@/components/admin/shared/DataTable";
import {
    FileText,
    Search,
    Plus,
    Edit3,
    Eye,
    MoreHorizontal,
    Link as LinkIcon,
    Globe,
    Lock,
    Trash2
} from "lucide-react";
import { useToast } from "@/components/admin/shared/ToastProvider";
import { cn } from "@/lib/admin-utils";

const initialPages = [
    { id: "PG-1", title: "Home", slug: "/", type: "Landing", status: "Published", updated: "2h ago", seoScore: "95" },
    { id: "PG-2", title: "About Us", slug: "/about", type: "Standard", status: "Published", updated: "5d ago", seoScore: "88" },
    { id: "PG-3", title: "Contact", slug: "/contact", type: "Contact Form", status: "Published", updated: "1w ago", seoScore: "92" },
    { id: "PG-4", title: "Insurance Info", slug: "/insurance", type: "Standard", status: "Draft", updated: "1d ago", seoScore: "45" },
    { id: "PG-5", title: "Careers", slug: "/careers", type: "Standard", status: "Archived", updated: "1mo ago", seoScore: "70" },
];


const PagesPage = () => {
    const { triggerToast } = useToast();
    const [pages, setPages] = useState(initialPages);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPage, setEditingPage] = useState(null);

    const [formData, setFormData] = useState({
        title: "", slug: "", type: "Standard", status: "Draft", seoScore: "50"
    });

    const openCreateModal = () => {
        setEditingPage(null);
        setFormData({ title: "", slug: "", type: "Standard", status: "Draft", seoScore: "50" });
        setIsModalOpen(true);
    };

    const openEditModal = (page) => {
        setEditingPage(page);
        setFormData({ ...page });
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this page?")) {
            setPages(pages.filter(p => p.id !== id));
            triggerToast("Page deleted successfully", "success");
        }
    };

    const generateSlug = (name) => {
        if (name.toLowerCase() === 'home') return '/';
        return '/' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    };

    const handleTitleChange = (e) => {
        const title = e.target.value;
        setFormData({ ...formData, title, slug: generateSlug(title) });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const now = "Just now";
        if (editingPage) {
            setPages(pages.map(p => p.id === editingPage.id ? { ...p, ...formData, updated: now } : p));
            triggerToast("Page updated successfully", "success");
        } else {
            const newPage = {
                id: `PG-${Date.now()}`,
                ...formData,
                updated: now
            };
            setPages([...pages, newPage]);
            triggerToast("New page created successfully", "success");
        }
        setIsModalOpen(false);
    };

    const publishedCount = pages.filter(p => p.status === "Published").length;
    const avgSeo = Math.round(pages.reduce((acc, p) => acc + parseInt(p.seoScore), 0) / pages.length);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-navy">Website Pages</h2>
                    <p className="text-brand-muted text-xs sm:text-sm">Manage standard content pages, SEO meta data, and routing.</p>
                </div>
                <button
                    className="btn-primary"
                    onClick={openCreateModal}
                >
                    <Plus className="w-4 h-4" />
                    Create New Page
                </button>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                {[
                    { label: "Total Pages", value: pages.length, icon: FileText, color: "text-blue-500" },
                    { label: "Live Pages", value: publishedCount, icon: Globe, color: "text-emerald-500" },
                    { label: "Avg. SEO Score", value: `${avgSeo}/100`, icon: Eye, color: "text-orange-500" },
                ].map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={idx} className="admin-card p-4 sm:p-6 group hover:border-primary/50 transition-all cursor-pointer">
                            <div className="flex items-center justify-between mb-2 min-w-0">
                                <span className="text-[10px] sm:text-xs font-bold text-brand-muted uppercase tracking-wider truncate shrink-0">{stat.label}</span>
                                <Icon className={cn("w-4 h-4 sm:w-5 sm:h-5", stat.color)} />
                            </div>
                            <span className="text-2xl sm:text-3xl font-black text-navy leading-none truncate block">{stat.value}</span>
                        </div>
                    );
                })}
            </div>

            <div className="admin-card overflow-hidden">
                <div className="p-3 sm:p-4 border-b border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                        <input type="text" placeholder="Search pages by title or slug..." className="input-base pl-10 h-10 text-sm" />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                        <select className="input-base h-10 text-xs sm:text-sm w-full sm:w-40 min-w-[140px]">
                            <option>All Page Types</option>
                            <option>Landing</option>
                            <option>Standard</option>
                            <option>System</option>
                        </select>
                    </div>
                </div>

                <DataTable
                    headers={[
                        "Page Information",
                        "Route Path",
                        "Template",
                        "Status & Quality",
                        { content: "Actions", className: "text-right" }
                    ]}
                >
                    {pages.map((page, idx) => (
                        <tr key={idx} className="hover:bg-brand-bg/30 transition-colors group">
                            <td>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-brand-bg rounded-lg sm:rounded-xl flex items-center justify-center border border-brand-border shrink-0 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                        <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-xs sm:text-sm font-bold text-navy truncate max-w-[120px] sm:max-w-none">{page.title}</span>
                                        <span className="text-[9px] sm:text-[10px] text-brand-muted font-bold truncate">Update {page.updated}</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="flex items-center gap-1.5 px-2 py-0.5 sm:py-1 bg-brand-bg border border-brand-border rounded-lg inline-flex max-w-[100px] sm:max-w-[150px] overflow-hidden">
                                    <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-brand-muted shrink-0" />
                                    <span className="text-[10px] sm:text-xs font-mono text-charcoal truncate">{page.slug}</span>
                                </div>
                            </td>
                            <td>
                                <span className="text-[10px] sm:text-xs font-bold text-navy bg-white border border-brand-border px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md">{page.type}</span>
                            </td>
                            <td>
                                <div className="flex flex-col gap-1.5">
                                    <StatusBadge status={page.status} />
                                    <div className="flex flex-col min-w-[60px] sm:min-w-[100px]">
                                        <span className={`text-[8px] sm:text-[9px] font-black tracking-widest uppercase ${parseInt(page.seoScore) > 80 ? 'text-emerald-500' : 'text-orange-500'}`}>
                                            SEO {page.seoScore}%
                                        </span>
                                        <div className="w-full sm:w-16 h-1 bg-brand-bg rounded-full mt-0.5 overflow-hidden">
                                            <div className={`h-full ${parseInt(page.seoScore) > 80 ? 'bg-emerald-500' : 'bg-orange-500'}`} style={{ width: `${parseInt(page.seoScore)}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="text-right">
                                <div className="flex items-center justify-end gap-1 sm:gap-2">
                                    <button
                                        className="p-1 sm:p-1.5 hover:bg-brand-bg rounded-lg transition-colors text-brand-muted hover:text-navy"
                                        onClick={() => triggerToast(`Previewing ${page.title}...`, "info")}
                                    >
                                        <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                    <button
                                        className="p-1 sm:p-1.5 hover:bg-brand-bg rounded-lg transition-colors text-brand-muted hover:text-primary"
                                        onClick={() => openEditModal(page)}
                                    >
                                        <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                    <button
                                        className="p-1 sm:p-1.5 hover:bg-red-50 rounded-lg transition-colors text-brand-muted hover:text-red-500"
                                        onClick={() => handleDelete(page.id)}
                                    >
                                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </DataTable>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingPage ? "Edit Page" : "Add New Page"}
                maxWidth="max-w-xl"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-navy">Page Title <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    required
                                    className="input-base"
                                    placeholder="e.g. Our Services"
                                    value={formData.title}
                                    onChange={handleTitleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-navy">URL Slug <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    required
                                    className="input-base bg-brand-bg/50"
                                    placeholder="/our-services"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-navy">Template Type</label>
                                <select
                                    className="input-base"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option>Standard</option>
                                    <option>Landing</option>
                                    <option>Contact Form</option>
                                    <option>System</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-navy">Status</label>
                                <select
                                    className="input-base"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option>Published</option>
                                    <option>Draft</option>
                                    <option>Archived</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-navy">Initial SEO Score (Mock)</label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                className="w-full accent-primary"
                                value={formData.seoScore}
                                onChange={(e) => setFormData({ ...formData, seoScore: e.target.value })}
                            />
                            <div className="text-xs text-brand-muted text-right font-bold">{formData.seoScore}/100</div>
                        </div>
                    </div>
                    <div className="pt-6 border-t border-brand-border flex items-center justify-end gap-3">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            {editingPage ? "Save Changes" : "Create Page"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default PagesPage;
