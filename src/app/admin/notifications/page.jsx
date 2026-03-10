"use client";

import React, { useState } from "react";
import {
    Bell,
    CheckCircle2,
    Search,
    Settings,
    MailWarning,
    X
} from "lucide-react";
import { useToast } from "@/components/admin/shared/ToastProvider";
import { cn } from "@/lib/admin-utils";

const initialNotifications = [
    { id: "NOT-1", type: "system", title: "System Maintenance", message: "Server will undergo maintenance tonight at 2 AM EST.", date: "10 mins ago", read: false },
    { id: "NOT-2", type: "appointment", title: "New Appointment Request", message: "Michael Brown requested an appointment with Dr. Wong.", date: "1 hour ago", read: false },
    { id: "NOT-3", type: "inquiry", title: "High Priority Inquiry", message: "Patient submitted an urgent billing inquiry.", date: "3 hours ago", read: true },
    { id: "NOT-4", type: "content", title: "Blog Post Published", message: "Your post 'Heart Health Tips' went live.", date: "Yesterday, 10:00 AM", read: true },
    { id: "NOT-5", type: "system", title: "New User Account Created", message: "Jane Editor's account has been approved and activated.", date: "Yesterday, 3:30 PM", read: true },
];

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState(initialNotifications);
    const [activeTab, setActiveTab] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const { triggerToast } = useToast();

    const getTypeIcon = (type) => {
        switch (type) {
            case "system": return <Settings className="w-4 h-4 text-brand-muted" />;
            case "appointment": return <Bell className="w-4 h-4 text-blue-500" />;
            case "inquiry": return <MailWarning className="w-4 h-4 text-orange-500" />;
            default: return <Bell className="w-4 h-4 text-primary" />;
        }
    };

    const markAsRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const dismiss = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
        triggerToast("Notification dismissed", "success");
    };

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        triggerToast("All notifications marked as read", "success");
    };

    const filteredNotifications = notifications.filter(n => {
        const matchesTab =
            activeTab === "All" ? true :
                activeTab === "Unread" ? !n.read :
                    activeTab === "System" ? n.type === "system" :
                        activeTab === "Appointments" ? n.type === "appointment" : true;
        const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.message.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-navy">Notifications Center</h2>
                    <p className="text-brand-muted text-xs sm:text-sm">Manage system alerts and team activity notifications.</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto">
                    <button
                        className="btn-secondary h-10 px-3 sm:px-4 text-xs sm:text-sm"
                        onClick={() => triggerToast("Alert preference settings opened", "info")}
                    >
                        <Settings className="w-4 h-4" />
                        <span className="hidden sm:inline">Preferences</span>
                    </button>
                    <button
                        className="btn-primary h-10 px-3 sm:px-4 text-xs sm:text-sm"
                        onClick={markAllRead}
                        disabled={unreadCount === 0}
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        Mark All Read
                    </button>
                </div>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {[
                    { label: "Total Notifications", value: notifications.length },
                    { label: "Unread Alerts", value: unreadCount },
                    { label: "System Alerts", value: notifications.filter(n => n.type === 'system').length },
                    { label: "Clinic Updates", value: notifications.filter(n => n.type === 'appointment').length }
                ].map((stat, idx) => (
                    <div key={idx} className="admin-card p-3 sm:p-4 flex flex-col">
                        <span className="text-[10px] sm:text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1 truncate">{stat.label}</span>
                        <div className="flex items-center gap-2">
                            <span className="text-lg sm:text-xl font-bold text-navy">{stat.value}</span>
                            {stat.label === "Unread Alerts" && stat.value > 0 && (
                                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="admin-card overflow-hidden">
                <div className="p-3 sm:p-4 border-b border-brand-border space-y-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-center bg-brand-bg p-1 rounded-xl overflow-x-auto no-scrollbar">
                            {["All", "Unread", "System", "Appointments"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={cn(
                                        "px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap",
                                        activeTab === tab
                                            ? "bg-white text-primary shadow-sm"
                                            : "text-brand-muted hover:text-navy"
                                    )}
                                >
                                    {tab}
                                    {tab === "Unread" && unreadCount > 0 && (
                                        <span className="w-4 h-4 bg-primary text-white rounded-full text-[9px] font-black inline-flex items-center justify-center">{unreadCount}</span>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="relative w-full lg:max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                            <input
                                type="text"
                                placeholder="Search notifications..."
                                className="input-base pl-10 h-10 text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-brand-border">
                    {filteredNotifications.length > 0 ? filteredNotifications.map((notif, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "p-3 sm:p-5 flex items-start gap-3 sm:gap-4 transition-colors hover:bg-brand-bg/30 group cursor-pointer",
                                !notif.read && "bg-primary/5"
                            )}
                            onClick={() => markAsRead(notif.id)}
                        >
                            <div className={cn(
                                "w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 border transition-all",
                                notif.read ? "bg-brand-bg border-brand-border" : "bg-white border-primary/20 shadow-sm ring-2 ring-primary/5"
                            )}>
                                {getTypeIcon(notif.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                                    <h4 className={cn("text-sm font-bold truncate", notif.read ? "text-navy" : "text-primary")}>{notif.title}</h4>
                                    <span className="text-[9px] sm:text-[10px] text-brand-muted font-bold tracking-widest uppercase shrink-0">{notif.date}</span>
                                </div>
                                <p className="text-xs sm:text-sm text-charcoal mt-1 line-clamp-2">{notif.message}</p>
                            </div>
                            <div className="shrink-0 flex items-center gap-2">
                                {!notif.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0"></div>}
                                <button
                                    className="p-1.5 hover:bg-red-50 rounded-lg text-brand-muted hover:text-red-500 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                                    onClick={(e) => { e.stopPropagation(); dismiss(notif.id); }}
                                    title="Dismiss"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="p-12 text-center">
                            <Bell className="w-12 h-12 text-brand-border mx-auto mb-3" />
                            <p className="font-bold text-navy text-lg">No notifications</p>
                            <p className="text-sm text-brand-muted mt-1">You're all caught up!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationsPage;
