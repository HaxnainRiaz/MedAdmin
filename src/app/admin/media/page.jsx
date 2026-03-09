"use client";

import React, { useState } from "react";
import Modal from "@/components/admin/shared/Modal";
import {
    Image as ImageIcon,
    Upload,
    Search,
    Filter,
    Folder,
    Grid,
    List,
    MoreHorizontal,
    FileText,
    FileIcon,
    Video,
    Plus,
    Trash2,
    Eye,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/admin-utils";

const initialAssets = [
    { id: "M-1", name: "hero-banner-main.jpg", type: "image", size: "2.4 MB", dimension: "1920x1080", date: "2024-03-01", folder: "Hero Visuals" },
    { id: "M-2", name: "dr-robert-smith.png", type: "image", size: "850 KB", dimension: "800x800", date: "2024-03-02", folder: "Doctor Profiles" },
    { id: "M-3", name: "clinic-tour-high.mp4", type: "video", size: "15.2 MB", dimension: "1080p", date: "2024-02-28", folder: "Blog Media" },
    { id: "M-4", name: "services-brochure.pdf", type: "document", size: "4.1 MB", dimension: "8 Pages", date: "2024-02-20", folder: "All Assets" },
    { id: "M-5", name: "footer-logo-white.svg", type: "image", size: "12 KB", dimension: "Vector", date: "2024-01-15", folder: "All Assets" },
    { id: "M-6", name: "blog-post-cardiology.jpg", type: "image", size: "1.1 MB", dimension: "1200x630", date: "2024-03-05", folder: "Blog Media" },
];

const MediaLibraryPage = () => {
    const [assets, setAssets] = useState(initialAssets);
    const [activeFolder, setActiveFolder] = useState("All Assets");
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"

    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    // Filter Logic
    const filteredAssets = assets.filter(a => {
        const matchesFolder = activeFolder === "All Assets" || a.folder === activeFolder || a.folder === "All Assets" /* simplified for mock */;
        const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFolder && matchesSearch;
    });

    const triggerToast = () => {
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this asset? This cannot be undone.")) {
            setAssets(assets.filter(a => a.id !== id));
            triggerToast();
        }
    };

    const folders = [
        { name: "All Assets", count: assets.length },
        { name: "Doctor Profiles", count: assets.filter(a => a.folder === "Doctor Profiles").length },
        { name: "Blog Media", count: assets.filter(a => a.folder === "Blog Media").length },
        { name: "Hero Visuals", count: assets.filter(a => a.folder === "Hero Visuals").length },
    ];

    return (
        <div className="space-y-6 relative">
            {/* Success Toast */}
            {showSuccessToast && (
                <div className="fixed top-24 right-8 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-premium flex items-center gap-3 z-50 animate-in fade-in slide-in-from-top-4">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-bold text-sm">Media library updated!</span>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-navy">Media Library</h2>
                    <p className="text-brand-muted text-sm">Upload and manage all website assets, images, and documents.</p>
                </div>
                <button className="btn-primary" onClick={() => setIsUploadModalOpen(true)}>
                    <Upload className="w-4 h-4" />
                    Upload Files
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 space-y-4">
                    <div className="admin-card p-4">
                        <h3 className="text-sm font-black text-navy uppercase tracking-widest mb-4">Folders</h3>
                        <div className="space-y-1">
                            {folders.map(folder => (
                                <button
                                    key={folder.name}
                                    onClick={() => setActiveFolder(folder.name)}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all",
                                        activeFolder === folder.name ? "bg-primary/10 text-primary font-bold" : "text-brand-muted hover:bg-brand-bg hover:text-navy"
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        <Folder className={cn("w-4 h-4", activeFolder === folder.name ? "fill-current" : "")} />
                                        {folder.name}
                                    </div>
                                    <span className="text-[10px] opacity-60 font-black">{folder.count}</span>
                                </button>
                            ))}
                        </div>
                        <button className="w-full mt-4 flex items-center justify-center gap-2 p-2 border border-dashed border-brand-border rounded-lg text-xs font-bold text-brand-muted hover:text-primary hover:border-primary/50 transition-all">
                            <Plus className="w-3.5 h-3.5" />
                            New Folder
                        </button>
                    </div>

                    <div className="admin-card p-4">
                        <h3 className="text-sm font-black text-navy uppercase tracking-widest mb-2">Storage</h3>
                        <div className="w-full bg-brand-bg h-2 rounded-full overflow-hidden mb-2">
                            <div className="bg-primary h-full w-[65%]"></div>
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-bold">
                            <span className="text-brand-muted">6.5 GB of 10 GB</span>
                            <span className="text-primary hover:underline cursor-pointer">Upgrade</span>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-3 space-y-6">
                    <div className="admin-card p-4 flex flex-wrap items-center justify-between gap-4">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                            <input
                                type="text"
                                placeholder="Search assets..."
                                className="input-base pl-10 h-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center bg-brand-bg p-1 rounded-lg mr-2">
                                <button
                                    className={cn("p-1.5 rounded-md transition-colors", viewMode === "grid" ? "bg-white shadow-sm text-primary" : "text-brand-muted hover:text-navy")}
                                    onClick={() => setViewMode("grid")}
                                >
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button
                                    className={cn("p-1.5 rounded-md transition-colors", viewMode === "list" ? "bg-white shadow-sm text-primary" : "text-brand-muted hover:text-navy")}
                                    onClick={() => setViewMode("list")}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                            <button className="btn-secondary h-10 px-3">
                                <Filter className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {filteredAssets.length === 0 ? (
                        <div className="admin-card p-12 flex flex-col items-center justify-center text-center">
                            <ImageIcon className="w-12 h-12 text-brand-border mb-3" />
                            <h3 className="font-bold text-navy text-lg">No media found</h3>
                            <p className="text-sm text-brand-muted">Try a different search or folder.</p>
                        </div>
                    ) : viewMode === "grid" ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredAssets.map((asset) => (
                                <div key={asset.id} className="admin-card group hover:shadow-premium transition-all overflow-hidden relative">
                                    <div className="aspect-square bg-brand-bg flex items-center justify-center relative border-b border-brand-border">
                                        {asset.type === "image" ? (
                                            <div className="w-full h-full bg-blue-50/50 flex items-center justify-center">
                                                <ImageIcon className="w-10 h-10 text-primary opacity-20" />
                                            </div>
                                        ) : asset.type === "video" ? (
                                            <div className="w-full h-full bg-purple-50 flex items-center justify-center">
                                                <Video className="w-10 h-10 text-purple-400 opacity-40" />
                                            </div>
                                        ) : (
                                            <div className="w-full h-full bg-emerald-50 flex items-center justify-center">
                                                <FileIcon className="w-10 h-10 text-emerald-400 opacity-40" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            {asset.type === "image" && (
                                                <button className="w-8 h-8 rounded-full bg-white text-navy flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button className="w-8 h-8 rounded-full bg-white text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors" onClick={() => handleDelete(asset.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-white/90 backdrop-blur rounded text-[8px] font-black uppercase tracking-tighter shadow-sm">
                                            {asset.type}
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <p className="text-xs font-bold text-navy truncate" title={asset.name}>{asset.name}</p>
                                        <div className="flex items-center justify-between mt-1 text-[9px] text-brand-muted font-bold tracking-widest uppercase">
                                            <span>{asset.size}</span>
                                            <span>{asset.dimension}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="admin-card overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-brand-bg/50 text-[10px] uppercase tracking-wider text-brand-muted font-bold">
                                        <th className="px-6 py-4">File Name</th>
                                        <th className="px-6 py-4">Type</th>
                                        <th className="px-6 py-4">Size & Dimensions</th>
                                        <th className="px-6 py-4">Date Added</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-border">
                                    {filteredAssets.map(asset => (
                                        <tr key={asset.id} className="hover:bg-brand-bg/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-brand-bg flex items-center justify-center shrink-0">
                                                        {asset.type === "image" ? <ImageIcon className="w-4 h-4 text-primary" /> : asset.type === "video" ? <Video className="w-4 h-4 text-purple-500" /> : <FileText className="w-4 h-4 text-emerald-500" />}
                                                    </div>
                                                    <span className="text-sm font-bold text-navy truncate max-w-[200px]">{asset.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-muted bg-brand-bg px-2 py-1 rounded">{asset.type}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-charcoal">{asset.size}</span>
                                                    <span className="text-[10px] text-brand-muted">{asset.dimension}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs text-brand-muted font-medium">{asset.date}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="p-2 hover:bg-brand-bg rounded-lg transition-colors text-brand-muted hover:text-red-500" onClick={() => handleDelete(asset.id)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Upload Modal (Mock) */}
            <Modal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                title="Upload Media"
                maxWidth="max-w-xl"
            >
                <div className="space-y-6">
                    <div className="border-2 border-dashed border-primary/20 bg-primary/5 rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-primary/10 transition-colors">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                            <Upload className="w-6 h-6 text-primary" />
                        </div>
                        <h4 className="text-lg font-bold text-navy mb-1">Click to upload or drag and drop</h4>
                        <p className="text-sm text-brand-muted mb-4">SVG, PNG, JPG, MP4 or PDF (max. 10MB)</p>
                        <button className="btn-primary" onClick={(e) => { e.preventDefault(); setIsUploadModalOpen(false); triggerToast(); }}>
                            Browse Files
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default MediaLibraryPage;
