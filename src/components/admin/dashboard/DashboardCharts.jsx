"use client";

import React from "react";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const bookingsData = [
    { name: "Mon", appointments: 12 },
    { name: "Tue", appointments: 19 },
    { name: "Wed", appointments: 15 },
    { name: "Thu", appointments: 22 },
    { name: "Fri", appointments: 28 },
    { name: "Sat", appointments: 10 },
    { name: "Sun", appointments: 5 },
];

const inquiriesData = [
    { name: "Week 1", inquiries: 40 },
    { name: "Week 2", inquiries: 30 },
    { name: "Week 3", inquiries: 55 },
    { name: "Week 4", inquiries: 45 },
];

const subscribersData = [
    { name: "Jan", subscribers: 100 },
    { name: "Feb", subscribers: 150 },
    { name: "Mar", subscribers: 220 },
    { name: "Apr", subscribers: 280 },
    { name: "May", subscribers: 350 },
    { name: "Jun", subscribers: 400 },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-brand-border p-3 rounded-xl shadow-soft">
                <p className="font-bold text-navy text-sm mb-1">{label}</p>
                {payload.map((entry, index) => (
                    <p key={`item-${index}`} className="text-sm font-medium" style={{ color: entry.color }}>
                        {entry.name}: {entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function DashboardCharts() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Bookings Trend */}
            <div className="admin-card p-5 lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-navy">Bookings Trend</h3>
                        <p className="text-sm text-brand-muted">Appointments over the last 7 days</p>
                    </div>
                </div>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={bookingsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="appointments"
                                name="Appointments"
                                stroke="#4F46E5"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorBookings)"
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Inquiries & Subscribers */}
            <div className="space-y-6 lg:col-span-1">
                <div className="admin-card p-5">
                    <div className="mb-4">
                        <h3 className="text-base font-bold text-navy">Inquiry Trend</h3>
                        <p className="text-xs text-brand-muted">Current month inquiries</p>
                    </div>
                    <div className="h-[100px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={inquiriesData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F3F4F6' }} />
                                <Bar dataKey="inquiries" name="Inquiries" fill="#8B5CF6" radius={[4, 4, 4, 4]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="admin-card p-5">
                    <div className="mb-4">
                        <h3 className="text-base font-bold text-navy">Subscriber Growth</h3>
                        <p className="text-xs text-brand-muted">Newsletter opt-ins overtime</p>
                    </div>
                    <div className="h-[100px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={subscribersData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="subscribers"
                                    name="Subscribers"
                                    stroke="#10B981"
                                    strokeWidth={3}
                                    dot={false}
                                    activeDot={{ r: 5 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
