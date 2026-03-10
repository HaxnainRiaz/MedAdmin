"use client";

import React, { useState } from "react";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import { useToast } from "@/components/admin/shared/ToastProvider";
import {
    Settings,
    ShieldCheck,
    Bell,
    FileLock,
    Webhook,
    Save,
    RotateCcw,
    ShieldAlert,
    Clock,
    UserCheck,
    Lock,
    Unlock,
    Upload,
    Zap,
    History,
    FileText,
    TrendingUp,
    CheckCircle2,
    CreditCard
} from "lucide-react";
import { cn } from "@/lib/admin-utils";

const InsuranceSettingsPage = () => {
    const { triggerToast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const [settings, setSettings] = useState({
        verificationRequired: true,
        daysBeforeExpiry: 30,
        allowSecondaryInsurance: true,
        maxUploadSize: 5,
        defaultVerificationStatus: "Pending",
        enableBookingFlow: true,
        enablePatientPortal: true,
        notifPatientVerified: true,
        notifStaffAssigned: true,
        notifPolicyExpiring: true
    });

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            triggerToast("Insurance system configurations updated!", "success");
        }, 1000);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-navy flex items-center gap-2">
                        <Settings className="w-6 h-6 text-primary" />
                        Insurance System Settings
                    </h2>
                    <p className="text-brand-muted text-xs sm:text-sm mt-0.5">Configure global defaults and automation for the insurance lifecycle.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        className="btn-secondary h-10 px-4 flex items-center gap-2 shadow-premium-sm font-black text-xs uppercase tracking-widest bg-white border-brand-border"
                        onClick={() => triggerToast("System settings reset to defaults", "info")}
                    >
                        <RotateCcw className="w-4 h-4" /> Reset
                    </button>
                    <button
                        className="btn-primary h-10 px-6 flex items-center gap-2 shadow-premium font-black text-xs uppercase tracking-widest min-w-[120px] justify-center"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                        {isSaving ? "Saving..." : "Save Settings"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Main Settings Sections */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Operational Defaults */}
                    <div className="admin-card overflow-hidden">
                        <div className="p-4 border-b border-brand-border bg-white flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 border border-blue-100 flex items-center justify-center shadow-premium-sm">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-black text-navy uppercase tracking-widest italic">Verification Strategy</h3>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="flex items-start gap-4 p-4 rounded-3xl bg-brand-bg transition-colors border border-transparent hover:border-brand-border group/opt">
                                <div className="flex-1">
                                    <p className="text-xs font-black text-navy uppercase tracking-tighter leading-none mb-1">Strict Verification</p>
                                    <p className="text-[10px] font-bold text-brand-muted leading-relaxed opacity-60">Require verification before allowing appointment bookings.</p>
                                </div>
                                <button
                                    onClick={() => setSettings({ ...settings, verificationRequired: !settings.verificationRequired })}
                                    className={cn(
                                        "w-11 h-6 rounded-full relative transition-colors duration-200",
                                        settings.verificationRequired ? "bg-primary" : "bg-brand-border"
                                    )}
                                >
                                    <div className={cn(
                                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200",
                                        settings.verificationRequired ? "translate-x-6" : "translate-x-1"
                                    )} />
                                </button>
                            </div>

                            <div className="flex items-start gap-4 p-4 rounded-3xl bg-brand-bg transition-colors border border-transparent hover:border-brand-border group/opt">
                                <div className="flex-1">
                                    <p className="text-xs font-black text-navy uppercase tracking-tighter leading-none mb-1">Secondary Insurance</p>
                                    <p className="text-[10px] font-bold text-brand-muted leading-relaxed opacity-60">Allow patients to provide primary and secondary plans.</p>
                                </div>
                                <button
                                    onClick={() => setSettings({ ...settings, allowSecondaryInsurance: !settings.allowSecondaryInsurance })}
                                    className={cn(
                                        "w-11 h-6 rounded-full relative transition-colors duration-200",
                                        settings.allowSecondaryInsurance ? "bg-primary" : "bg-brand-border"
                                    )}
                                >
                                    <div className={cn(
                                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200",
                                        settings.allowSecondaryInsurance ? "translate-x-6" : "translate-x-1"
                                    )} />
                                </button>
                            </div>

                            <div className="space-y-1.5 pl-4">
                                <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest opacity-60">Reminder Threshold (Days)</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-muted" />
                                    <input
                                        type="number"
                                        className="input-base h-11 pl-10 text-sm font-black"
                                        value={settings.daysBeforeExpiry}
                                        onChange={(e) => setSettings({ ...settings, daysBeforeExpiry: parseInt(e.target.value) })}
                                    />
                                </div>
                                <p className="text-[8px] font-black text-brand-muted uppercase pl-1 opacity-40 italic mt-1">Notify staff before policy expiration</p>
                            </div>

                            <div className="space-y-1.5 pl-4">
                                <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest opacity-60">Default New Rec. Status</label>
                                <div className="relative">
                                    <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-muted" />
                                    <select
                                        className="input-base h-11 pl-10 text-xs font-black uppercase tracking-widest"
                                        value={settings.defaultVerificationStatus}
                                        onChange={(e) => setSettings({ ...settings, defaultVerificationStatus: e.target.value })}
                                    >
                                        <option>Pending</option>
                                        <option>Verified</option>
                                        <option>In Review</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Public Accessibility Section */}
                    <div className="admin-card overflow-hidden">
                        <div className="p-4 border-b border-brand-border bg-white flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 border border-orange-100 flex items-center justify-center shadow-premium-sm">
                                <Webhook className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-black text-navy uppercase tracking-widest italic">Patient Accessibility</h3>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { id: "enableBookingFlow", label: "Acceptance in Booking", desc: "Allow patients to select/verify insurance during online booking." },
                                { id: "enablePatientPortal", label: "Self-Service Management", desc: "Allow patients to upload card photos in the patient portal." },
                            ].map((opt, idx) => (
                                <button
                                    key={idx}
                                    className={cn(
                                        "flex items-start gap-4 p-5 border rounded-[2rem] transition-all text-left group/opt",
                                        settings[opt.id] ? "border-primary bg-primary/5 shadow-premium" : "border-brand-border bg-white"
                                    )}
                                    onClick={() => setSettings({ ...settings, [opt.id]: !settings[opt.id] })}
                                >
                                    <div className={cn(
                                        "w-10 h-10 rounded-2xl flex items-center justify-center border transition-all",
                                        settings[opt.id] ? "bg-primary text-white border-primary" : "bg-brand-bg text-brand-muted border-brand-border"
                                    )}>
                                        {settings[opt.id] ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={cn("text-xs font-black uppercase leading-none mb-1", settings[opt.id] ? "text-primary" : "text-navy")}>{opt.label}</p>
                                        <p className="text-[9px] font-bold text-brand-muted leading-tight opacity-70 italic">{opt.desc}</p>
                                    </div>
                                    <div className={cn(
                                        "w-2.5 h-2.5 rounded-full mt-1.5",
                                        settings[opt.id] ? "bg-emerald-500" : "bg-brand-border"
                                    )} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Notifications & Security stubs */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="admin-card overflow-hidden">
                        <div className="p-4 border-b border-brand-border bg-white flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 border border-purple-100 flex items-center justify-center shadow-premium-sm">
                                <Bell className="w-5 h-5" />
                            </div>
                            <h3 className="text-xs font-black text-navy uppercase tracking-widest italic">Notifications</h3>
                        </div>
                        <div className="p-5 space-y-4">
                            {[
                                { id: "notifPatientVerified", label: "Patient Verified Notif", desc: "Alert patient when their insurance is confirmed." },
                                { id: "notifStaffAssigned", label: "Staff Assignment Alert", desc: "Notify staff when a verification task is assigned." },
                                { id: "notifPolicyExpiring", label: "Policy Expiry Warning", desc: "Auto-reminder for expiring patient policies." },
                            ].map((notif, idx) => (
                                <div key={idx} className="flex items-center justify-between py-2 border-b border-brand-border group/not">
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-navy uppercase tracking-tighter leading-none mb-1 group-hover/not:text-primary transition-colors">{notif.label}</p>
                                        <p className="text-[8px] text-brand-muted font-bold opacity-60 leading-tight">{notif.desc}</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={settings[notif.id]}
                                        onChange={() => setSettings({ ...settings, [notif.id]: !settings[notif.id] })}
                                        className="w-5 h-5 rounded border-brand-border text-primary focus:ring-primary"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="admin-card p-6 border-l-4 border-l-red-500 shadow-premium-sm space-y-4 bg-gradient-to-br from-white to-red-50/20">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-red-100 text-red-600 rounded-2xl shadow-premium-sm border border-red-200">
                                <FileLock className="w-5 h-5" />
                            </div>
                            <h3 className="text-xs font-black text-navy uppercase tracking-widest">Compliance Controls</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest pl-1 opacity-60">Max Upload Siz (MB)</label>
                                <input
                                    type="number"
                                    className="input-base text-xs font-black h-10"
                                    value={settings.maxUploadSize}
                                    onChange={(e) => setSettings({ ...settings, maxUploadSize: parseInt(e.target.value) })}
                                />
                            </div>

                            <div className="flex items-center justify-between p-3 bg-white border border-red-100 rounded-[2rem] shadow-premium-sm">
                                <div className="flex items-center gap-2">
                                    <ShieldAlert className="w-4 h-4 text-red-500" />
                                    <span className="text-[10px] font-black text-navy uppercase tracking-tighter">Data Retention</span>
                                </div>
                                <span className="text-[9px] font-black text-brand-muted uppercase bg-brand-bg px-2 py-0.5 rounded border border-brand-border">7 Years</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-navy text-white rounded-[3rem] shadow-premium-xl relative overflow-hidden group">
                        <div className="relative z-10 space-y-4">
                            <div className="flex flex-col items-center text-center">
                                <Zap className="w-8 h-8 text-emerald-400 mb-3 animate-pulse" />
                                <h4 className="text-sm font-black uppercase tracking-widest">Automatic Verification</h4>
                                <p className="text-[9px] font-bold text-white/40 mt-1 leading-normal">Our system currently syncs with 120+ payers in real-time.</p>
                            </div>
                            <button className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                                Configure Proxy Setup
                            </button>
                        </div>
                        <CreditCard className="absolute -bottom-8 -left-8 w-32 h-32 text-white opacity-[0.03] group-hover:scale-125 transition-transform duration-500" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InsuranceSettingsPage;
