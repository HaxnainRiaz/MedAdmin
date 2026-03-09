"use client";

import React, { useState } from "react";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import Modal from "@/components/admin/shared/Modal";
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

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-navy">Website Pages</h2>
                    <p className="text-brand-muted text-sm">Manage standard content pages, SEO meta data, and routing.</p>
                </div>
                <button
                    className="btn-primary"
                    onClick={openCreateModal}
                >
                    <Plus className="w-4 h-4" />
                    Create New Page
                </button>
            </div>

            <div className="admin-card overflow-hidden">
                <div className="p-4 border-b border-brand-border flex flex-wrap items-center justify-between gap-4">
                    <div className="relative flex-1 min-w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                        <input type="text" placeholder="Search pages by title or slug..." className="input-base pl-10 h-10" />
                    </div>
                    <select className="input-base h-10 text-sm w-40">
                        <option>All Page Types</option>
                        <option>Landing</option>
                        <option>Standard</option>
                        <option>System</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-brand-bg/50 text-[10px] uppercase tracking-wider text-brand-muted font-bold">
                                <th className="px-6 py-4">Page Information</th>
                                <th className="px-6 py-4">Route Path</th>
                                <th className="px-6 py-4">Template</th>
                                <th className="px-6 py-4">Status & Quality</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border">
                            {pages.map((page, idx) => (
                                <tr key={idx} className="hover:bg-brand-bg/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-brand-bg rounded-xl flex items-center justify-center border border-brand-border shrink-0 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-navy">{page.title}</span>
                                                <span className="text-[10px] text-brand-muted font-bold">Last updated {page.updated}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-brand-bg border border-brand-border rounded-lg inline-flex max-w-[150px] overflow-hidden">
                                            <Lock className="w-3 h-3 text-brand-muted shrink-0" />
                                            <span className="text-xs font-mono text-charcoal truncate">{page.slug}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold text-navy bg-white border border-brand-border px-2 py-1 rounded-md">{page.type}</span>
                                    </td>
                                    <td className="px-6 py-4 flex items-center gap-4">
                                        <div className="min-w-[80px]">
                                            <StatusBadge status={page.status} />
                                        </div>
                                        <div className="flex flex-col min-w-[100px]">
                                            <span className={`text-[10px] font-black tracking-widest uppercase ${parseInt(page.seoScore) > 80 ? 'text-emerald-500' : 'text-orange-500'}`}>
                                                SEO {page.seoScore}/100
                                            </span>
                                            <div className="w-16 h-1 bg-brand-bg rounded-full mt-1 overflow-hidden">
                                                <div className={`h-full ${parseInt(page.seoScore) > 80 ? 'bg-emerald-500' : 'bg-orange-500'}`} style={{ width: `${parseInt(page.seoScore)}%` }}></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                className="p-1.5 hover:bg-brand-bg rounded-lg transition-colors text-brand-muted hover:text-navy"
                                                onClick={() => triggerToast(`Previewing ${page.title}...`, "info")}
                                            >
                                                <Globe className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="p-1.5 hover:bg-brand-bg rounded-lg transition-colors text-brand-muted hover:text-primary"
                                                onClick={() => openEditModal(page)}
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-brand-muted hover:text-red-500"
                                                onClick={() => handleDelete(page.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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
