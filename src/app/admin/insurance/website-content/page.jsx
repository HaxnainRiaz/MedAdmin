"use client";

import React, { useState } from "react";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import Modal from "@/components/admin/shared/Modal";
import { useToast } from "@/components/admin/shared/ToastProvider";
import {
    Globe,
    Eye,
    Save,
    LayoutTemplate,
    Search,
    Plus,
    Building2,
    CheckCircle2,
    AlertCircle,
    Info,
    ArrowRight,
    SearchCheck,
    Smartphone,
    Monitor,
    X,
    Image,
    HelpCircle,
    Zap,
    History,
    FileText,
    TrendingUp,
    Star
} from "lucide-react";
import { cn } from "@/lib/admin-utils";

const WebsiteContentPage = () => {
    const { triggerToast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [previewMode, setPreviewMode] = useState("desktop");

    const [content, setContent] = useState({
        pageEnabled: true,
        title: "Insurance & Billing",
        subtitle: "Comprehensive coverage for your peace of mind.",
        intro: "We accept most major insurance providers to ensure high-quality healthcare remains accessible to all our patients. Check our list below or contact our billing department for specific inquiries.",
        instructionText: "Please bring a valid photo ID, your current insurance card, and any relevant medical records to your first appointment.",
        helpText: "Need assistance with your bill? Our financial counselors are available Monday-Friday from 9:00 AM to 5:00 PM.",
        featuredProviders: ["BCBS", "AET", "CIG", "UHC"],
        seoTitle: "Insurance & Billing Information | Medify Medical Practice",
        seoDesc: "View accepted insurance providers, billing instructions, and financial assistance options at Medify."
    });

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            triggerToast("Clinic website content published successfully!", "success");
        }, 1200);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-navy flex items-center gap-2">
                        <Globe className="w-6 h-6 text-primary" />
                        Website Insurance Content
                    </h2>
                    <p className="text-brand-muted text-xs sm:text-sm mt-0.5">Control how insurance information is displayed to patients on the public website.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        className="btn-secondary h-10 px-4 flex items-center gap-2 shadow-premium-sm font-black text-xs uppercase tracking-widest border-brand-border"
                        onClick={() => triggerToast("Generating preview session...", "info")}
                    >
                        <Eye className="w-4 h-4" /> Preview
                    </button>
                    <button
                        className="btn-primary h-10 px-6 flex items-center gap-2 shadow-premium font-black text-xs uppercase tracking-widest min-w-[120px] justify-center"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                        {isSaving ? "Saving..." : "Publish"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Editor Sidebar */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Page Structure Section */}
                    <div className="admin-card p-6 space-y-6 border-l-4 border-l-primary/30">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-black text-navy uppercase tracking-[0.2em] flex items-center gap-2">
                                <LayoutTemplate className="w-4 h-4 text-primary" />
                                Header & Hero Section
                            </h3>
                            <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Page Active</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest pl-1 opacity-60">Main Page Title</label>
                                <input
                                    type="text"
                                    value={content.title}
                                    onChange={(e) => setContent({ ...content, title: e.target.value })}
                                    className="input-base text-sm font-black h-11 border-brand-border/60 focus:border-primary transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest pl-1 opacity-60">Subtitle / Tagline</label>
                                <input
                                    type="text"
                                    value={content.subtitle}
                                    onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
                                    className="input-base text-sm font-bold h-11 border-brand-border/60 focus:border-primary opacity-80"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest pl-1 opacity-60">Introduction Block</label>
                                <textarea
                                    rows={3}
                                    value={content.intro}
                                    onChange={(e) => setContent({ ...content, intro: e.target.value })}
                                    className="input-base min-h-[100px] text-xs font-bold leading-relaxed border-brand-border/60 focus:border-primary p-4"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Instructions and Help */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="admin-card p-6 space-y-4 border-l-4 border-l-orange-500/30">
                            <h3 className="text-sm font-black text-navy uppercase tracking-widest flex items-center gap-2">
                                <Info className="w-4 h-4 text-orange-500" />
                                Patient Instructions
                            </h3>
                            <textarea
                                rows={4}
                                value={content.instructionText}
                                onChange={(e) => setContent({ ...content, instructionText: e.target.value })}
                                className="input-base text-xs font-bold leading-loose border-brand-border/60 bg-orange-50/20"
                            />
                            <p className="text-[9px] text-brand-muted italic opacity-50">Appears in the "What to Bring" section on the website.</p>
                        </div>

                        <div className="admin-card p-6 space-y-4 border-l-4 border-l-purple-500/30">
                            <h3 className="text-sm font-black text-navy uppercase tracking-widest flex items-center gap-2">
                                <HelpCircle className="w-4 h-4 text-purple-500" />
                                Billing Support Text
                            </h3>
                            <textarea
                                rows={4}
                                value={content.helpText}
                                onChange={(e) => setContent({ ...content, helpText: e.target.value })}
                                className="input-base text-xs font-bold leading-loose border-brand-border/60 bg-purple-50/20"
                            />
                            <p className="text-[9px] text-brand-muted italic opacity-50">Appears in the footer of the insurance page.</p>
                        </div>
                    </div>

                    {/* Acceptable Providers List Selector */}
                    <div className="admin-card p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-black text-navy uppercase tracking-widest flex items-center gap-2">
                                <Star className="w-4 h-4 text-orange-500" />
                                Featured Providers Grid
                            </h3>
                            <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline px-3 py-1.5 rounded-lg border border-brand-border bg-white shadow-premium-sm transition-all">Select All Accepted</button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { id: "BCBS", name: "Blue Cross", logo: "BC" },
                                { id: "AET", name: "Aetna", logo: "AE" },
                                { id: "CIG", name: "Cigna", logo: "CI" },
                                { id: "UHC", name: "UnitedHealth", logo: "UH" },
                                { id: "MOD", name: "Moderna", logo: "MO" },
                                { id: "HUM", name: "Humana", logo: "HU" },
                                { id: "ANT", name: "Anthem", logo: "AN" },
                                { id: "MDC", name: "Medicare", logo: "MC" },
                            ].map((p, idx) => (
                                <button
                                    key={idx}
                                    className={cn(
                                        "flex flex-col items-center gap-3 p-4 border rounded-[2rem] transition-all group/prov",
                                        content.featuredProviders.includes(p.id) ? "border-primary bg-primary/5 shadow-premium" : "border-brand-border bg-white hover:border-primary/20"
                                    )}
                                    onClick={() => {
                                        const newProv = content.featuredProviders.includes(p.id)
                                            ? content.featuredProviders.filter(id => id !== p.id)
                                            : [...content.featuredProviders, p.id];
                                        setContent({ ...content, featuredProviders: newProv });
                                    }}
                                >
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-premium-sm transition-all",
                                        content.featuredProviders.includes(p.id) ? "bg-primary text-white scale-110" : "bg-brand-bg text-brand-muted group-hover/prov:bg-white border border-brand-border"
                                    )}>
                                        {p.logo}
                                    </div>
                                    <span className={cn(
                                        "text-[10px] font-black uppercase tracking-tighter transition-colors",
                                        content.featuredProviders.includes(p.id) ? "text-primary" : "text-brand-muted"
                                    )}>{p.name}</span>
                                    {content.featuredProviders.includes(p.id) && (
                                        <div className="absolute top-2 right-4 text-primary">
                                            <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Real-time Preview Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="sticky top-24 space-y-6">
                        <div className="admin-card overflow-hidden border-2 border-navy/5 shadow-premium-xl">
                            <div className="p-4 border-b border-brand-border bg-white flex items-center justify-between">
                                <p className="text-[10px] font-black text-navy uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Monitor className="w-4 h-4" />
                                    Live Preview
                                </p>
                                <div className="flex items-center gap-1 bg-brand-bg rounded-lg p-1 border border-brand-border">
                                    <button
                                        onClick={() => setPreviewMode("desktop")}
                                        className={cn("p-1.5 rounded-md transition-all", previewMode === "desktop" ? "bg-white text-primary shadow-premium-sm" : "text-brand-muted hover:text-navy")}
                                    >
                                        <Monitor className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => setPreviewMode("mobile")}
                                        className={cn("p-1.5 rounded-md transition-all", previewMode === "mobile" ? "bg-white text-primary shadow-premium-sm" : "text-brand-muted hover:text-navy")}
                                    >
                                        <Smartphone className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            <div className={cn("bg-brand-bg/30 p-4 transition-all duration-500 overflow-y-auto max-h-[500px] no-scrollbar", previewMode === "mobile" ? "px-8" : "px-4")}>
                                <div className={cn("bg-white shadow-premium-xl border border-brand-border transition-all duration-500 overflow-hidden", previewMode === "mobile" ? "w-[260px] mx-auto rounded-[3rem]" : "w-full rounded-[2rem]")}>
                                    {/* Mock Public Site Navbar */}
                                    <div className="bg-white border-b border-brand-border/50 p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center font-black text-white text-[10px]">M</div>
                                            <span className="font-black text-navy text-xs italic tracking-tighter">Medify.</span>
                                        </div>
                                        <Plus className="w-4 h-4 text-brand-muted" />
                                    </div>

                                    <div className="p-6 space-y-4">
                                        <div className="space-y-1">
                                            <h1 className="text-sm font-black text-navy leading-tight">{content.title || "Page Title"}</h1>
                                            <p className="text-[9px] font-bold text-primary opacity-80 italic">{content.subtitle || "Your tagline goes here."}</p>
                                        </div>
                                        <p className="text-[8px] text-brand-muted leading-relaxed font-bold opacity-70 border-l-2 border-primary/20 pl-2">
                                            {content.intro || "Introduction text for your insurance page..."}
                                        </p>

                                        <div className="pt-2 space-y-3">
                                            <p className="text-[7px] font-black uppercase tracking-widest text-navy bg-brand-bg/50 px-2 py-1 rounded inline-block">Accepted Providers</p>
                                            <div className="grid grid-cols-4 gap-2">
                                                {content.featuredProviders.map((id, i) => (
                                                    <div key={i} className="aspect-square bg-brand-bg rounded-lg border border-brand-border/40 flex items-center justify-center text-[8px] font-black text-brand-muted shadow-premium-sm">
                                                        {id.slice(0, 2)}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                            <p className="text-[7px] font-black uppercase text-primary mb-1">What to Bring</p>
                                            <p className="text-[8px] text-brand-muted font-bold leading-normal">{content.instructionText || "Instructions..."}</p>
                                        </div>
                                    </div>

                                    {/* Mock Public Footer */}
                                    <div className="bg-navy p-6 mt-4">
                                        <p className="text-[7px] font-bold text-white/40 leading-relaxed italic">{content.helpText || "Help center info..."}</p>
                                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                                            <div className="flex flex-col gap-1">
                                                <div className="w-8 h-1 bg-white/20 rounded-full" />
                                                <div className="w-12 h-1 bg-white/10 rounded-full" />
                                            </div>
                                            <ArrowRight className="w-3 h-3 text-white/20" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SEO Card */}
                        <div className="admin-card p-6 space-y-4 shadow-premium-sm bg-gradient-to-br from-white to-brand-bg/20">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center border border-blue-100 shadow-premium-sm">
                                    <SearchCheck className="w-4 h-4" />
                                </div>
                                <h4 className="text-[10px] font-black text-navy uppercase tracking-widest pl-1">Search Engine Discovery</h4>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-brand-muted uppercase tracking-tighter opacity-50 pl-1">Meta Title</label>
                                    <input
                                        type="text"
                                        value={content.seoTitle}
                                        onChange={(e) => setContent({ ...content, seoTitle: e.target.value })}
                                        className="input-base text-xs font-bold border-brand-border/60"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-brand-muted uppercase tracking-tighter opacity-50 pl-1">Meta Description</label>
                                    <textarea
                                        rows={2}
                                        value={content.seoDesc}
                                        onChange={(e) => setContent({ ...content, seoDesc: e.target.value })}
                                        className="input-base text-[10px] font-bold border-brand-border/60"
                                    />
                                </div>
                                <div className="p-3 bg-white border border-brand-border rounded-xl shadow-premium-sm">
                                    <p className="text-[10px] font-black text-blue-600 truncate">{content.seoTitle}</p>
                                    <p className="text-[9px] text-emerald-600 font-bold mb-1">https://medify.clinic/insurance</p>
                                    <p className="text-[9px] text-brand-muted line-clamp-2 leading-snug">{content.seoDesc}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WebsiteContentPage;
