"use client";

import React, { useState } from "react";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import Modal from "@/components/admin/shared/Modal";
import DataTable from "@/components/admin/shared/DataTable";
import {
    Search,
    Filter,
    MoreHorizontal,
    Mail,
    User,
    Clock,
    MessageSquare,
    ChevronLeft,
    ChevronRight,
    UserCheck,
    Flag,
    CheckCircle2,
    Send
} from "lucide-react";
import { cn } from "@/lib/admin-utils";

const initialInquiries = [
    { id: "INQ-901", name: "Alex Thompson", email: "alex.t@gmail.com", subject: "Pricing Question", type: "Service Inquiry", priority: "High", status: "Open", owner: "Unassigned", date: "2024-03-07", time: "09:45 AM", body: "Hello, I wanted to know the exact pricing for a full cardiology checkup. Do you accept international insurance?" },
    { id: "INQ-902", name: "Martha Stewart", email: "martha@example.com", subject: "Appointment Issue", type: "Support", priority: "Medium", status: "In Progress", owner: "Sarah Miller", date: "2024-03-07", time: "10:15 AM", body: "I am unable to reschedule my appointment from the patient portal." },
    { id: "INQ-903", name: "Kevin Hart", email: "kevin@comedy.com", subject: "Partnership Request", type: "General", priority: "Low", status: "Waiting", owner: "John Admin", date: "2024-03-07", time: "11:00 AM", body: "I run a local fitness center and would like to partner with your clinic." },
    { id: "INQ-904", name: "Lucia Garcia", email: "lucia@es.com", subject: "Specialist Advice", type: "Consultation", priority: "High", status: "Open", owner: "Unassigned", date: "2024-03-07", time: "11:30 AM", body: "I have some specific questions about dermatology treatments before I book." },
    { id: "INQ-905", name: "Bill Gates", email: "bill.g@ms.com", subject: "Legal Inquiry", type: "Legal", priority: "Low", status: "Resolved", owner: "Legal Team", date: "2024-03-06", time: "04:00 PM", body: "Requesting terms of service documentation." },
];

const InquiriesPage = () => {
    const [inquiries, setInquiries] = useState(initialInquiries);
    const [searchQuery, setSearchQuery] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("All");

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [activeInq, setActiveInq] = useState(null);
    const [replyText, setReplyText] = useState("");

    const [showSuccessToast, setShowSuccessToast] = useState(false);

    // Filtering
    const filteredInquiries = inquiries.filter(inq => {
        const matchesPriority = priorityFilter === "All" || inq.priority === priorityFilter;
        const matchesSearch = inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inq.subject.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesPriority && matchesSearch;
    });

    const triggerToast = () => {
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
    };

    const handleAssign = (id, newOwner) => {
        setInquiries(inquiries.map(i => i.id === id ? { ...i, owner: newOwner, status: i.status === "Open" ? "In Progress" : i.status } : i));
        if (activeInq && activeInq.id === id) {
            setActiveInq({ ...activeInq, owner: newOwner, status: activeInq.status === "Open" ? "In Progress" : activeInq.status });
        }
        triggerToast();
    };

    const handleStatusChange = (id, newStatus) => {
        setInquiries(inquiries.map(i => i.id === id ? { ...i, status: newStatus } : i));
        if (activeInq && activeInq.id === id) {
            setActiveInq({ ...activeInq, status: newStatus });
        }
        triggerToast();
    };

    const handleReply = (e) => {
        e.preventDefault();
        if (!replyText.trim() || !activeInq) return;

        handleStatusChange(activeInq.id, "Resolved");
        setReplyText("");
    };

    const openDetails = (inq) => {
        setActiveInq(inq);
        setReplyText("");
        setIsDetailModalOpen(true);
    };

    return (
        <div className="space-y-6 relative">
            {/* Success Toast */}
            {showSuccessToast && (
                <div className="fixed top-24 right-8 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-premium flex items-center gap-3 z-50 animate-in fade-in slide-in-from-top-4">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-bold text-sm">Action completed successfully!</span>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-navy">Inquiries Inbox</h2>
                    <p className="text-brand-muted text-xs sm:text-sm">Manage submissions and inquiries.</p>
                </div>
                <div className="flex items-center gap-3 self-end sm:self-auto">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-bg border-2 border-white flex items-center justify-center">
                                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-muted" />
                            </div>
                        ))}
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-white border-2 border-white flex items-center justify-center text-[9px] sm:text-[10px] font-bold">+{inquiries.length}</div>
                    </div>
                </div>
            </div>

            <div className="admin-card overflow-hidden">
                <div className="p-3 sm:p-4 border-b border-brand-border flex flex-col lg:flex-row gap-3 sm:gap-4 items-center justify-between">
                    <div className="relative flex-1 w-full lg:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                        <input
                            type="text"
                            placeholder="Search sender, subject..."
                            className="input-base pl-10 h-10 text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full lg:w-auto">
                        <div className="flex-1 lg:w-40">
                            <select
                                className="input-base text-xs sm:text-sm h-10"
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                            >
                                <option value="All">All Priorities</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>
                        <button className="btn-secondary h-10 px-3 shrink-0">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <DataTable
                    headers={[
                        "Sender",
                        "Inquiry details",
                        { content: "Priority", className: "hidden sm:table-cell" },
                        "Status",
                        { content: "Assignee", className: "hidden md:table-cell" },
                        { content: "Actions", className: "text-right" }
                    ]}
                    mobileContent={filteredInquiries.length > 0 ? filteredInquiries.map((inq, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-xl border border-brand-border shadow-soft flex flex-col gap-4 relative">
                            <div className="flex flex-col gap-1 pr-20">
                                <h3 className="text-sm font-bold text-navy leading-tight">{inq.subject}</h3>
                                <span className="text-[10px] text-brand-muted font-bold bg-brand-bg px-2 py-0.5 rounded w-fit uppercase tracking-wider mt-1">{inq.type}</span>
                            </div>
                            <div className="absolute top-4 right-4">
                                <StatusBadge status={inq.status} />
                            </div>
                            <div className="flex flex-col gap-2 pt-3 border-t border-brand-border">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <span className="text-[10px] uppercase tracking-widest text-brand-muted font-bold">Sender</span>
                                        <span className="text-sm font-semibold text-charcoal truncate pr-2">{inq.name}</span>
                                        <span className="text-[10px] text-brand-muted truncate block pr-2">{inq.email}</span>
                                    </div>
                                    <div className="flex flex-col items-end shrink-0">
                                        <span className="text-[10px] uppercase tracking-widest text-brand-muted font-bold">Priority</span>
                                        <div className={cn(
                                            "flex items-center gap-1.5 text-xs font-bold",
                                            inq.priority === "High" ? "text-red-600" :
                                                inq.priority === "Medium" ? "text-orange-600" : "text-blue-600"
                                        )}>
                                            <Flag className="w-3.5 h-3.5 fill-current" />
                                            {inq.priority}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-3 mt-1 border-t border-brand-border">
                                {inq.owner === "Unassigned" ? (
                                    <button className="text-[10px] font-black text-primary flex items-center gap-1 uppercase tracking-tight" onClick={(e) => { e.stopPropagation(); handleAssign(inq.id, "John Admin") }}>
                                        <UserCheck className="w-3.5 h-3.5" /> Assign Me
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 text-primary flex items-center justify-center text-[10px] font-bold">
                                            {inq.owner.charAt(0)}
                                        </div>
                                        <span className="text-xs text-charcoal font-medium">{inq.owner}</span>
                                    </div>
                                )}
                                <button className="px-4 py-1.5 btn-secondary text-xs" onClick={() => openDetails(inq)}>Manage</button>
                            </div>
                        </div>
                    )) : (
                        <div className="p-8 text-center text-brand-muted flex flex-col items-center">
                            <MessageSquare className="w-10 h-10 text-brand-border mb-3" />
                            <p className="font-bold text-navy text-base">No inquiries found</p>
                        </div>
                    )}
                >
                    {filteredInquiries.length > 0 ? filteredInquiries.map((inq, idx) => (
                        <tr key={idx} onClick={() => openDetails(inq)} className="hover:bg-brand-bg/30 transition-colors group cursor-pointer">
                            <td>
                                <div className="flex flex-col min-w-[150px]">
                                    <span className="text-sm font-bold text-navy hover:text-primary transition-colors">{inq.name}</span>
                                    <span className="text-[11px] text-brand-muted">{inq.email}</span>
                                </div>
                            </td>
                            <td>
                                <div className="flex flex-col min-w-[180px]">
                                    <span className="text-sm font-medium text-charcoal">{inq.subject}</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] text-brand-muted font-semibold bg-brand-bg px-1.5 py-0.5 rounded w-fit">{inq.type}</span>
                                        <span className="sm:hidden flex items-center gap-1 text-[10px] font-bold text-red-600">
                                            <Flag className="w-3 h-3 fill-current" />
                                        </span>
                                    </div>
                                </div>
                            </td>
                            <td className="hidden sm:table-cell">
                                <div className={cn(
                                    "flex items-center gap-1.5 text-xs font-bold",
                                    inq.priority === "High" ? "text-red-600" :
                                        inq.priority === "Medium" ? "text-orange-600" : "text-blue-600"
                                )}>
                                    <Flag className="w-3.5 h-3.5 fill-current" />
                                    {inq.priority}
                                </div>
                            </td>
                            <td>
                                <StatusBadge status={inq.status} />
                            </td>
                            <td className="hidden md:table-cell">
                                {inq.owner === "Unassigned" ? (
                                    <button
                                        className="text-[10px] font-black text-primary flex items-center gap-1 uppercase tracking-tight hover:underline relative z-10"
                                        onClick={(e) => { e.stopPropagation(); handleAssign(inq.id, "John Admin"); }}
                                    >
                                        <UserCheck className="w-3 h-3" /> Assign Me
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-1.5 relative z-10">
                                        <div className="w-5 h-5 rounded-full bg-blue-100 text-primary flex items-center justify-center text-[10px] font-bold">
                                            {inq.owner.charAt(0)}
                                        </div>
                                        <span className="text-xs text-charcoal font-medium">{inq.owner}</span>
                                    </div>
                                )}
                            </td>
                            <td className="text-right">
                                <button className="btn-secondary py-1 px-3 text-[11px] sm:text-xs min-h-[32px]">Manage</button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="6" className="px-6 py-12 text-center text-brand-muted">
                                <div className="flex flex-col items-center justify-center">
                                    <MessageSquare className="w-10 h-10 text-brand-border mb-3" />
                                    <p className="font-bold text-navy text-base">No inquiries found</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </DataTable>

                <div className="p-3 sm:p-4 bg-brand-bg/30 border-t border-brand-border flex items-center justify-between">
                    <span className="text-[10px] sm:text-xs text-brand-muted font-medium italic">Showing {filteredInquiries.length} of {inquiries.length} inquiries</span>
                    <div className="flex items-center gap-2">
                        <button className="p-1.5 sm:p-2 border border-brand-border bg-white rounded-lg hover:bg-brand-bg transition-colors disabled:opacity-30 shrink-0" disabled>
                            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        <button className="p-1.5 sm:p-2 border border-brand-border bg-white rounded-lg hover:bg-brand-bg transition-colors disabled:opacity-30 shrink-0" disabled>
                            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Inquiry Detail Modal */}
            <Modal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                title={null} // custom header inside modal
                maxWidth="max-w-3xl"
            >
                {activeInq && (
                    <div className="flex flex-col gap-6 pt-2">
                        {/* Header & Meta */}
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-brand-border">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] uppercase font-black tracking-widest text-brand-muted bg-brand-bg px-2 py-1 rounded">{activeInq.type}</span>
                                    <StatusBadge status={activeInq.status} />
                                </div>
                                <h2 className="text-2xl font-bold text-navy">{activeInq.subject}</h2>
                                <p className="text-sm text-brand-muted flex items-center gap-2">
                                    From <span className="font-bold text-navy">{activeInq.name}</span> &lt;{activeInq.email}&gt; on {activeInq.date}
                                </p>
                            </div>

                            <div className="flex flex-col gap-2 min-w-[200px]">
                                <select
                                    className="input-base text-sm font-bold bg-brand-bg"
                                    value={activeInq.owner}
                                    onChange={(e) => handleAssign(activeInq.id, e.target.value)}
                                >
                                    <option value="Unassigned">Assign to...</option>
                                    <option value="Sarah Miller">Sarah Miller</option>
                                    <option value="Legal Team">Legal Team</option>
                                    <option value="John Admin">Me</option>
                                </select>

                                {activeInq.status !== "Resolved" && (
                                    <button
                                        className="btn-primary py-1.5"
                                        onClick={() => handleStatusChange(activeInq.id, "Resolved")}
                                    >
                                        <CheckCircle2 className="w-4 h-4" /> Mark as Resolved
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Message Body */}
                        <div className="bg-white rounded-xl border border-brand-border p-5">
                            <p className="text-sm text-charcoal leading-relaxed whitespace-pre-wrap">{activeInq.body}</p>
                        </div>

                        {/* Reply Composer */}
                        {activeInq.status !== "Resolved" && (
                            <form className="border border-brand-border rounded-xl p-2 bg-brand-bg/50 flex flex-col focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all" onSubmit={handleReply}>
                                <div className="px-3 pt-2 pb-1 border-b border-brand-border flex items-center text-xs font-bold text-brand-muted gap-2">
                                    <Mail className="w-3.5 h-3.5" /> Replying to {activeInq.email}
                                </div>
                                <textarea
                                    className="w-full text-sm p-3 outline-none min-h-[120px] resize-y bg-transparent placeholder:text-brand-muted text-navy"
                                    placeholder="Draft your reply..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                ></textarea>
                                <div className="flex items-center justify-between pt-2 px-2 pb-1">
                                    <div className="flex gap-2"></div>
                                    <button
                                        type="submit"
                                        disabled={!replyText.trim()}
                                        className="btn-primary py-1.5 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send className="w-3.5 h-3.5 mr-1.5" /> Send Reply & Resolve
                                    </button>
                                </div>
                            </form>
                        )}
                        {activeInq.status === "Resolved" && (
                            <div className="bg-emerald-50 text-center p-4 rounded-xl border border-emerald-100 text-emerald-700 text-sm font-medium flex items-center justify-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> This inquiry has been resolved.
                                <button className="underline text-xs ml-2 hover:text-emerald-900" onClick={() => handleStatusChange(activeInq.id, "Open")}>Reopen</button>
                            </div>
                        )}

                    </div>
                )}
            </Modal>
        </div>
    );
};

export default InquiriesPage;
