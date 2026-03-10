import React from "react";
import { cn } from "@/lib/admin-utils";

/**
 * A reusable, responsive table component with consistent spacing.
 */
export default function DataTable({ headers, children }) {
    return (
        <div className="table-responsive-wrapper overflow-x-auto w-full -mx-4 sm:mx-0">
            <div className="min-w-[800px] inline-block w-full align-middle">
                <table className="admin-table w-full text-left border-collapse">
                    <thead>
                        <tr>
                            {headers.map((h, i) => (
                                <th
                                    key={i}
                                    className={cn(
                                        "px-4 sm:px-6 py-4 bg-brand-bg text-[10px] uppercase tracking-wider text-brand-muted font-bold whitespace-nowrap",
                                        h.className
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
    );
}
