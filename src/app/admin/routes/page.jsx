"use client";

import React, { useState } from "react";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import Modal from "@/components/admin/shared/Modal";
import {
    Route,
    Search,
    Plus,
    Link2,
    AlertTriangle,
    RefreshCcw,
    Settings2,
    X,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/admin-utils";
import { useToast } from "@/components/admin/shared/ToastProvider";

const initialRoutes = [
    { id: "RT-10", path: "/", component: "HomeLanding", status: "Active", ctas: 4, isDynamic: false },
    { id: "RT-11", path: "/doctors", component: "DoctorsDirectory", status: "Active", ctas: 2, isDynamic: false },
    { id: "RT-12", path: "/doctors/[slug]", component: "DoctorProfile", status: "Active", ctas: 1, isDynamic: true },
    { id: "RT-13", path: "/services/[category]", component: "ServiceCategory", status: "Warning", ctas: 0, isDynamic: true, issue: "Missing redirect rules" },
    { id: "RT-14", path: "/about/careers", component: "CareersPage", status: "Inactive", ctas: 1, isDynamic: false },
    { id: "RT-15", path: "/portal/login", component: "PatientLogin", status: "Active", ctas: 1, isDynamic: false },
];

const RouteRegistryPage = () => {
    const { triggerToast } = useToast();
    const [routes, setRoutes] = useState(initialRoutes);
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [formData, setFormData] = useState({ path: "", component: "", isDynamic: false, status: "Active" });

    const filtered = routes.filter(r =>
        r.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.component.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openDetail = (route) => {
        setSelectedRoute(route);
        setIsDetailModalOpen(true);
    };

    const handleCreate = (e) => {
        e.preventDefault();
        const newRoute = {
            id: `RT-${Date.now()}`,
            ...formData,
            ctas: 0
        };
        setRoutes([...routes, newRoute]);
        setIsCreateModalOpen(false);
        setFormData({ path: "", component: "", isDynamic: false, status: "Active" });
        triggerToast(`Route "${newRoute.path}" registered`, "success");
    };

    const resolveWarnings = () => {
        setRoutes(routes.map(r => r.status === "Warning" ? { ...r, status: "Active", issue: undefined } : r));
        triggerToast("All route warnings resolved", "success");
    };

    const warningCount = routes.filter(r => r.status === "Warning").length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-navy flex items-center gap-2">
                        <Route className="w-6 h-6 text-primary" /> Route Registry
                    </h2>
                    <p className="text-brand-muted text-sm mt-1">Manage physical app routing, dynamic paths, and system redirects.</p>
                </div>
                <div className="flex items-center gap-3">
                    {warningCount > 0 && (
                        <button
                            className="btn-secondary text-orange-600 border-orange-200 bg-orange-50 hover:bg-orange-100"
                            onClick={resolveWarnings}
                        >
                            <AlertTriangle className="w-4 h-4" /> Resolve {warningCount} Warning{warningCount > 1 ? "s" : ""}
                        </button>
                    )}
                    <button
                        className="btn-primary"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        <Plus className="w-4 h-4" />
                        Register Route
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                    { label: "Total Active Routes", value: routes.filter(r => r.status === "Active").length, icon: Route, color: "text-blue-500" },
                    { label: "Dynamic Paths", value: routes.filter(r => r.isDynamic).length, icon: RefreshCcw, color: "text-purple-500" },
                    { label: "Warnings", value: warningCount, icon: AlertTriangle, color: "text-red-500", warning: warningCount > 0 },
                ].map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={idx} className={cn("admin-card p-6 border-t-4", stat.warning ? "border-red-500" : "border-primary")}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-brand-muted uppercase tracking-wider">{stat.label}</span>
                                <Icon className={cn("w-5 h-5", stat.color)} />
                            </div>
                            <span className="text-3xl font-black text-navy leading-none">{stat.value}</span>
                        </div>
                    );
                })}
            </div>

            <div className="admin-card overflow-hidden">
                <div className="p-4 border-b border-brand-border space-y-4">
                    <div className="flex justify-between items-center text-sm gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                            <input
                                type="text"
                                placeholder="Search paths or components..."
                                className="input-base pl-10 h-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-4 text-xs font-bold text-brand-muted">
                            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Active</span>
                            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-500"></div> Warnings</span>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-brand-bg/50 text-[10px] uppercase tracking-wider text-brand-muted font-bold">
                                <th className="px-6 py-4">URL Path</th>
                                <th className="px-6 py-4">React Component</th>
                                <th className="px-6 py-4">Status & Type</th>
                                <th className="px-6 py-4">Linked CTAs</th>
                                <th className="px-6 py-4 text-right">Settings</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border">
                            {filtered.map((route, idx) => (
                                <tr key={idx} className={cn("hover:bg-brand-bg/30 transition-colors group", route.status === "Warning" ? "bg-orange-50/30" : "")}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Link2 className="w-4 h-4 text-brand-muted" />
                                            <span className="text-sm font-mono font-bold text-navy bg-brand-bg px-2 py-0.5 rounded-md border border-brand-border">
                                                {route.path}
                                            </span>
                                        </div>
                                        {route.status === "Warning" && (
                                            <p className="text-[10px] text-orange-600 font-bold mt-1.5 flex items-center gap-1">
                                                <AlertTriangle className="w-3 h-3" /> {route.issue}
                                            </p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs text-brand-muted font-medium">{route.component}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1.5">
                                            <StatusBadge status={route.status} />
                                            <span className={cn("text-[10px] font-black tracking-widest uppercase inline-flex", route.isDynamic ? "text-purple-600" : "text-brand-muted")}>
                                                {route.isDynamic ? "Dynamic Segment" : "Static Route"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-100 mx-auto">
                                            {route.ctas}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-brand-muted hover:text-primary"
                                            onClick={() => openDetail(route)}
                                            title="View route settings"
                                        >
                                            <Settings2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Register Route Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Register Custom Route"
                maxWidth="max-w-lg"
            >
                <form onSubmit={handleCreate} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-navy">URL Path <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                className="input-base font-mono"
                                placeholder="/about/team"
                                value={formData.path}
                                onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-navy">Component Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                className="input-base font-mono"
                                placeholder="TeamPage"
                                value={formData.component}
                                onChange={(e) => setFormData({ ...formData, component: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-navy">Status</label>
                            <select className="input-base" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                                <option>Active</option>
                                <option>Inactive</option>
                            </select>
                        </div>
                        <label className="flex items-center gap-3 cursor-pointer p-3 bg-brand-bg rounded-xl border border-brand-border">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded text-primary"
                                checked={formData.isDynamic}
                                onChange={(e) => setFormData({ ...formData, isDynamic: e.target.checked })}
                            />
                            <div>
                                <p className="text-sm font-bold text-navy">Dynamic Segment</p>
                                <p className="text-xs text-brand-muted">Route contains [slug] or [id] params</p>
                            </div>
                        </label>
                    </div>
                    <div className="pt-6 border-t border-brand-border flex items-center justify-end gap-3">
                        <button type="button" onClick={() => setIsCreateModalOpen(false)} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary">Register Route</button>
                    </div>
                </form>
            </Modal>

            {/* Route Detail Modal */}
            <Modal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                title="Route Settings"
                maxWidth="max-w-lg"
            >
                {selectedRoute && (
                    <div className="space-y-6">
                        <div className="bg-brand-bg rounded-xl border border-brand-border p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-brand-muted uppercase tracking-widest">URL Path</span>
                                <span className="font-mono font-bold text-primary text-sm bg-primary/10 px-2 py-1 rounded">{selectedRoute.path}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-brand-muted uppercase tracking-widest">Component</span>
                                <span className="font-mono text-sm text-navy">{selectedRoute.component}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-brand-muted uppercase tracking-widest">Type</span>
                                <span className={cn("text-xs font-black uppercase tracking-widest", selectedRoute.isDynamic ? "text-purple-600" : "text-emerald-600")}>
                                    {selectedRoute.isDynamic ? "Dynamic" : "Static"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-brand-muted uppercase tracking-widest">Status</span>
                                <StatusBadge status={selectedRoute.status} />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-brand-muted uppercase tracking-widest">Linked CTAs</span>
                                <span className="font-bold text-navy text-sm">{selectedRoute.ctas}</span>
                            </div>
                        </div>

                        {selectedRoute.issue && (
                            <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                                <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-orange-700 text-sm">Warning Detected</p>
                                    <p className="text-xs text-orange-600 mt-1">{selectedRoute.issue}</p>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-border">
                            <button
                                className="btn-secondary"
                                onClick={() => {
                                    setRoutes(routes.map(r => r.id === selectedRoute.id
                                        ? { ...r, status: r.status === "Active" ? "Inactive" : "Active", issue: undefined }
                                        : r
                                    ));
                                    setIsDetailModalOpen(false);
                                    triggerToast(`Route ${selectedRoute.path} status updated`, "success");
                                }}
                            >
                                {selectedRoute.status === "Active" ? "Deactivate" : "Activate"}
                            </button>
                            <button className="btn-primary" onClick={() => {
                                setIsDetailModalOpen(false);
                                triggerToast("Route settings saved", "success");
                            }}>
                                <CheckCircle2 className="w-4 h-4" /> Save Settings
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default RouteRegistryPage;
