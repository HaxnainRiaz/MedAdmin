"use client";

import React, { useState } from "react";
import {
    KeyRound,
    Plus,
    Check,
    X,
    ShieldAlert,
    Edit2,
    Trash2,
    Save
} from "lucide-react";
import { cn } from "@/lib/admin-utils";
import { useToast } from "@/components/admin/shared/ToastProvider";
import Modal from "@/components/admin/shared/Modal";

const initialRoles = [
    { id: "ROLE-1", name: "Super Admin", users: 2, description: "Full system access including settings and destructive actions.", system: true },
    { id: "ROLE-2", name: "Doctor", users: 14, description: "Can manage own appointments and patient notes.", system: true },
    { id: "ROLE-3", name: "Manager", users: 4, description: "Can manage staff, clinic schedules, and view analytics.", system: false },
    { id: "ROLE-4", name: "Content Editor", users: 3, description: "Can write, edit, and publish blog posts and pages.", system: false },
    { id: "ROLE-5", name: "Support Staff", users: 8, description: "Can read and respond to inquiries and support tickets.", system: false },
];

const allPermissions = [
    { module: "Dashboard & Analytics", key: "dashboard" },
    { module: "Appointments & Schedule", key: "appointments" },
    { module: "Doctors & Staff", key: "doctors" },
    { module: "Website Content (Blog, Pages)", key: "content" },
    { module: "System Settings", key: "settings" },
    { module: "Support Tickets & Inquiries", key: "support" },
    { module: "User Management", key: "users" },
];

const defaultPerms = {
    "Super Admin": { dashboard: { view: true, create: true, edit: true, delete: true }, appointments: { view: true, create: true, edit: true, delete: true }, doctors: { view: true, create: true, edit: true, delete: true }, content: { view: true, create: true, edit: true, delete: true }, settings: { view: true, create: true, edit: true, delete: true }, support: { view: true, create: true, edit: true, delete: true }, users: { view: true, create: true, edit: true, delete: true } },
    "Doctor": { dashboard: { view: true, create: false, edit: false, delete: false }, appointments: { view: true, create: true, edit: true, delete: false }, doctors: { view: true, create: false, edit: false, delete: false }, content: { view: true, create: false, edit: false, delete: false }, settings: { view: false, create: false, edit: false, delete: false }, support: { view: false, create: false, edit: false, delete: false }, users: { view: false, create: false, edit: false, delete: false } },
    "Manager": { dashboard: { view: true, create: false, edit: true, delete: false }, appointments: { view: true, create: true, edit: true, delete: true }, doctors: { view: true, create: true, edit: true, delete: false }, content: { view: true, create: false, edit: false, delete: false }, settings: { view: true, create: false, edit: false, delete: false }, support: { view: true, create: true, edit: true, delete: false }, users: { view: true, create: true, edit: true, delete: false } },
    "Content Editor": { dashboard: { view: true, create: false, edit: false, delete: false }, appointments: { view: false, create: false, edit: false, delete: false }, doctors: { view: true, create: false, edit: false, delete: false }, content: { view: true, create: true, edit: true, delete: false }, settings: { view: false, create: false, edit: false, delete: false }, support: { view: false, create: false, edit: false, delete: false }, users: { view: false, create: false, edit: false, delete: false } },
    "Support Staff": { dashboard: { view: true, create: false, edit: false, delete: false }, appointments: { view: true, create: false, edit: false, delete: false }, doctors: { view: true, create: false, edit: false, delete: false }, content: { view: true, create: false, edit: false, delete: false }, settings: { view: false, create: false, edit: false, delete: false }, support: { view: true, create: true, edit: true, delete: false }, users: { view: false, create: false, edit: false, delete: false } },
};

const RolesPage = () => {
    const { triggerToast } = useToast();
    const [roles, setRoles] = useState(initialRoles);
    const [activeRole, setActiveRole] = useState(roles[0]);
    const [permissions, setPermissions] = useState(defaultPerms);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newRoleName, setNewRoleName] = useState("");
    const [newRoleDesc, setNewRoleDesc] = useState("");

    const currentPerms = permissions[activeRole.name] || {};

    const togglePermission = (moduleKey, action) => {
        if (activeRole.system) {
            triggerToast("System roles cannot be modified", "error");
            return;
        }
        setPermissions(prev => ({
            ...prev,
            [activeRole.name]: {
                ...prev[activeRole.name],
                [moduleKey]: {
                    ...(prev[activeRole.name]?.[moduleKey] || {}),
                    [action]: !(prev[activeRole.name]?.[moduleKey]?.[action])
                }
            }
        }));
    };

    const savePermissions = () => {
        triggerToast(`Permissions saved for ${activeRole.name}`, "success");
    };

    const deleteRole = (roleId) => {
        const role = roles.find(r => r.id === roleId);
        if (role.system) { triggerToast("Cannot delete a system role", "error"); return; }
        if (confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
            const newRoles = roles.filter(r => r.id !== roleId);
            setRoles(newRoles);
            setActiveRole(newRoles[0]);
            triggerToast("Role deleted", "success");
        }
    };

    const createRole = (e) => {
        e.preventDefault();
        if (!newRoleName.trim()) return;
        const newRole = {
            id: `ROLE-${Date.now()}`,
            name: newRoleName,
            users: 0,
            description: newRoleDesc,
            system: false
        };

        // Set default empty permissions
        const emptyPerms = {};
        allPermissions.forEach(p => {
            emptyPerms[p.key] = { view: false, create: false, edit: false, delete: false };
        });

        setRoles([...roles, newRole]);
        setPermissions(prev => ({ ...prev, [newRoleName]: emptyPerms }));
        setActiveRole(newRole);
        setIsCreateModalOpen(false);
        setNewRoleName("");
        setNewRoleDesc("");
        triggerToast(`Role "${newRoleName}" created`, "success");
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-navy">Roles & Permissions</h2>
                    <p className="text-brand-muted text-sm">Define access levels and granular permissions for staff accounts.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        className="btn-primary"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        <Plus className="w-4 h-4" />
                        Create Role
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Role List */}
                <div className="md:col-span-1 space-y-2">
                    {roles.map((role) => (
                        <div
                            key={role.id}
                            className={cn(
                                "w-full text-left p-4 rounded-xl border transition-all flex flex-col gap-2 cursor-pointer group",
                                activeRole.id === role.id ? "border-primary bg-primary/5 shadow-sm" : "border-brand-border bg-white hover:border-primary/30"
                            )}
                            onClick={() => setActiveRole(role)}
                        >
                            <div className="flex items-center justify-between">
                                <span className={cn("font-bold text-sm", activeRole.id === role.id ? "text-primary" : "text-navy")}>{role.name}</span>
                                <div className="flex items-center gap-1">
                                    {role.system && <ShieldAlert className="w-3.5 h-3.5 text-orange-500" />}
                                    {!role.system && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); deleteRole(role.id); }}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded text-red-400"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <span className="text-[10px] text-brand-muted uppercase tracking-widest font-black">{role.users} Active Users</span>
                        </div>
                    ))}
                </div>

                {/* Permissions Panel */}
                <div className="md:col-span-3 space-y-6">
                    <div className="admin-card p-6">
                        <div className="flex items-center justify-between mb-6 pb-6 border-b border-brand-border">
                            <div>
                                <h3 className="text-2xl font-black text-navy flex items-center gap-2">
                                    <KeyRound className="w-6 h-6 text-primary" /> {activeRole.name}
                                </h3>
                                <p className="text-brand-muted text-sm mt-1">{activeRole.description}</p>
                            </div>
                            {activeRole.system
                                ? <span className="btn-secondary text-xs opacity-60 cursor-default">System Role — Locked</span>
                                : <button className="btn-primary" onClick={savePermissions}><Save className="w-4 h-4" /> Save Permissions</button>
                            }
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-2 px-4">
                                <span className="text-xs font-black text-navy uppercase tracking-widest">Module</span>
                                <div className="flex items-center gap-6">
                                    {["View", "Create", "Edit", "Delete"].map(action => (
                                        <span key={action} className="text-[10px] font-bold uppercase tracking-widest text-brand-muted w-10 text-center">{action}</span>
                                    ))}
                                </div>
                            </div>

                            {allPermissions.map((perm) => {
                                const modPerms = currentPerms[perm.key] || {};
                                return (
                                    <div key={perm.key} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-brand-bg/50 rounded-xl border border-brand-border gap-4">
                                        <span className="font-bold text-navy text-sm md:w-64">{perm.module}</span>
                                        <div className="flex items-center gap-6 justify-between flex-1 md:justify-end">
                                            {["view", "create", "edit", "delete"].map(action => (
                                                <div key={action} className="flex flex-col items-center w-10">
                                                    <button
                                                        disabled={activeRole.system}
                                                        onClick={() => togglePermission(perm.key, action)}
                                                        className={cn(
                                                            "w-6 h-6 rounded flex items-center justify-center transition-all",
                                                            modPerms[action]
                                                                ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                                                                : "bg-white text-brand-muted border border-brand-border hover:border-red-200 hover:bg-red-50",
                                                            activeRole.system && "cursor-not-allowed"
                                                        )}
                                                    >
                                                        {modPerms[action] ? <Check className="w-4 h-4" /> : <X className="w-3 h-3 opacity-30" />}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}

                            {!activeRole.system && (
                                <div className="flex justify-end pt-4">
                                    <button className="btn-primary" onClick={savePermissions}>
                                        <Save className="w-4 h-4" /> Save Changes
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Role Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create New Role"
                maxWidth="max-w-lg"
            >
                <form onSubmit={createRole} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-navy">Role Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                className="input-base"
                                placeholder="e.g. Billing Assistant"
                                value={newRoleName}
                                onChange={(e) => setNewRoleName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-navy">Description</label>
                            <textarea
                                className="input-base min-h-[80px] py-3 resize-none"
                                placeholder="Describe what this role can do..."
                                value={newRoleDesc}
                                onChange={(e) => setNewRoleDesc(e.target.value)}
                            />
                        </div>
                        <p className="text-xs text-brand-muted bg-brand-bg p-3 rounded-lg border border-brand-border">
                            After creating the role, you can configure its permissions from the permission matrix.
                        </p>
                    </div>
                    <div className="pt-6 border-t border-brand-border flex items-center justify-end gap-3">
                        <button type="button" onClick={() => setIsCreateModalOpen(false)} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary">Create Role</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default RolesPage;
