"use client";

import React, { useState } from "react";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import Modal from "@/components/admin/shared/Modal";
import DataTable from "@/components/admin/shared/DataTable";
import {
    LifeBuoy,
    Search,
    Filter,
    User,
    Calendar,
    MessageSquare,
    Flag,
    MoreVertical,
    ArrowRight,
    Send,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/admin-utils";

const initialTickets = [
    { id: "TKT-2041", subject: "Unable to book appointment", user: "Michael Brown", priority: "High", status: "Open", date: "2024-03-07", updated: "2h ago", assignee: "Support Team", body: "Every time I try to book an appointment with Dr. Wong for next Tuesday, the website gives me a 500 error code. Please help as this is urgent.", history: [{ author: "Michael Brown", type: "user", text: "Every time I try to book an appointment with Dr. Wong for next Tuesday, the website gives me a 500 error code. Please help as this is urgent.", time: "2h ago" }] },
    { id: "TKT-2040", subject: "Wrong email address in profile", user: "Emma Davis", priority: "Medium", status: "In Progress", date: "2024-03-06", updated: "5h ago", assignee: "Jane Editor", body: "I mistakenly entered the wrong email address and now I cannot verify my account.", history: [] },
    { id: "TKT-2039", subject: "Invoice not received", user: "David Wilson", priority: "High", status: "Resolved", date: "2024-03-05", updated: "1d ago", assignee: "Billing Dept", body: "I am missing the invoice for my visit on March 1.", history: [] },
    { id: "TKT-2038", subject: "Update my phone number", user: "Olivia Martinez", priority: "Low", status: "Closed", date: "2024-03-04", updated: "2d ago", assignee: "Support Team", body: "Can you change my phone number to 555-1234?", history: [] },
    { id: "TKT-2037", subject: "Doctor's schedule not clear", user: "James Taylor", priority: "Medium", status: "Open", date: "2024-03-03", updated: "3d ago", assignee: "Unassigned", body: "The schedule says Dr. Miller is available, but the calendar is grayed out.", history: [] },
];

const tabs = ["All Tickets", "Open", "In Progress", "Resolved", "Closed"];

const SupportTicketsPage = () => {
    const [tickets, setTickets] = useState(initialTickets);
    const [activeTab, setActiveTab] = useState("Open");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterAssignee, setFilterAssignee] = useState("All");
    const [selectedIds, setSelectedIds] = useState([]);

    const [activeTicket, setActiveTicket] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [replyText, setReplyText] = useState("");

    const [showSuccessToast, setShowSuccessToast] = useState(false);

    // Filtering
    const filteredTickets = tickets.filter(tkt => {
        const matchesTab = activeTab === "All Tickets" || tkt.status === activeTab;
        const matchesAssignee = filterAssignee === "All" || tkt.assignee === filterAssignee;
        const matchesSearch = tkt.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tkt.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tkt.user.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch && matchesAssignee;
    });

    const triggerToast = () => {
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredTickets.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredTickets.map(t => t.id));
        }
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleBulkStatusChange = (status) => {
        setTickets(tickets.map(t =>
            selectedIds.includes(t.id) ? { ...t, status } : t
        ));
        setSelectedIds([]);
        triggerToast();
    };

    const handleBulkDelete = () => {
        if (confirm(`Are you sure you want to delete ${selectedIds.length} tickets?`)) {
            setTickets(tickets.filter(t => !selectedIds.includes(t.id)));
            setSelectedIds([]);
            triggerToast();
        }
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case "High": return <Flag className="w-3.5 h-3.5 text-red-500 fill-red-50" />;
            case "Medium": return <Flag className="w-3.5 h-3.5 text-orange-500 fill-orange-50" />;
            case "Low": return <Flag className="w-3.5 h-3.5 text-emerald-500 fill-emerald-50" />;
            default: return <Flag className="w-3.5 h-3.5 text-brand-muted" />;
        }
    };

    const handleAssign = (id, newAssignee) => {
        setTickets(tickets.map(t => t.id === id ? { ...t, assignee: newAssignee, status: t.status === "Open" ? "In Progress" : t.status } : t));
        triggerToast();
    };

    const handleStatusChange = (id, newStatus) => {
        setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus } : t));
        if (activeTicket && activeTicket.id === id) {
            setActiveTicket({ ...activeTicket, status: newStatus });
        }
        triggerToast();
    };

    const handleReply = (e) => {
        e.preventDefault();
        if (!replyText.trim() || !activeTicket) return;

        const newHistoryItem = { author: "Admin User", type: "agent", text: replyText, time: "Just now" };

        const updatedTickets = tickets.map(t => {
            if (t.id === activeTicket.id) {
                return {
                    ...t,
                    status: "In Progress",
                    history: [...(t.history || []), newHistoryItem]
                };
            }
            return t;
        });

        setTickets(updatedTickets);
        setActiveTicket(updatedTickets.find(t => t.id === activeTicket.id));
        setReplyText("");
        triggerToast();
    };

    const openTicket = (ticket) => {
        setActiveTicket(ticket);
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

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-navy">Support Tickets</h2>
                    <p className="text-brand-muted text-sm">Manage patient issues, technical problems, and billing inquiries.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                    { label: "Open Tickets", value: tickets.filter(t => t.status === "Open" || t.status === "In Progress").length.toString(), sub: `${tickets.filter(t => t.priority === "High" && t.status !== "Resolved" && t.status !== "Closed").length} High Priority` },
                    { label: "Avg. Resolution Time", value: "4.2", sub: "Hours this week" },
                    { label: "Customer Satisfaction", value: "94%", sub: "Last 30 days" },
                ].map((stat, idx) => (
                    <div key={idx} className="admin-card p-6 flex flex-col justify-between group overflow-hidden relative border-l-4 border-l-primary/0 hover:border-l-primary transition-all">
                        <span className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 z-10">{stat.label}</span>
                        <div className="flex items-end gap-3 z-10">
                            <span className="text-3xl font-black text-navy leading-none">{stat.value}</span>
                        </div>
                        <span className="text-[10px] text-brand-muted mt-2 font-bold z-10">{stat.sub}</span>
                        <LifeBuoy className="w-24 h-24 text-brand-bg absolute -bottom-6 -right-6 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500" />
                    </div>
                ))}
            </div>

            <div className="admin-card overflow-hidden">
                <div className="p-4 border-b border-brand-border space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        {/* Tabs */}
                        <div className="flex items-center bg-brand-bg p-1 rounded-xl">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === tab
                                        ? "bg-white text-primary shadow-sm"
                                        : "text-brand-muted hover:text-navy"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                            <input
                                type="text"
                                placeholder="Search ticket #, subject or user..."
                                className="input-base pl-10 h-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <select
                                className="input-base h-10 text-sm"
                                value={filterAssignee}
                                onChange={(e) => setFilterAssignee(e.target.value)}
                            >
                                <option value="All">Filter by Assignee</option>
                                <option value="Support Team">Support Team</option>
                                <option value="Billing Dept">Billing Dept</option>
                                <option value="Unassigned">Unassigned</option>
                            </select>
                            <button className="btn-secondary h-10 px-3">
                                <Filter className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <DataTable
                    headers={[
                        <input
                            type="checkbox"
                            className="rounded border-brand-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                            onChange={toggleSelectAll}
                            checked={selectedIds.length === filteredTickets.length && filteredTickets.length > 0}
                        />,
                        "Ticket details",
                        "Priority & Status",
                        "Assignee",
                        "Last Updated",
                        { content: "Actions", className: "text-right" }
                    ]}
                >
                    {filteredTickets.length > 0 ? filteredTickets.map((ticket, idx) => (
                        <tr key={idx} className={cn("hover:bg-brand-bg/30 transition-colors group cursor-pointer", selectedIds.includes(ticket.id) ? "bg-primary/5" : "")} onClick={() => openTicket(ticket)}>
                            <td onClick={(e) => e.stopPropagation()}>
                                <input
                                    type="checkbox"
                                    className="rounded border-brand-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                                    checked={selectedIds.includes(ticket.id)}
                                    onChange={() => toggleSelect(ticket.id)}
                                />
                            </td>
                            <td>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-navy group-hover:text-primary transition-colors">{ticket.subject}</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] text-primary font-black bg-primary/10 px-1.5 py-0.5 rounded tracking-wider">{ticket.id}</span>
                                        <span className="text-[10px] text-brand-muted flex items-center gap-1">
                                            <User className="w-3 h-3 text-brand-muted" />
                                            {ticket.user}
                                        </span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="flex flex-col gap-2">
                                    <StatusBadge status={ticket.status} />
                                    <div className="flex items-center gap-1.5 px-2 py-0.5 border border-brand-border rounded-md text-[10px] font-bold text-navy inline-flex w-fit bg-white shadow-sm">
                                        {getPriorityIcon(ticket.priority)}
                                        {ticket.priority}
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span className={`text-xs font-bold ${ticket.assignee === 'Unassigned' ? 'text-red-500 italic px-2 py-1 bg-red-50 rounded-lg' : 'text-charcoal'}`}>
                                    {ticket.assignee}
                                </span>
                            </td>
                            <td>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-navy flex items-center gap-1">
                                        <MessageSquare className="w-3 h-3 text-brand-muted" /> {ticket.updated}
                                    </span>
                                    <span className="text-[10px] text-brand-muted font-bold tracking-widest uppercase mt-0.5 whitespace-nowrap">Opened: {ticket.date}</span>
                                </div>
                            </td>
                            <td className="text-right" onClick={(e) => e.stopPropagation()}>
                                <button className="btn-secondary px-3 py-1.5 text-xs whitespace-nowrap sm:opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => openTicket(ticket)}>
                                    Analyze <ArrowRight className="w-3.5 h-3.5 ml-1" />
                                </button>
                                <button className="p-2 ml-2 hover:bg-brand-bg rounded-lg transition-colors text-brand-muted lg:hidden inline-flex">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="6" className="px-6 py-12 text-center text-brand-muted">
                                <div className="flex flex-col items-center justify-center">
                                    <LifeBuoy className="w-10 h-10 text-brand-border mb-3" />
                                    <p className="font-bold text-navy text-base">No tickets found</p>
                                    <p className="text-xs">Try adjusting your filters or search query.</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </DataTable>

                {/* Bulk Action Bar */}
                {selectedIds.length > 0 && (
                    <div className="p-3 sm:p-4 bg-navy text-white flex flex-col sm:flex-row items-center justify-between gap-3 animate-in slide-in-from-bottom-2">
                        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                            <span className="text-xs sm:text-sm font-medium whitespace-nowrap">{selectedIds.length} tickets selected</span>
                            <div className="flex items-center gap-2 flex-1">
                                <button className="flex-1 sm:flex-none px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-[11px] font-bold transition-colors" onClick={() => handleBulkStatusChange('Resolved')}>Mark Resolved</button>
                                <button className="flex-1 sm:flex-none px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-bold transition-colors" onClick={() => handleBulkStatusChange('In Progress')}>In Progress</button>
                                <button className="flex-1 sm:flex-none px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-[11px] font-bold transition-colors" onClick={handleBulkDelete}>Delete</button>
                            </div>
                        </div>
                        <button className="text-[11px] text-white/60 hover:text-white transition-colors underline" onClick={() => setSelectedIds([])}>Clear selection</button>
                    </div>
                )}
            </div>

            {/* Ticket Detail Modal */}
            <Modal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                title={null} // custom header inside modal
                maxWidth="max-w-4xl"
            >
                {activeTicket && (
                    <div className="flex flex-col gap-6 pt-2">
                        {/* Header & Meta */}
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-brand-border">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-primary font-black bg-primary/10 px-2 py-1 rounded">{activeTicket.id}</span>
                                    <StatusBadge status={activeTicket.status} />
                                </div>
                                <h2 className="text-2xl font-bold text-navy">{activeTicket.subject}</h2>
                                <p className="text-sm text-brand-muted flex items-center gap-2">
                                    Opened by <span className="font-bold text-navy">{activeTicket.user}</span> on {activeTicket.date}
                                </p>
                            </div>

                            <div className="flex flex-col gap-2 min-w-[200px]">
                                <select
                                    className="input-base text-sm font-bold bg-brand-bg"
                                    value={activeTicket.assignee}
                                    onChange={(e) => handleAssign(activeTicket.id, e.target.value)}
                                >
                                    <option value="Unassigned">Assign to...</option>
                                    <option value="Support Team">Support Team</option>
                                    <option value="Billing Dept">Billing Dept</option>
                                    <option value="John Admin">Me</option>
                                </select>

                                {activeTicket.status !== "Resolved" && activeTicket.status !== "Closed" && (
                                    <button
                                        className="btn-primary"
                                        onClick={() => handleStatusChange(activeTicket.id, "Resolved")}
                                    >
                                        <CheckCircle2 className="w-4 h-4" /> Mark as Resolved
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Thread View */}
                        <div className="bg-brand-bg rounded-xl p-4 md:p-6 min-h-[300px] flex flex-col gap-4 overflow-y-auto override-scrollbar max-h-[50vh]">
                            {/* Original Message */}
                            <div className="flex gap-4 p-4 rounded-xl bg-white border border-brand-border relative">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 border border-blue-200 text-blue-700 font-bold">
                                    {activeTicket.user.charAt(0)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-sm text-navy">{activeTicket.user}</span>
                                        <span className="text-[10px] text-brand-muted font-bold tracking-widest uppercase">{activeTicket.date}</span>
                                    </div>
                                    <p className="text-sm text-charcoal leading-relaxed">{activeTicket.body}</p>
                                </div>
                            </div>

                            {/* History Replies */}
                            {activeTicket.history && activeTicket.history.map((msg, i) => (
                                <div key={i} className={cn(
                                    "flex gap-4 p-4 rounded-xl relative border",
                                    msg.type === "agent" ? "bg-primary/5 border-primary/20 ml-8" : "bg-white border-brand-border mr-8"
                                )}>
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border font-bold text-white",
                                        msg.type === "agent" ? "bg-primary" : "bg-blue-500"
                                    )}>
                                        {msg.author.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-sm text-navy">{msg.author}</span>
                                            {msg.type === "agent" && <span className="text-[8px] bg-primary/20 text-primary font-black uppercase px-1 rounded">Staff</span>}
                                            <span className="text-[10px] text-brand-muted font-bold tracking-widest uppercase">{msg.time}</span>
                                        </div>
                                        <p className="text-sm text-charcoal leading-relaxed">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Reply Composer */}
                        {activeTicket.status !== "Closed" && (
                            <form className="border border-brand-border rounded-xl p-2 bg-white flex flex-col focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all" onSubmit={handleReply}>
                                <textarea
                                    className="w-full text-sm p-3 outline-none min-h-[100px] resize-y placeholder:text-brand-muted text-navy"
                                    placeholder="Type your response here... (This will be sent to the user)"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                ></textarea>
                                <div className="flex items-center justify-between border-t border-brand-border/50 pt-2 px-2 pb-1">
                                    <div className="flex gap-2">
                                        <button type="button" className="text-xs font-bold text-brand-muted hover:text-navy px-2 py-1 transition-colors">Attach File</button>
                                        <button type="button" className="text-xs font-bold text-brand-muted hover:text-navy px-2 py-1 transition-colors">Insert FAQ block</button>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={!replyText.trim()}
                                        className="btn-primary py-1.5 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send className="w-3.5 h-3.5 mr-1.5" /> Send Reply
                                    </button>
                                </div>
                            </form>
                        )}
                        {activeTicket.status === "Closed" && (
                            <div className="bg-brand-bg text-center p-4 rounded-xl border border-brand-border text-brand-muted text-sm italic">
                                This ticket is closed. It cannot receive new replies.
                            </div>
                        )}

                    </div>
                )}
            </Modal>

        </div>
    );
};

export default SupportTicketsPage;
