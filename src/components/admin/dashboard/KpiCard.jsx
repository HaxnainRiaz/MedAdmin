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
        <div className="admin-card p-4 sm:p-5 lg:p-6 admin-card-hover flex justify-between items-start gap-3">
            <div className="flex flex-col min-w-0">
                <span className="text-[11px] sm:text-xs lg:text-sm font-medium text-brand-muted mb-1 truncate">{title}</span>
                <h3 className="text-xl sm:text-2xl font-bold text-navy mb-2 truncate">{value}</h3>
                {trend && (
                    <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                        <div className={cn(
                            "flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap",
                            trend === "up" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                        )}>
                            {trend === "up" ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                            {trendValue}
                        </div>
                        <span className="text-[10px] text-brand-muted whitespace-nowrap">vs month</span>
                    </div>
                )}
            </div>
            <div className={cn("w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center border shrink-0", colors[color])}>
                <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5 lg:w-6 lg:h-6" />
            </div>
        </div>
    );
};

export default KpiCard;
