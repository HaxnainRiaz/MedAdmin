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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState(null);

    const [formData, setFormData] = useState({
        title: "", category: "General", author: "Admin", status: "Draft", date: ""
    });

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
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-navy">Blog Management</h2>
                    <p className="text-brand-muted text-sm">Write, edit, and publish health articles and clinic news.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        className="btn-secondary"
                        onClick={() => triggerToast("Opened Categories Manager", "info")}
                    >Categories</button>
                    <button
                        className="btn-primary"
                        onClick={openCreateModal}
                    >
                        <Plus className="w-4 h-4" />
                        New Post
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Posts", value: posts.length.toString() },
                    { label: "Published", value: posts.filter(p => p.status === "Published").length.toString() },
                    { label: "Pending Review", value: posts.filter(p => p.status === "Review").length.toString() },
                    { label: "Drafts", value: posts.filter(p => p.status === "Draft").length.toString() },
                ].map((stat, idx) => (
                    <div key={idx} className="admin-card p-5">
                        <p className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-1">{stat.label}</p>
                        <p className="text-2xl font-black text-navy">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="admin-card overflow-hidden">
                <div className="p-4 border-b border-brand-border flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative flex-1 w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                        <input type="text" placeholder="Search posts..." className="input-base pl-10" />
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            className="btn-secondary"
                            onClick={() => triggerToast("Filter dropdown toggled", "info")}
                        >
                            <Filter className="w-4 h-4" />
                            Filter
                        </button>
                        <select className="input-base text-sm py-1.5 w-32">
                            <option>Status</option>
                            <option>Published</option>
                            <option>Draft</option>
                            <option>Review</option>
                        </select>
                    </div>
                </div>

                <DataTable
                    headers={[
                        "Article",
                        "Status",
                        "Author",
                        "Category",
                        "Stats",
                        { content: "Actions", className: "text-right" }
                    ]}
                >
                    {posts.map((post, idx) => (
                        <tr key={idx} className="hover:bg-brand-bg/30 transition-colors group">
                            <td>
                                <div className="flex flex-col">
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
                                    <div className="w-6 h-6 bg-brand-bg rounded-full flex items-center justify-center border border-brand-border font-bold text-[10px] text-primary">
                                        {post.author.charAt(0)}
                                    </div>
                                    <span className="text-xs text-charcoal font-medium">{post.author}</span>
                                </div>
                            </td>
                            <td>
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg border border-blue-100">{post.category}</span>
                            </td>
                            <td>
                                <div className="flex items-center gap-4 text-brand-muted text-[10px] font-bold uppercase">
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
                                        className="p-1.5 hover:bg-brand-bg rounded-lg transition-colors text-brand-muted hover:text-navy"
                                        onClick={() => openEditModal(post)}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        className="p-1.5 hover:bg-brand-bg rounded-lg transition-colors text-brand-muted hover:text-blue-600"
                                        onClick={() => triggerToast(`Viewing live preview of ${post.title}`, "info")}
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </button>
                                    <button
                                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-brand-muted hover:text-red-500"
                                        onClick={() => handleDelete(post.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </DataTable>
            </div>

            {/* Create / Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingPost ? "Edit Post" : "Create New Post"}
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
                                placeholder="Enter post title..."
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-navy">Category</label>
                                <input
                                    type="text"
                                    className="input-base"
                                    placeholder="Heart Health"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-navy">Author</label>
                                <input
                                    type="text"
                                    className="input-base"
                                    placeholder="Dr. Smith"
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
                                <label className="text-sm font-bold text-navy">Status</label>
                                <select
                                    className="input-base"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option>Published</option>
                                    <option>Draft</option>
                                    <option>Review</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="pt-6 border-t border-brand-border flex items-center justify-end gap-3">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            {editingPost ? "Save Changes" : "Save Post"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default BlogPage;
