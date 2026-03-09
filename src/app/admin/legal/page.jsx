"use client";

import React, { useState } from "react";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import Modal from "@/components/admin/shared/Modal";
import {
    ShieldCheck,
    Search,
    Plus,
    Edit3,
    Globe,
    History,
    Trash2
} from "lucide-react";
import { cn } from "@/lib/admin-utils";
import { useToast } from "@/components/admin/shared/ToastProvider";

const initialDocs = [
    { id: "DOC-01", title: "Terms of Service", route: "/terms", status: "Published", version: "v2.1", lastUpdated: "2024-01-15", requiresAcceptance: true },
    { id: "DOC-02", title: "Privacy Policy", route: "/privacy", status: "Published", version: "v1.4", lastUpdated: "2023-11-20", requiresAcceptance: true },
    { id: "DOC-03", title: "Cookie Policy", route: "/cookies", status: "Published", version: "v1.0", lastUpdated: "2022-08-10", requiresAcceptance: false },
    { id: "DOC-04", title: "Patient Rights & Responsibilities", route: "/patient-rights", status: "Draft", version: "v3.0", lastUpdated: "2 Days Ago", requiresAcceptance: false },
];

const LegalDocumentsPage = () => {
    const { triggerToast } = useToast();
    const [docs, setDocs] = useState(initialDocs);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDoc, setEditingDoc] = useState(null);
    const [formData, setFormData] = useState({ title: "", route: "", version: "v1.0", status: "Draft", requiresAcceptance: false });

    const filteredDocs = docs.filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase()));

    const openCreate = () => {
        setEditingDoc(null);
        setFormData({ title: "", route: "", version: "v1.0", status: "Draft", requiresAcceptance: false });
        setIsModalOpen(true);
    };

    const openEdit = (doc) => {
        setEditingDoc(doc);
        setFormData({ ...doc });
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this document?")) {
            setDocs(docs.filter(d => d.id !== id));
            triggerToast("Document deleted", "success");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingDoc) {
            setDocs(docs.map(d => d.id === editingDoc.id ? { ...d, ...formData, lastUpdated: "Just Now" } : d));
            triggerToast("Document updated", "success");
        } else {
            setDocs([...docs, { id: `DOC-0${docs.length + 1}`, ...formData, lastUpdated: "Just Now" }]);
            triggerToast("Document created", "success");
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-navy">Legal Documents</h2>
                    <p className="text-brand-muted text-sm">Manage compliance, privacy policies, and terms of use.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        className="btn-primary"
                        onClick={openCreate}
                    >
                        <Plus className="w-4 h-4" />
                        Add Document
                    </button>
                </div>
            </div>

            <div className="admin-card overflow-hidden">
                <div className="p-4 border-b border-brand-border flex items-center justify-between">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                        <input
                            type="text"
                            placeholder="Search legal docs..."
                            className="input-base pl-10 h-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-brand-bg/50 text-[10px] uppercase tracking-wider text-brand-muted font-bold">
                                <th className="px-6 py-4">Document Details</th>
                                <th className="px-6 py-4">Version & Updated</th>
                                <th className="px-6 py-4">Acceptance Rules</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border">
                            {filteredDocs.map((doc, idx) => (
                                <tr key={idx} className="hover:bg-brand-bg/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-brand-bg rounded-xl flex items-center justify-center border border-brand-border shrink-0 text-navy group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                                                <ShieldCheck className="w-5 h-5 text-primary" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-navy hover:text-primary cursor-pointer transition-colors max-w-[200px] truncate">{doc.title}</span>
                                                <span className="text-[10px] text-brand-muted font-mono">{doc.route}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-brand-bg border border-brand-border rounded-md text-[10px] font-black tracking-widest uppercase text-navy w-fit inline-flex mb-1">
                                                <History className="w-3 h-3 text-brand-muted shrink-0" /> {doc.version}
                                            </div>
                                            <span className="text-[10px] text-brand-muted font-bold tracking-widest uppercase">{doc.lastUpdated}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] font-black tracking-widest uppercase px-2 py-1 rounded inline-flex ${doc.requiresAcceptance ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {doc.requiresAcceptance ? 'Explicit Consent' : 'Passive Reading'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex items-center gap-4">
                                        <StatusBadge status={doc.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                className="p-2 hover:bg-brand-bg rounded-lg transition-colors text-brand-muted hover:text-navy"
                                                title="View live page"
                                                onClick={() => triggerToast(`Viewing ${doc.title} online`, "info")}
                                            >
                                                <Globe className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="p-2 hover:bg-brand-bg rounded-lg transition-colors text-brand-muted hover:text-primary"
                                                onClick={() => openEdit(doc)}
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors text-brand-muted hover:text-red-500"
                                                onClick={() => handleDelete(doc.id)}
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

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingDoc ? "Edit Legal Document" : "Add Legal Document"}
                maxWidth="max-w-lg"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-navy">Document Title <span className="text-red-500">*</span></label>
                            <input type="text" required className="input-base" placeholder="e.g. Terms of Service"
                                value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-navy">Route / URL <span className="text-red-500">*</span></label>
                                <input type="text" required className="input-base font-mono text-sm" placeholder="/terms"
                                    value={formData.route} onChange={(e) => setFormData({ ...formData, route: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-navy">Version</label>
                                <input type="text" className="input-base font-mono text-sm" placeholder="v1.0"
                                    value={formData.version} onChange={(e) => setFormData({ ...formData, version: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-navy">Status</label>
                            <select className="input-base" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                                <option>Published</option>
                                <option>Draft</option>
                            </select>
                        </div>
                        <label className="flex items-center gap-3 cursor-pointer p-3 bg-brand-bg rounded-xl border border-brand-border">
                            <input type="checkbox" className="w-4 h-4 rounded border-brand-border text-primary"
                                checked={formData.requiresAcceptance}
                                onChange={(e) => setFormData({ ...formData, requiresAcceptance: e.target.checked })} />
                            <div>
                                <p className="text-sm font-bold text-navy">Requires Explicit Consent</p>
                                <p className="text-xs text-brand-muted">User must actively accept this document</p>
                            </div>
                        </label>
                    </div>
                    <div className="pt-6 border-t border-brand-border flex items-center justify-end gap-3">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary">{editingDoc ? "Save Changes" : "Create Document"}</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default LegalDocumentsPage;
