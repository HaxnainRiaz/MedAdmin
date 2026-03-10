"use client";

import React, { useState } from "react";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import Modal from "@/components/admin/shared/Modal";
import DataTable from "@/components/admin/shared/DataTable";
import {
    Users as UsersIcon,
    Search,
    Filter,
    MoreHorizontal,
    ShieldCheck,
    ShieldAlert,
    UserPlus,
    Mail,
    Edit2,
    Trash2,
    CheckCircle2,
    Shield,
    Calendar,
    Eye,
    ChevronRight,
    Ban
} from "lucide-react";
import { cn } from "@/lib/admin-utils";
import UserDetailPanel from "@/components/admin/users/UserDetailPanel";

const initialUsers = [
    { id: "USR-001", name: "John Admin", email: "admin@medify.com", role: "Super Admin", created: "2023-11-15", status: "Active" },
    { id: "USR-002", name: "Dr. Robert Smith", email: "robert.s@medify.com", role: "Doctor", created: "2023-11-20", status: "Active" },
    { id: "USR-003", name: "Sarah Manager", email: "sarah@medify.com", role: "Manager", created: "2023-12-05", status: "Active" },
    { id: "USR-004", name: "Reception Desk 1", email: "frontdesk1@medify.com", role: "Staff", created: "2024-01-10", status: "Inactive" },
    { id: "USR-005", name: "Jane Editor", email: "jane@medify.com", role: "Content Editor", created: "2024-02-15", status: "Active" },
];

const UsersPage = () => {
    const [users, setUsers] = useState(initialUsers);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);
    const [isSplitView, setIsSplitView] = useState(false);
    const [activeUser, setActiveUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    // Advanced Filters
    const [filters, setFilters] = useState({
        role: "All",
        status: "All"
    });
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "", email: "", role: "Staff", status: "Active"
    });

    const triggerToast = () => {
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
    };

    // Filter logic
    const filteredUsers = users.filter(usr => {
        const matchesSearch = usr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            usr.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            usr.role.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = filters.role === "All" || usr.role === filters.role;
        const matchesStatus = filters.status === "All" || usr.status === filters.status;

        return matchesSearch && matchesRole && matchesStatus;
    });

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

    const openDetails = (user) => {
        setActiveUser(user);
        if (window.innerWidth > 1024) {
            setIsSplitView(true);
        } else {
            // Mobile: keep details simple for now, maybe another modal
            openEditModal(user);
        }
    };

    const handleUpdateStatus = (id, newStatus) => {
        setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
        triggerToast();
    };

    const toggleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(filteredUsers.map(u => u.id));
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

    const handleBulkStatusChange = (newStatus) => {
        setUsers(users.map(usr =>
            selectedIds.includes(usr.id) ? { ...usr, status: newStatus } : usr
        ));
        setSelectedIds([]);
        triggerToast();
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
                <div className="flex items-center gap-2">
                    <button className="btn-secondary h-10 px-3 text-brand-muted hover:text-navy">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                    <button className="btn-primary flex-1 sm:flex-none py-2 px-3 text-xs sm:text-sm whitespace-nowrap" onClick={openCreateModal}>
                        <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Invite User
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {[
                    { label: "Total Users", value: users.length, icon: UsersIcon, color: "blue" },
                    { label: "Active Now", value: users.filter(u => u.status === 'Active').length, icon: ShieldCheck, color: "green" },
                    { label: "Super Admins", value: users.filter(u => u.role === 'Super Admin').length, icon: ShieldAlert, color: "orange" },
                    { label: "Staff/Doctors", value: users.filter(u => u.role !== 'Super Admin').length, icon: Shield, color: "purple" },
                ].map((stat, idx) => (
                    <div key={idx} className="admin-card p-3 sm:p-4 flex flex-col group hover:border-primary/50 transition-all cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] sm:text-xs font-semibold text-brand-muted uppercase tracking-wider">{stat.label}</span>
                            <div className={cn("p-1.5 rounded-lg",
                                stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                                    stat.color === 'green' ? 'bg-emerald-50 text-emerald-600' :
                                        stat.color === 'orange' ? 'bg-orange-50 text-orange-600' : 'bg-purple-50 text-purple-600'
                            )}>
                                <stat.icon className="w-4 h-4" />
                            </div>
                        </div>
                        <span className="text-lg sm:text-2xl font-bold text-navy">{stat.value}</span>
                    </div>
                ))}
            </div>

            <div className="admin-card overflow-hidden">
                <div className="p-3 sm:p-4 border-b border-brand-border space-y-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
                        <div className="flex items-center gap-2 flex-1 w-full">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    className="input-base pl-10 h-10 text-sm w-full"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className={cn("btn-secondary h-10 px-3 shrink-0 flex items-center gap-2", isFilterOpen && "bg-primary/5 text-primary border-primary/20")}
                            >
                                <Filter className="w-4 h-4" />
                                <span className="hidden sm:inline text-xs font-bold">Filters</span>
                            </button>
                        </div>
                        <div className="flex items-center gap-4 text-[11px] sm:text-xs font-bold text-brand-muted sm:border-l sm:border-brand-border sm:pl-4">
                            <div className="flex items-center gap-1.5 underline underline-offset-4 decoration-primary/20">
                                <UsersIcon className="w-3.5 h-3.5 text-navy" />
                                <span>{users.length} Total</span>
                            </div>
                            <div className="flex items-center gap-1.5 underline underline-offset-4 decoration-orange-400/20">
                                <ShieldAlert className="w-3.5 h-3.5 text-primary" />
                                <span>{users.filter(u => u.role === "Super Admin").length} Admins</span>
                            </div>
                        </div>
                    </div>

                    {isFilterOpen && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-brand-bg rounded-xl border border-brand-border animate-in slide-in-from-top-2">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Role</label>
                                <select
                                    className="input-base h-9 text-xs"
                                    value={filters.role}
                                    onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                                >
                                    <option>All</option>
                                    <option>Super Admin</option>
                                    <option>Manager</option>
                                    <option>Doctor</option>
                                    <option>Staff</option>
                                    <option>Content Editor</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Status</label>
                                <select
                                    className="input-base h-9 text-xs"
                                    value={filters.status}
                                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                >
                                    <option>All</option>
                                    <option>Active</option>
                                    <option>Inactive</option>
                                    <option>Suspended</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button className="btn-secondary h-9 w-full text-xs font-bold" onClick={() => setFilters({ role: 'All', status: 'All' })}>Reset</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Table with Split View Support */}
                <div className="flex overflow-hidden min-h-[500px]">
                    <div className={cn("flex-1 overflow-y-auto transition-all duration-300", isSplitView ? "hidden xl:block" : "block")}>
                        <DataTable
                            headers={[
                                <input
                                    type="checkbox"
                                    className="rounded border-brand-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                                    onChange={toggleSelectAll}
                                    checked={selectedIds.length === filteredUsers.length && filteredUsers.length > 0}
                                />,
                                "User",
                                "Access",
                                "Status",
                                { content: "Created", className: "hidden sm:table-cell" },
                                { content: "Action", className: "text-right" }
                            ]}
                            mobileContent={filteredUsers.length > 0 ? filteredUsers.map((user, idx) => (
                                <div key={idx} className="bg-white p-4 rounded-xl border border-brand-border shadow-soft flex flex-col gap-4 relative">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                className="rounded border-brand-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                                                checked={selectedIds.includes(user.id)}
                                                onChange={() => toggleSelect(user.id)}
                                            />
                                            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold text-sm border border-primary/20">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-navy">{user.name}</h4>
                                                <p className="text-[10px] text-brand-muted">{user.email}</p>
                                            </div>
                                        </div>
                                        <StatusBadge status={user.status} />
                                    </div>
                                    <div className="flex items-center justify-between bg-brand-bg/50 p-2 rounded-lg border border-brand-border/50">
                                        <div className="flex items-center gap-2">
                                            <Shield className="w-3.5 h-3.5 text-primary" />
                                            <span className="text-[11px] font-bold text-charcoal">{user.role}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-brand-muted">
                                            <Calendar className="w-3 h-3" />
                                            <span className="text-[10px] font-medium">{user.created}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="flex-1 btn-secondary py-2 text-xs" onClick={() => openEditModal(user)}>Edit</button>
                                        <button className="flex-1 btn-primary py-2 text-xs" onClick={() => openDetails(user)}>View Details</button>
                                    </div>
                                </div>
                            )) : null}
                        >
                            {filteredUsers.length > 0 ? filteredUsers.map((user, idx) => (
                                <tr key={idx} className={cn("hover:bg-brand-bg/30 transition-colors group cursor-pointer", selectedIds.includes(user.id) || activeUser?.id === user.id ? "bg-primary/5" : "")} onClick={(e) => {
                                    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
                                        openDetails(user);
                                    }
                                }}>
                                    <td onClick={(e) => e.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            className="rounded border-brand-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                                            checked={selectedIds.includes(user.id)}
                                            onChange={() => toggleSelect(user.id)}
                                        />
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-3 min-w-[180px]">
                                            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-sm font-bold text-navy">{user.name}</span>
                                                <div className="flex items-center gap-1.5 mt-0.5 min-w-0">
                                                    <Mail className="w-3 h-3 text-brand-muted shrink-0" />
                                                    <span className="text-[10px] text-brand-muted truncate">{user.email}</span>
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
                                            <button className="p-2 hover:bg-brand-bg rounded-lg transition-colors text-brand-muted hover:text-primary" onClick={() => openDetails(user)}>
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <div className="relative group/more">
                                                <button className="p-2 hover:bg-brand-bg rounded-lg transition-colors text-brand-muted hover:text-navy">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>
                                                <div className="absolute right-0 top-full mt-1 hidden group-hover/more:block z-50 bg-white border border-brand-border rounded-xl shadow-premium p-1 min-w-[140px] text-left">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); openEditModal(user); }}
                                                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-navy hover:bg-brand-bg rounded-lg"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" /> Edit User
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleUpdateStatus(user.id, 'Inactive'); }}
                                                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-orange-600 hover:bg-orange-50 rounded-lg"
                                                    >
                                                        <Ban className="w-3.5 h-3.5" /> Suspend
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(user.id); }}
                                                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" /> Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-brand-muted">
                                        <div className="flex flex-col items-center justify-center">
                                            <UsersIcon className="w-10 h-10 text-brand-border mb-3" />
                                            <p className="font-bold text-navy text-base">No users found</p>
                                            <p className="text-xs">Try adjusting your filters or search query.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </DataTable>
                    </div>

                    {/* Side Panel */}
                    {isSplitView && activeUser && (
                        <div className="w-[450px] shrink-0 border-l border-brand-border bg-white shadow-soft z-10">
                            <UserDetailPanel
                                user={activeUser}
                                onClose={() => setIsSplitView(false)}
                                onEdit={openEditModal}
                                onDelete={handleDelete}
                                onUpdateStatus={handleUpdateStatus}
                            />
                        </div>
                    )}
                </div>

                {/* Bulk Actions Bar */}
                {selectedIds.length > 0 && (
                    <div className="p-3 sm:p-4 bg-navy text-white flex flex-col sm:flex-row items-center justify-between gap-3 animate-in slide-in-from-bottom-2">
                        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                            <span className="text-xs sm:text-sm font-medium whitespace-nowrap">{selectedIds.length} selected</span>
                            <div className="flex items-center gap-2 flex-1">
                                <button className="flex-1 sm:flex-none px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-[11px] font-bold transition-colors" onClick={() => handleBulkStatusChange('Active')}>Activate</button>
                                <button className="flex-1 sm:flex-none px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-bold transition-colors" onClick={() => handleBulkStatusChange('Inactive')}>Suspend</button>
                                <button className="flex-1 sm:flex-none px-3 py-1.5 bg-red-500/80 hover:bg-red-600 text-white rounded-lg text-[11px] font-bold transition-colors" onClick={() => {
                                    if (confirm(`Remove ${selectedIds.length} users?`)) {
                                        setUsers(users.filter(u => !selectedIds.includes(u.id)));
                                        setSelectedIds([]);
                                        triggerToast();
                                    }
                                }}>Delete</button>
                            </div>
                        </div>
                        <button className="text-[11px] text-white/60 hover:text-white transition-colors underline" onClick={() => setSelectedIds([])}>Clear selection</button>
                    </div>
                )}
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
