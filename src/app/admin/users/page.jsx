"use client";

import React, { useState } from "react";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import Modal from "@/components/admin/shared/Modal";
import DataTable from "@/components/admin/shared/DataTable";
import {
    Users,
    Search,
    Filter,
    MoreHorizontal,
    ShieldCheck,
    ShieldAlert,
    UserPlus,
    Mail,
    Edit2,
    Trash2,
    CheckCircle2
} from "lucide-react";

const initialUsers = [
    { id: "USR-001", name: "John Admin", email: "admin@medify.com", role: "Super Admin", created: "2023-11-15", status: "Active" },
    { id: "USR-002", name: "Dr. Robert Smith", email: "robert.s@medify.com", role: "Doctor", created: "2023-11-20", status: "Active" },
    { id: "USR-003", name: "Sarah Manager", email: "sarah@medify.com", role: "Manager", created: "2023-12-05", status: "Active" },
    { id: "USR-004", name: "Reception Desk 1", email: "frontdesk1@medify.com", role: "Staff", created: "2024-01-10", status: "Inactive" },
    { id: "USR-005", name: "Jane Editor", email: "jane@medify.com", role: "Content Editor", created: "2024-02-15", status: "Active" },
];

const UsersPage = () => {
    const [users, setUsers] = useState([...initialUsers]);
    const [searchQuery, setSearchQuery] = useState("");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "", email: "", role: "Staff", status: "Active"
    });

    const triggerToast = () => {
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
    };

    // Filter logic
    const filteredUsers = users.filter(usr =>
        usr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        usr.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        usr.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getRoleIcon = (role) => {
        switch (role) {
            case "Super Admin": return <ShieldAlert className="w-3.5 h-3.5 text-primary" />;
            case "Doctor": return <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />;
            default: return <ShieldCheck className="w-3.5 h-3.5 text-brand-muted" />;
        }
    };

    const openCreateModal = () => {
        setEditingUser(null);
        setFormData({ name: "", email: "", role: "Staff", status: "Active" });
        setIsModalOpen(true);
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setFormData({ name: user.name, email: user.email, role: user.role, status: user.status });
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to remove this user? This revokes all system access immediately.")) {
            setUsers(users.filter(u => u.id !== id));
            triggerToast();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingUser) {
            setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
        } else {
            const newUser = {
                id: `USR-00${users.length + 10}`,
                ...formData,
                created: new Date().toISOString().split("T")[0]
            };
            setUsers([newUser, ...users]);
        }
        setIsModalOpen(false);
        triggerToast();
    };

    return (
        <div className="space-y-6 relative">
            {/* Success Toast */}
            {showSuccessToast && (
                <div className="fixed top-24 right-8 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-premium flex items-center gap-3 z-50 animate-in fade-in slide-in-from-top-4">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-bold text-sm">User list updated!</span>
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-navy">System Users</h2>
                    <p className="text-brand-muted text-xs sm:text-sm">Manage dashboard access and roles.</p>
                </div>
                <button className="btn-primary flex-1 sm:flex-none py-2 px-3 text-xs sm:text-sm whitespace-nowrap" onClick={openCreateModal}>
                    <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Invite User
                </button>
            </div>

            <div className="admin-card overflow-hidden">
                <div className="p-3 sm:p-4 border-b border-brand-border flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-2 flex-1 w-full">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="input-base pl-10 h-10 text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="btn-secondary h-10 px-3 shrink-0">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] sm:text-xs font-bold text-brand-muted sm:border-l sm:border-brand-border sm:pl-4">
                        <div className="flex items-center gap-1.5 underline decoration-primary/20 underline-offset-4">
                            <Users className="w-3.5 h-3.5 text-navy" />
                            <span>{users.length} Total</span>
                        </div>
                        <div className="flex items-center gap-1.5 underline decoration-orange-400/20 underline-offset-4">
                            <ShieldAlert className="w-3.5 h-3.5 text-primary" />
                            <span>{users.filter(u => u.role === "Super Admin").length} Admins</span>
                        </div>
                    </div>
                </div>

                <DataTable
                    headers={[
                        "User",
                        "Access",
                        "Status",
                        { content: "Created", className: "hidden sm:table-cell" },
                        { content: "Action", className: "text-right" }
                    ]}
                >
                    {filteredUsers.length > 0 ? filteredUsers.map((user, idx) => (
                        <tr key={idx} className="hover:bg-brand-bg/30 transition-colors group">
                            <td>
                                <div className="flex items-center gap-3 min-w-[180px]">
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border border-primary/20">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm font-bold text-navy cursor-pointer hover:text-primary transition-colors" onClick={() => openEditModal(user)}>{user.name}</span>
                                        <div className="flex items-center gap-1.5 mt-0.5 min-w-0">
                                            <Mail className="w-3 h-3 text-brand-muted shrink-0" />
                                            <span className="text-[10px] text-brand-muted">{user.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-white border border-brand-border rounded-lg shadow-premium-sm whitespace-nowrap w-fit">
                                    {getRoleIcon(user.role)}
                                    <span className="text-[11px] font-bold text-charcoal">{user.role}</span>
                                </div>
                            </td>
                            <td>
                                <StatusBadge status={user.status} />
                            </td>
                            <td className="hidden sm:table-cell">
                                <span className="text-[12px] font-medium text-brand-muted whitespace-nowrap">{user.created}</span>
                            </td>
                            <td className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                    <button className="p-2 hover:bg-brand-bg rounded-lg transition-colors text-brand-muted hover:text-navy" onClick={() => openEditModal(user)}>
                                        <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                    <button className="p-2 hover:bg-red-50 rounded-lg transition-colors text-brand-muted hover:text-red-500" onClick={() => handleDelete(user.id)}>
                                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="5" className="px-6 py-12 text-center text-brand-muted">
                                <div className="flex flex-col items-center justify-center">
                                    <Users className="w-10 h-10 text-brand-border mb-3" />
                                    <p className="font-bold text-navy text-base">No users found</p>
                                    <p className="text-xs">Try searching for something else.</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </DataTable>
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingUser ? "Edit User Account" : "Invite New User"}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-navy">Full Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                className="input-base"
                                placeholder="Alice Smith"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-navy">Email Address <span className="text-red-500">*</span></label>
                            <input
                                type="email"
                                required
                                className="input-base"
                                placeholder="alice@medify.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-navy">Assign Role <span className="text-red-500">*</span></label>
                            <select
                                className="input-base"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option>Super Admin</option>
                                <option>Manager</option>
                                <option>Doctor</option>
                                <option>Staff</option>
                                <option>Content Editor</option>
                            </select>
                            <p className="text-[10px] text-brand-muted">Roles define what features this user can access in the admin panel.</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-navy">Account Status</label>
                            <select
                                className="input-base"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option>Active</option>
                                <option>Inactive</option>
                                <option>Suspended</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-brand-border flex items-center justify-end gap-3">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            {editingUser ? "Save Changes" : "Send Invite"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default UsersPage;
