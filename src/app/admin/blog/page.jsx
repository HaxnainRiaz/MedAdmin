"use client";

import React, { useState } from "react";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import Modal from "@/components/admin/shared/Modal";
import DataTable from "@/components/admin/shared/DataTable";
import {
    Search,
    Plus,
    Edit,
    Trash2,
    ExternalLink,
    MessageCircle,
    Eye,
    Calendar,
    User,
    Filter
} from "lucide-react";
import { cn } from "@/lib/admin-utils";
import { useToast } from "@/components/admin/shared/ToastProvider";

const initialPosts = [
    { id: "P-1", title: "Everything You Need to Know About Cardiology", category: "Heart Health", author: "Dr. Robert Smith", status: "Published", date: "2024-03-01", views: "1.2k", comments: 12 },
    { id: "P-2", title: "Managing Skin Care in Winter: A Guide", category: "Dermatology", author: "Dr. Lisa Wong", status: "Draft", date: "2024-03-05", views: "0", comments: 0 },
    { id: "P-3", title: "Building Healthy Habits for Kids", category: "Pediatrics", author: "Dr. Michael Chen", status: "Published", date: "2024-02-28", views: "850", comments: 5 },
    { id: "P-4", title: "New Advancements in Neurology for 2024", category: "Neurology", author: "Dr. Sarah Miller", status: "Review", date: "2024-03-06", views: "210", comments: 0 },
    { id: "P-5", title: "The Importance of Regular Checkups", category: "General", author: "Admin", status: "Published", date: "2024-02-15", views: "3.4k", comments: 24 },
];

const BlogPage = () => {
    const { triggerToast } = useToast();
    const [posts, setPosts] = useState(initialPosts);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Status");
    const [selectedIds, setSelectedIds] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState(null);

    const [formData, setFormData] = useState({
        title: "", category: "General", author: "Admin", status: "Draft", date: ""
    });

    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.author.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "All Status" || post.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Selection Handlers
    const toggleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(filteredPosts.map(p => p.id));
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
        if (confirm(`Are you sure you want to delete ${selectedIds.length} posts?`)) {
            setPosts(posts.filter(p => !selectedIds.includes(p.id)));
            setSelectedIds([]);
            triggerToast("Posts deleted successfully", "success");
        }
    };

    const handleBulkStatusChange = (newStatus) => {
        setPosts(posts.map(p =>
            selectedIds.includes(p.id) ? { ...p, status: newStatus } : p
        ));
        setSelectedIds([]);
        triggerToast(`Status updated to ${newStatus}`, "success");
    };

    const openCreateModal = () => {
        setEditingPost(null);
        setFormData({ title: "", category: "General", author: "Admin", status: "Draft", date: new Date().toISOString().split('T')[0] });
        setIsModalOpen(true);
    };

    const openEditModal = (post) => {
        setEditingPost(post);
        setFormData({ ...post });
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this post?")) {
            setPosts(posts.filter(p => p.id !== id));
            setSelectedIds(prev => prev.filter(selId => selId !== id));
            triggerToast("Post deleted successfully", "success");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingPost) {
            setPosts(posts.map(p => p.id === editingPost.id ? { ...p, ...formData } : p));
            triggerToast("Post updated successfully", "success");
        } else {
            const newPost = {
                id: `P-${Date.now()}`,
                ...formData,
                views: "0",
                comments: 0
            };
            setPosts([newPost, ...posts]);
            triggerToast("New post created successfully", "success");
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-navy">Blog Management</h2>
                    <p className="text-brand-muted text-xs sm:text-sm">Write, edit, and publish health articles and clinic news.</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                    <button
                        className="btn-secondary flex-1 sm:flex-none py-2 px-3 text-xs sm:text-sm"
                        onClick={() => triggerToast("Categories Manager (Mock)", "info")}
                    >Categories</button>
                    <button
                        className="btn-primary flex-1 sm:flex-none py-2 px-3 text-xs sm:text-sm whitespace-nowrap"
                        onClick={openCreateModal}
                    >
                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        New Post
                    </button>
                </div>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {[
                    { label: "Total Articles", value: posts.length, color: "blue" },
                    { label: "Published", value: posts.filter(p => p.status === "Published").length, color: "green" },
                    { label: "Reviews", value: posts.filter(p => p.status === "Review").length, color: "orange" },
                    { label: "Weekly Views", value: "8.4k", color: "purple" },
                ].map((stat, idx) => (
                    <div key={idx} className="admin-card p-3 sm:p-4 flex flex-col">
                        <span className="text-[10px] sm:text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1 truncate">{stat.label}</span>
                        <span className="text-lg sm:text-xl font-bold text-navy">{stat.value}</span>
                    </div>
                ))}
            </div>

            <div className="admin-card overflow-hidden">
                <div className="p-3 sm:p-4 border-b border-brand-border flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative flex-1 w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted shrink-0" />
                        <input
                            type="text"
                            placeholder="Search articles, authors..."
                            className="input-base pl-10 h-10 text-sm w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <select
                            className="input-base text-xs sm:text-sm h-10 flex-1 md:w-36"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option>All Status</option>
                            <option>Published</option>
                            <option>Draft</option>
                            <option>Review</option>
                        </select>
                        <button
                            className="btn-secondary h-10 px-3 shrink-0"
                            onClick={() => triggerToast("Filter expanded", "info")}
                        >
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
                            checked={selectedIds.length === filteredPosts.length && filteredPosts.length > 0}
                        />,
                        "Article",
                        "Status",
                        "Author",
                        "Category",
                        "Stats",
                        { content: "Actions", className: "text-right" }
                    ]}
                >
                    {filteredPosts.length > 0 ? filteredPosts.map((post, idx) => (
                        <tr key={idx} className={cn("hover:bg-brand-bg/30 transition-colors group", selectedIds.includes(post.id) ? "bg-primary/5" : "")}>
                            <td>
                                <input
                                    type="checkbox"
                                    className="rounded border-brand-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                                    checked={selectedIds.includes(post.id)}
                                    onChange={() => toggleSelect(post.id)}
                                />
                            </td>
                            <td>
                                <div className="flex flex-col min-w-[200px]">
                                    <span className="text-sm font-bold text-navy group-hover:text-primary transition-colors cursor-pointer leading-tight">{post.title}</span>
                                    <div className="flex items-center gap-3 mt-1.5">
                                        <div className="flex items-center gap-1 text-[10px] text-brand-muted">
                                            <Calendar className="w-3 h-3" />
                                            {post.date}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <StatusBadge status={post.status} />
                            </td>
                            <td>
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 bg-brand-bg rounded-full flex items-center justify-center border border-brand-border font-bold text-[10px] text-primary shrink-0">
                                        {post.author.charAt(0)}
                                    </div>
                                    <span className="text-xs text-charcoal font-medium truncate max-w-[100px]">{post.author}</span>
                                </div>
                            </td>
                            <td>
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg border border-blue-100 whitespace-nowrap">{post.category}</span>
                            </td>
                            <td>
                                <div className="flex items-center gap-4 text-brand-muted text-[10px] font-bold uppercase whitespace-nowrap">
                                    <div className="flex items-center gap-1">
                                        <Eye className="w-3 h-3" />
                                        {post.views}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MessageCircle className="w-3 h-3" />
                                        {post.comments}
                                    </div>
                                </div>
                            </td>
                            <td className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                    <button
                                        className="p-2 hover:bg-brand-bg rounded-lg transition-colors text-brand-muted hover:text-navy"
                                        onClick={() => openEditModal(post)}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        className="p-2 hover:bg-brand-bg rounded-lg transition-colors text-brand-muted hover:text-blue-600"
                                        onClick={() => triggerToast(`Viewing live preview: ${post.title}`, "info")}
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </button>
                                    <button
                                        className="p-2 hover:bg-red-50 rounded-lg transition-colors text-brand-muted hover:text-red-500"
                                        onClick={() => handleDelete(post.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="7" className="px-6 py-12 text-center text-brand-muted">
                                <p className="font-bold text-navy text-base">No blog posts found</p>
                                <p className="text-xs mt-1">Try adjusting your status filter or search query.</p>
                            </td>
                        </tr>
                    )}
                </DataTable>

                {/* Bulk Action Bar */}
                {selectedIds.length > 0 && (
                    <div className="p-3 sm:p-4 bg-navy text-white flex flex-col sm:flex-row items-center justify-between gap-3 animate-in slide-in-from-bottom-2">
                        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                            <span className="text-xs sm:text-sm font-medium whitespace-nowrap">{selectedIds.length} articles selected</span>
                            <div className="flex items-center gap-2 flex-1">
                                <button className="flex-1 sm:flex-none px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-[11px] font-bold transition-colors" onClick={() => handleBulkStatusChange('Published')}>Publish</button>
                                <button className="flex-1 sm:flex-none px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-bold transition-colors" onClick={() => handleBulkStatusChange('Draft')}>Move to Draft</button>
                                <button className="flex-1 sm:flex-none px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-[11px] font-bold transition-colors" onClick={handleBulkDelete}>Delete</button>
                            </div>
                        </div>
                        <button className="text-[11px] text-white/60 hover:text-white transition-colors underline" onClick={() => setSelectedIds([])}>Clear selection</button>
                    </div>
                )}
            </div>

            {/* Create / Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingPost ? "Edit Blog Article" : "Create New Post"}
                maxWidth="max-w-2xl"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-navy">Post Title <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                className="input-base"
                                placeholder="Enter a descriptive post title..."
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-navy">Category</label>
                                <select
                                    className="input-base"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option>General</option>
                                    <option>Heart Health</option>
                                    <option>Dermatology</option>
                                    <option>Pediatrics</option>
                                    <option>Neurology</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-navy">Author Name</label>
                                <input
                                    type="text"
                                    className="input-base"
                                    placeholder="e.g. Dr. Robert Smith"
                                    value={formData.author}
                                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-navy">Publish Date</label>
                                <input
                                    type="date"
                                    className="input-base"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-navy">Initial Status</label>
                                <select
                                    className="input-base"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option>Draft</option>
                                    <option>Review</option>
                                    <option>Published</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="pt-6 border-t border-brand-border flex items-center justify-end gap-3">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            {editingPost ? "Save Changes" : "Create Post"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default BlogPage;
