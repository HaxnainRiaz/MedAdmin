"use client";

import React from "react";
import { cn } from "@/lib/admin-utils";
import { TrendingUp, TrendingDown } from "lucide-react";

const KpiCard = ({ title, value, trend, trendValue, icon: Icon, color = "blue" }) => {
    const colors = {
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        green: "bg-emerald-50 text-emerald-600 border-emerald-100",
        orange: "bg-orange-50 text-orange-600 border-orange-100",
        purple: "bg-purple-50 text-purple-600 border-purple-100",
    };

    return (
        <div className="admin-card p-6 admin-card-hover flex justify-between items-start">
            <div className="flex flex-col">
                <span className="text-sm font-medium text-brand-muted mb-1">{title}</span>
                <h3 className="text-2xl font-bold text-navy mb-2">{value}</h3>
                {trend && (
                    <div className="flex items-center gap-1">
                        <div className={cn(
                            "flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded",
                            trend === "up" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                        )}>
                            {trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {trendValue}
                        </div>
                        <span className="text-[10px] text-brand-muted">vs last month</span>
                    </div>
                )}
            </div>
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border", colors[color])}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    );
};

export default KpiCard;
