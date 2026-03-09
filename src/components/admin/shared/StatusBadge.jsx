"use client";

import React from "react";
import { cn } from "@/lib/admin-utils";

const StatusBadge = ({ status, variant = "default" }) => {
    const getStyles = () => {
        switch (status?.toLowerCase()) {
            case "confirmed":
            case "published":
            case "active":
            case "completed":
            case "resolved":
                return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "pending":
            case "draft":
            case "in progress":
            case "waiting":
                return "bg-orange-100 text-orange-700 border-orange-200";
            case "cancelled":
            case "no-show":
            case "rejected":
            case "spam":
            case "inactive":
                return "bg-red-100 text-red-700 border-red-200";
            case "scheduled":
                return "bg-blue-100 text-blue-700 border-blue-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    return (
        <span className={cn("status-badge border", getStyles())}>
            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
            {status}
        </span>
    );
};

export default StatusBadge;
