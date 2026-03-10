"use client";

import React, { useState } from "react";
import {
    Settings,
    Globe,
    Share2,
    Search,
    ShieldCheck,
    Save,
    RotateCcw,
    Upload,
    MapPin,
    Phone,
    Mail
} from "lucide-react";
import { cn } from "@/lib/admin-utils";
import { useToast } from "@/components/admin/shared/ToastProvider";

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState("General");
    const { triggerToast } = useToast();

    const tabs = [
        { id: "General", icon: Settings },
        { id: "Branding", icon: Globe },
        { id: "Contact", icon: Phone },
        { id: "SEO", icon: Search },
        { id: "Social", icon: Share2 },
        { id: "Security", icon: ShieldCheck },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-navy">Global Settings</h2>
                    <p className="text-brand-muted text-xs sm:text-sm">Configure system values and defaults.</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <button className="btn-secondary flex-1 sm:flex-none py-2 px-3 text-xs sm:text-sm" onClick={() => triggerToast("Settings reset to defaults", "info")}>
                        <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Reset
                    </button>
                    <button className="btn-primary flex-1 sm:flex-none py-2 px-3 text-xs sm:text-sm" onClick={() => triggerToast("Settings saved successfully!", "success")}>
                        <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
                {/* Navigation Rail */}
                <div className="lg:w-64 shrink-0 -mx-4 sm:mx-0">
                    <div className="admin-card p-2 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-1 scrollbar-hide px-4 sm:px-2 border-x-0 sm:border-x rounded-none sm:rounded-2xl">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap",
                                        activeTab === tab.id
                                            ? "bg-primary text-white shadow-md shadow-primary/20"
                                            : "text-brand-muted hover:bg-brand-bg hover:text-navy"
                                    )}
                                >
                                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    {tab.id}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 space-y-6">
                    <div className="admin-card p-4 sm:p-8">
                        <h3 className="text-lg sm:text-xl font-bold text-navy mb-4 sm:mb-6 pb-4 border-b border-brand-border">{activeTab} Settings</h3>

                        {activeTab === "General" && (
                            <div className="space-y-6 sm:space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-navy">Clinic Name</label>
                                        <input type="text" className="input-base" defaultValue="Medify Medical Center" />
                                        <p className="text-[10px] text-brand-muted">Used in page titles and branding.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-navy">Tagline</label>
                                        <input type="text" className="input-base" defaultValue="Modern Healthcare for Everyone" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-navy">Timezone</label>
                                        <select className="input-base">
                                            <option>(GMT+05:00) Islamabad, Karachi</option>
                                            <option>(GMT+00:00) UTC</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-navy">Language</label>
                                        <select className="input-base">
                                            <option>English (US)</option>
                                            <option>Arabic</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-brand-border space-y-4 sm:space-y-6">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-navy">Maintenance Mode</p>
                                            <p className="text-[11px] sm:text-xs text-brand-muted mt-0.5 leading-tight">Show a maintenance page to visitors.</p>
                                        </div>
                                        <div className="relative inline-flex items-center cursor-pointer shrink-0">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-10 sm:w-11 h-5 sm:h-6 bg-brand-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 sm:after:h-5 after:w-4 sm:after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-navy">Email Verification</p>
                                            <p className="text-[11px] sm:text-xs text-brand-muted mt-0.5 leading-tight">Require users to verify email before booking.</p>
                                        </div>
                                        <div className="relative inline-flex items-center cursor-pointer shrink-0">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-10 sm:w-11 h-5 sm:h-6 bg-brand-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 sm:after:h-5 after:w-4 sm:after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "Contact" && (
                            <div className="space-y-6 sm:space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-navy">Support Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-muted" />
                                            <input type="email" className="input-base pl-9 sm:pl-10 h-10 text-sm" defaultValue="support@medify.com" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-navy">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-muted" />
                                            <input type="text" className="input-base pl-9 sm:pl-10 h-10 text-sm" defaultValue="+92 (300) 1234567" />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-sm font-bold text-navy">Primary Address</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-muted" />
                                            <textarea className="input-base pl-9 sm:pl-10 h-20 sm:h-24 text-sm resize-none" defaultValue="Medical Center, Main Blvd, DHA Phase 5, Lahore, Pakistan"></textarea>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-brand-border">
                                    <h4 className="text-[11px] font-black text-navy uppercase tracking-widest mb-4">Working Hours</h4>
                                    <div className="space-y-3 sm:space-y-4">
                                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                                            <div key={day} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm p-3 sm:p-0 bg-brand-bg sm:bg-transparent rounded-xl sm:rounded-none">
                                                <span className="font-bold text-navy w-12">{day}</span>
                                                <div className="flex items-center gap-2 sm:gap-4 flex-1">
                                                    <input type="time" className="input-base py-1.5 px-2 flex-1 sm:w-28 text-[11px] sm:text-xs font-bold h-9" defaultValue="09:00" />
                                                    <span className="text-brand-muted text-[11px]">to</span>
                                                    <input type="time" className="input-base py-1.5 px-2 flex-1 sm:w-28 text-[11px] sm:text-xs font-bold h-9" defaultValue="18:00" />
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0 sm:pl-4 border-t sm:border-t-0 pt-2 sm:pt-0">
                                                    <input type="checkbox" id={`closed-${day}`} className="rounded border-brand-border h-4 w-4" />
                                                    <label htmlFor={`closed-${day}`} className="text-[10px] font-black text-brand-muted uppercase tracking-wider cursor-pointer">Mark as Closed</label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "Branding" && (
                            <div className="space-y-6 sm:space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                                    <div className="p-4 sm:p-6 bg-brand-bg rounded-2xl border border-brand-border/50 flex flex-col items-center text-center">
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-xl shadow-sm border border-brand-border flex items-center justify-center mb-4">
                                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                                <span className="text-white font-bold text-xl">M</span>
                                            </div>
                                        </div>
                                        <h5 className="text-sm font-bold text-navy">Primary Logo</h5>
                                        <p className="text-[10px] sm:text-xs text-brand-muted mt-1 leading-tight">SVG, PNG, JPG (Max 2MB)</p>
                                        <button className="mt-4 btn-secondary text-[11px] py-1.5 px-4 w-full sm:w-auto" onClick={() => triggerToast("Logo upload dialog opened", "info")}>
                                            <Upload className="w-3.5 h-3.5" />
                                            Replace Logo
                                        </button>
                                    </div>
                                    <div className="p-4 sm:p-6 bg-brand-bg rounded-2xl border border-brand-border/50 flex flex-col items-center text-center">
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-xl shadow-sm border border-brand-border flex items-center justify-center mb-4">
                                            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
                                                <span className="text-white font-bold text-[10px]">M</span>
                                            </div>
                                        </div>
                                        <h5 className="text-sm font-bold text-navy">Favicon</h5>
                                        <p className="text-[10px] sm:text-xs text-brand-muted mt-1 leading-tight">ICO, PNG (Max 512x512)</p>
                                        <button className="mt-4 btn-secondary text-[11px] py-1.5 px-4 w-full sm:w-auto" onClick={() => triggerToast("Favicon upload dialog opened", "info")}>
                                            <Upload className="w-3.5 h-3.5" />
                                            Replace Icon
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-brand-border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-navy">Primary Color</label>
                                        <div className="flex items-center gap-2">
                                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary border shadow-sm shrink-0"></div>
                                            <input type="text" className="input-base font-mono text-[11px] sm:text-xs uppercase h-9" defaultValue="#3B82F6" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-navy">Success Color</label>
                                        <div className="flex items-center gap-2">
                                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-emerald-500 border shadow-sm shrink-0"></div>
                                            <input type="text" className="input-base font-mono text-[11px] sm:text-xs uppercase h-9" defaultValue="#10B981" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-navy">Error Color</label>
                                        <div className="flex items-center gap-2">
                                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-red-500 border shadow-sm shrink-0"></div>
                                            <input type="text" className="input-base font-mono text-[11px] sm:text-xs uppercase h-9" defaultValue="#EF4444" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab !== "General" && activeTab !== "Contact" && activeTab !== "Branding" && (
                            <div className="p-8 sm:p-12 text-center bg-brand-bg/50 rounded-2xl border border-dashed border-brand-border">
                                <Settings className="w-10 h-10 sm:w-12 sm:h-12 text-brand-muted mx-auto mb-4 opacity-20" />
                                <p className="text-sm text-brand-muted font-medium italic">Settings for {activeTab} are coming soon.</p>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-3 px-2">
                        <span className="text-[9px] sm:text-[10px] text-brand-muted font-bold italic text-right">Last updated: Today at 02:45 PM by John Admin</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
