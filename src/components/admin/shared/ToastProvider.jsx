"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/admin-utils";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const triggerToast = useCallback((message, type = "success", duration = 3000) => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, message, type }]);

        if (duration) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, duration);
        }
    }, []);

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ triggerToast }}>
            {children}
            <div className="fixed top-24 right-8 z-[100] flex flex-col gap-3">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={cn(
                            "px-6 py-4 rounded-xl shadow-premium flex items-start gap-4 animate-in fade-in slide-in-from-right-8 min-w-[300px]",
                            toast.type === "success" ? "bg-emerald-500 text-white" :
                                toast.type === "error" ? "bg-red-500 text-white" :
                                    toast.type === "warning" ? "bg-orange-500 text-white" :
                                        "bg-navy text-white"
                        )}
                    >
                        <div className="shrink-0 pt-0.5">
                            {toast.type === "success" && <CheckCircle2 className="w-5 h-5" />}
                            {toast.type === "error" && <AlertCircle className="w-5 h-5" />}
                            {toast.type === "warning" && <AlertCircle className="w-5 h-5" />}
                            {toast.type === "info" && <Info className="w-5 h-5" />}
                        </div>
                        <span className="font-bold text-sm tracking-wide flex-1">{toast.message}</span>
                        <button onClick={() => removeToast(toast.id)} className="shrink-0 p-0.5 hover:bg-white/20 rounded-md transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
