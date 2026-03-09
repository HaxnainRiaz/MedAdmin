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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-navy">Global Settings</h2>
                    <p className="text-brand-muted text-sm">Configure website values, contact info, and system defaults.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-secondary" onClick={() => triggerToast("Settings reset to defaults", "info")}>
                        <RotateCcw className="w-4 h-4" />
                        Reset
                    </button>
                    <button className="btn-primary" onClick={() => triggerToast("Settings saved successfully!", "success")}>
                        <Save className="w-4 h-4" />
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Navigation Rail */}
                <div className="lg:w-64 shrink-0">
                    <div className="admin-card p-2 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-1 scrollbar-hide">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap",
                                        activeTab === tab.id
                                            ? "bg-primary text-white shadow-md shadow-primary/20"
                                            : "text-brand-muted hover:bg-brand-bg hover:text-navy"
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.id}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 space-y-6">
                    <div className="admin-card p-8">
                        <h3 className="text-xl font-bold text-navy mb-6 pb-4 border-b border-brand-border">{activeTab} Settings</h3>

                        {activeTab === "General" && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                                <div className="pt-6 border-t border-brand-border space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-bold text-navy">Maintenance Mode</p>
                                            <p className="text-xs text-brand-muted mt-0.5">Show a maintenance page to visitors.</p>
                                        </div>
                                        <div className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-brand-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-bold text-navy">Email Verification</p>
                                            <p className="text-xs text-brand-muted mt-0.5">Require users to verify email before booking.</p>
                                        </div>
                                        <div className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-brand-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "Contact" && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-navy">Support Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                                            <input type="email" className="input-base pl-10" defaultValue="support@medify.com" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-navy">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                                            <input type="text" className="input-base pl-10" defaultValue="+92 (300) 1234567" />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-sm font-bold text-navy">Primary Address</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 w-4 h-4 text-brand-muted" />
                                            <textarea className="input-base pl-10 h-24" defaultValue="Medical Center, Main Blvd, DHA Phase 5, Lahore, Pakistan"></textarea>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-brand-border">
                                    <h4 className="text-sm font-black text-navy uppercase tracking-widest mb-4">Working Hours</h4>
                                    <div className="space-y-3">
                                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                                            <div key={day} className="flex items-center justify-between text-sm">
                                                <span className="font-bold text-navy w-12">{day}</span>
                                                <div className="flex items-center gap-4">
                                                    <input type="time" className="input-base py-1 px-2 w-28 text-xs font-bold" defaultValue="09:00" />
                                                    <span className="text-brand-muted">to</span>
                                                    <input type="time" className="input-base py-1 px-2 w-28 text-xs font-bold" defaultValue="18:00" />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <label className="text-[10px] font-bold text-brand-muted uppercase">Closed</label>
                                                    <input type="checkbox" className="rounded" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "Branding" && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="p-6 bg-brand-bg rounded-2xl border border-brand-border/50 flex flex-col items-center text-center">
                                        <div className="w-16 h-16 bg-white rounded-xl shadow-sm border border-brand-border flex items-center justify-center mb-4">
                                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                                <span className="text-white font-bold text-xl">M</span>
                                            </div>
                                        </div>
                                        <h5 className="text-sm font-bold text-navy">Primary Logo</h5>
                                        <p className="text-xs text-brand-muted mt-1">SVG, PNG, JPG (Max 2MB)</p>
                                        <button className="mt-4 btn-secondary text-xs py-1.5 px-4" onClick={() => triggerToast("Logo upload dialog opened", "info")}>
                                            <Upload className="w-3.5 h-3.5" />
                                            Replace Logo
                                        </button>
                                    </div>
                                    <div className="p-6 bg-brand-bg rounded-2xl border border-brand-border/50 flex flex-col items-center text-center">
                                        <div className="w-16 h-16 bg-white rounded-xl shadow-sm border border-brand-border flex items-center justify-center mb-4">
                                            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
                                                <span className="text-white font-bold text-[10px]">M</span>
                                            </div>
                                        </div>
                                        <h5 className="text-sm font-bold text-navy">Favicon</h5>
                                        <p className="text-xs text-brand-muted mt-1">ICO, PNG (Max 512x512)</p>
                                        <button className="mt-4 btn-secondary text-xs py-1.5 px-4" onClick={() => triggerToast("Favicon upload dialog opened", "info")}>
                                            <Upload className="w-3.5 h-3.5" />
                                            Replace Icon
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-brand-border grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-navy">Primary Color</label>
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 rounded-lg bg-primary border shadow-sm shrink-0"></div>
                                            <input type="text" className="input-base font-mono text-xs uppercase" defaultValue="#3B82F6" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-navy">Success Color</label>
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 rounded-lg bg-emerald-500 border shadow-sm shrink-0"></div>
                                            <input type="text" className="input-base font-mono text-xs uppercase" defaultValue="#10B981" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-navy">Error Color</label>
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 rounded-lg bg-red-500 border shadow-sm shrink-0"></div>
                                            <input type="text" className="input-base font-mono text-xs uppercase" defaultValue="#EF4444" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab !== "General" && activeTab !== "Contact" && activeTab !== "Branding" && (
                            <div className="p-12 text-center bg-brand-bg/50 rounded-2xl border border-dashed border-brand-border">
                                <Settings className="w-12 h-12 text-brand-muted mx-auto mb-4 opacity-20" />
                                <p className="text-brand-muted font-medium italic">Settings for {activeTab} are coming soon.</p>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-3 px-2">
                        <span className="text-[10px] text-brand-muted font-bold italic">Last updated: Today at 02:45 PM by John Admin</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
