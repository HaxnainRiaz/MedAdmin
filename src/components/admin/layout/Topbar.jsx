"use client";

import React from "react";
import { Search, Bell, Command, User, ChevronDown, Plus, Menu } from "lucide-react";
import { useToast } from "@/components/admin/shared/ToastProvider";

const Topbar = ({ title, breadcrumbs = [], onMenuClick }) => {
    const { triggerToast } = useToast();

    return (
        <header className="bg-white border-b border-brand-border sticky top-0 z-40 px-4 sm:px-6 md:px-8 py-3 md:py-0 md:h-[var(--header-height)] flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Top Row (Mobile & Desktop) */}
            <div className="flex items-center justify-between w-full md:w-auto min-w-0 gap-4">
                <div className="flex items-center gap-3 min-w-0">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 hover:bg-brand-bg rounded-lg transition-colors shrink-0 -ml-2"
                    >
                        <Menu className="w-5 h-5 text-navy" />
                    </button>

                    <div className="flex flex-col min-w-0">
                        {breadcrumbs.length > 0 && (
                            <nav className="hidden sm:flex items-center gap-2 mb-0.5">
                                {breadcrumbs.slice(0, 2).map((crumb, index) => (
                                    <React.Fragment key={index}>
                                        <span className="text-[10px] text-brand-muted uppercase tracking-wider font-bold whitespace-nowrap">
                                            {crumb}
                                        </span>
                                        {index < breadcrumbs.slice(0, 2).length - 1 && (
                                            <span className="text-brand-muted text-[10px]">/</span>
                                        )}
                                    </React.Fragment>
                                ))}
                            </nav>
                        )}
                        <h1 className="text-lg md:text-xl font-bold text-navy truncate leading-tight">{title}</h1>
                    </div>
                </div>

                {/* Mobile Actions Right */}
                <div className="flex items-center gap-2 md:hidden">
                    <button
                        onClick={() => triggerToast("You have 3 new notifications", "info")}
                        className="w-10 h-10 flex items-center justify-center text-charcoal hover:bg-brand-bg rounded-lg transition-colors relative"
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
                    </button>
                    <button
                        onClick={() => triggerToast("User menu opened (Mock)", "info")}
                        className="flex items-center gap-2 p-1 bg-brand-bg rounded-lg transition-colors border border-transparent border-brand-border"
                    >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-100 text-primary border border-blue-200 shrink-0">
                            <User className="w-4 h-4" />
                        </div>
                    </button>
                </div>
            </div>

            {/* Bottom Row Mobile / Right Area Desktop */}
            <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
                <button
                    onClick={() => triggerToast("Global search opened", "info")}
                    className="flex-1 md:flex-none flex items-center gap-2 px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-muted hover:border-primary/30 transition-all group"
                >
                    <Search className="w-4 h-4 group-hover:text-primary shrink-0" />
                    <span className="text-sm font-medium w-full text-left">Search...</span>
                    <div className="hidden lg:flex items-center gap-1 ml-4 border border-brand-border bg-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                        <Command className="w-3 h-3" /> K
                    </div>
                </button>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-2 border-l border-brand-border pl-4">
                    <button
                        onClick={() => triggerToast("Create menu opened", "info")}
                        className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm shrink-0"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => triggerToast("You have 3 new notifications", "info")}
                        className="w-10 h-10 flex items-center justify-center text-charcoal hover:bg-brand-bg rounded-lg transition-colors relative shrink-0"
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                    </button>

                    <button
                        onClick={() => triggerToast("User menu opened", "info")}
                        className="flex items-center gap-2 p-1.5 hover:bg-brand-bg rounded-lg transition-colors border border-transparent hover:border-brand-border"
                    >
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center border border-blue-200 shrink-0">
                            <User className="w-5 h-5 text-primary" />
                        </div>
                        <div className="hidden lg:flex flex-col items-start leading-none px-1">
                            <span className="text-sm font-bold text-navy">Admin</span>
                            <span className="text-[10px] text-brand-muted font-bold mt-1">Super Admin</span>
                        </div>
                        <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-brand-muted ml-1" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
