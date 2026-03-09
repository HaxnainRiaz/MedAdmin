"use client";

import React from "react";
import { Search, Bell, Command, User, ChevronDown, Plus } from "lucide-react";
import { cn } from "@/lib/admin-utils";
import { useToast } from "@/components/admin/shared/ToastProvider";

const Topbar = ({ title, breadcrumbs = [] }) => {
    const { triggerToast } = useToast();

    return (
        <header className="h-[var(--header-height)] bg-white border-b border-brand-border sticky top-0 z-40 px-6 flex items-center justify-between">
            {/* Page Info */}
            <div className="flex flex-col">
                {breadcrumbs.length > 0 && (
                    <nav className="flex items-center gap-2 mb-1">
                        {breadcrumbs.map((crumb, index) => (
                            <React.Fragment key={index}>
                                <span className="text-[10px] text-brand-muted uppercase tracking-wider hover:text-primary cursor-pointer transition-colors">
                                    {crumb}
                                </span>
                                {index < breadcrumbs.length - 1 && (
                                    <span className="text-brand-muted text-[10px]">/</span>
                                )}
                            </React.Fragment>
                        ))}
                    </nav>
                )}
                <h1 className="text-xl font-bold text-navy truncate">{title}</h1>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                {/* Search Trigger */}
                <button
                    onClick={() => triggerToast("Global search opened (Mock)", "info")}
                    className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-brand-bg border border-brand-border rounded-lg text-brand-muted hover:border-primary/30 transition-all group"
                >
                    <Search className="w-4 h-4 group-hover:text-primary" />
                    <span className="text-sm">Search anything...</span>
                    <div className="flex items-center gap-1 ml-4 border border-brand-border bg-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                        <Command className="w-3 h-3" /> K
                    </div>
                </button>

                <div className="flex items-center gap-2 border-l border-brand-border pl-4">
                    {/* Quick Create */}
                    <button
                        onClick={() => triggerToast("Create menu opened (Mock)", "info")}
                        className="w-9 h-9 flex items-center justify-center bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm"
                    >
                        <Plus className="w-5 h-5" />
                    </button>

                    {/* Notifications */}
                    <button
                        onClick={() => triggerToast("You have 3 new notifications", "info")}
                        className="w-9 h-9 flex items-center justify-center text-charcoal hover:bg-brand-bg rounded-lg transition-colors relative"
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
                    </button>

                    {/* User Menu */}
                    <button
                        onClick={() => triggerToast("User menu opened (Mock)", "info")}
                        className="flex items-center gap-2 p-1.5 hover:bg-brand-bg rounded-lg transition-colors border border-transparent hover:border-brand-border"
                    >
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center border border-blue-200">
                            <User className="w-5 h-5 text-primary" />
                        </div>
                        <div className="hidden lg:flex flex-col items-start leading-tight">
                            <span className="text-sm font-semibold text-navy">Admin User</span>
                            <span className="text-[10px] text-brand-muted">Super Admin</span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-brand-muted" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
