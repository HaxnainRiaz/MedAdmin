import React from "react";
import { cn } from "@/lib/admin-utils";

/**
 * A reusable, responsive table component with consistent spacing.
 */
export default function DataTable({ headers, children, mobileContent }) {
    return (
        <React.Fragment>
            {/* Desktop / Tablet Table */}
            <div className={cn("table-responsive-wrapper overflow-x-auto w-full border-t border-brand-border", mobileContent ? "hidden lg:block" : "")}>
                <div className="min-w-[800px] inline-block w-full align-middle">
                    <table className="admin-table w-full text-left border-collapse">
                        <thead>
                            <tr>
                                {headers.map((h, i) => (
                                    <th
                                        key={i}
                                        className={cn(
                                            "px-4 md:px-6 py-4 bg-brand-bg text-[10px] sm:text-xs uppercase tracking-wider text-brand-muted font-bold whitespace-nowrap",
                                            h.className || (h.content ? h.className : "")
                                        )}
                                    >
                                        {h.content || h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border bg-white">
                            {children}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile / Tablet Stacked Cards */}
            {mobileContent && (
                <div className="block lg:hidden flex flex-col gap-4 p-4 sm:p-6 bg-brand-bg/30">
                    {mobileContent}
                </div>
            )}
        </React.Fragment>
    );
}
