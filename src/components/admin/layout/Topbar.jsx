"use client";

import React from "react";
import { Search, Bell, Command, User, ChevronDown, Plus, Menu } from "lucide-react";
import { useToast } from "@/components/admin/shared/ToastProvider";

const Topbar = ({ title, breadcrumbs = [], onMenuClick }) => {
    const { triggerToast } = useToast();

    return (
        <header className="h-[var(--header-height)] bg-white border-b border-brand-border sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between gap-4">
            {/* Left: Menu & Page Info */}
            <div className="flex items-center gap-3 min-w-0">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 hover:bg-brand-bg rounded-lg transition-colors shrink-0"
                >
                    <Menu className="w-5 h-5 text-navy" />
                </button>

                <div className="flex flex-col min-w-0">
                    {breadcrumbs.length > 0 && (
                        <nav className="hidden sm:flex items-center gap-2 mb-0.5">
                            {breadcrumbs.slice(0, 2).map((crumb, index) => (
                                <React.Fragment key={index}>
                                    <span className="text-[9px] text-brand-muted uppercase tracking-wider whitespace-nowrap">
                                        {crumb}
                                    </span>
                                    {index < breadcrumbs.slice(0, 2).length - 1 && (
                                        <span className="text-brand-muted text-[9px]">/</span>
                                    )}
                                </React.Fragment>
                            ))}
                        </nav>
                    )}
                    <h1 className="text-base sm:text-xl font-bold text-navy truncate leading-tight">{title}</h1>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                {/* Search Trigger */}
                <button
                    onClick={() => triggerToast("Global search opened (Mock)", "info")}
                    className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-brand-bg border border-brand-border rounded-lg text-brand-muted hover:border-primary/30 transition-all group"
                >
                    <Search className="w-4 h-4 group-hover:text-primary" />
                    <span className="text-sm">Search...</span>
                    <div className="hidden lg:flex items-center gap-1 ml-4 border border-brand-border bg-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                        <Command className="w-3 h-3" /> K
                    </div>
                </button>

                <div className="flex items-center gap-1.5 sm:gap-2 border-l border-brand-border pl-2 sm:pl-4">
                    {/* Quick Create - Hidden on very small screens or made compact */}
                    <button
                        onClick={() => triggerToast("Create menu opened (Mock)", "info")}
                        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    {/* Notifications */}
                    <button
                        onClick={() => triggerToast("You have 3 new notifications", "info")}
                        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-charcoal hover:bg-brand-bg rounded-lg transition-colors relative"
                    >
                        <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
                    </button>

                    {/* User Menu */}
                    <button
                        onClick={() => triggerToast("User menu opened (Mock)", "info")}
                        className="flex items-center gap-2 p-1 sm:p-1.5 hover:bg-brand-bg rounded-lg transition-colors border border-transparent hover:border-brand-border"
                    >
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center border border-blue-200 shrink-0">
                            <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                        </div>
                        <div className="hidden lg:flex flex-col items-start leading-tight">
                            <span className="text-sm font-semibold text-navy">Admin</span>
                            <span className="text-[10px] text-brand-muted">Super Admin</span>
                        </div>
                        <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-brand-muted" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
