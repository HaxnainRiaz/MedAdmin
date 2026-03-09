import React, { useEffect } from "react";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-md" }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-navy/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>
            <div className={`relative w-full ${maxWidth} bg-white rounded-2xl shadow-premium overflow-hidden transform transition-all flex flex-col max-h-[90vh]`}>
                {title && (
                    <div className="p-6 border-b border-brand-border flex items-center justify-between bg-brand-bg/30">
                        <h3 className="text-xl font-bold text-navy">{title}</h3>
                        <button
                            onClick={onClose}
                            className="p-2 text-brand-muted hover:text-navy hover:bg-brand-bg rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}
                <div className="p-6 overflow-y-auto override-scrollbar flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
