"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavigation } from "@/lib/admin-navigation";
import { cn } from "@/lib/admin-utils";
import { ChevronLeft, ChevronRight, LogOut, Search } from "lucide-react";
import { useToast } from "@/components/admin/shared/ToastProvider";

const Sidebar = ({ isCollapsed, onToggle }) => {
    const pathname = usePathname();
    const { triggerToast } = useToast();

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 h-screen bg-white border-r border-brand-border z-50 transition-all duration-300 ease-in-out flex flex-col",
                isCollapsed ? "w-[80px]" : "w-[280px]"
            )}
        >
            {/* Brand Logo */}
            <div className="h-[var(--header-height)] flex items-center px-6 border-bottom border-brand-border">
                <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
                        <span className="text-white font-bold text-xl">M</span>
                    </div>
                    {!isCollapsed && (
                        <span className="font-bold text-xl text-navy tracking-tight">
                            Medify<span className="text-primary">Admin</span>
                        </span>
                    )}
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 scrollbar-hide px-3">
                {adminNavigation.map((group, groupIndex) => (
                    <div key={groupIndex} className="mb-8">
                        {!isCollapsed && (
                            <h3 className="px-3 mb-2 text-xs font-semibold text-brand-muted uppercase tracking-wider">
                                {group.group}
                            </h3>
                        )}
                        <ul className="space-y-1">
                            {group.items.map((item, itemIndex) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;

                                return (
                                    <li key={itemIndex}>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                                                isActive
                                                    ? "bg-primary/10 text-primary font-medium"
                                                    : "text-charcoal hover:bg-brand-bg hover:text-navy"
                                            )}
                                        >
                                            <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-primary" : "text-brand-muted group-hover:text-navy")} />
                                            {!isCollapsed && (
                                                <span className="flex-1 truncate">{item.name}</span>
                                            )}
                                            {!isCollapsed && item.badge && (
                                                <span className="px-2 py-0.5 text-[10px] font-bold bg-primary text-white rounded-full">
                                                    {item.badge}
                                                </span>
                                            )}
                                            {isCollapsed && (
                                                <div className="absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 px-2 py-1 bg-navy text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                                    {item.name}
                                                </div>
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* Footer / Toggle */}
            <div className="p-3 border-t border-brand-border">
                <button
                    onClick={onToggle}
                    className="w-full flex items-center justify-center gap-3 p-2.5 rounded-lg text-charcoal hover:bg-brand-bg transition-colors"
                >
                    {isCollapsed ? <ChevronRight className="w-5 h-5" /> : (
                        <>
                            <ChevronLeft className="w-5 h-5" />
                            <span className="text-sm font-medium">Collapse Menu</span>
                        </>
                    )}
                </button>
                {!isCollapsed && (
                    <button
                        onClick={() => triggerToast("Signed out successfully (Mock)", "success")}
                        className="mt-2 w-full flex items-center gap-3 p-2.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm font-medium">Sign Out</span>
                    </button>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
