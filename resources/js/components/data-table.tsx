import React from 'react';

interface DataTableProps {
    headers: string[];
    children: React.ReactNode;
    title?: string;
    description?: string;
    action?: React.ReactNode;
}

export function DataTable({ headers, children, title, description, action }: DataTableProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    {title && <h2 className="text-xl font-bold tracking-tight">{title}</h2>}
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </div>
                {action && <div>{action}</div>}
            </div>

            <div className="rounded-md border bg-card">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b bg-muted/50">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                {headers.map((header, index) => (
                                    <th
                                        key={index}
                                        className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {children}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export function DataTableRow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <tr className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${className}`}>
            {children}
        </tr>
    );
}

export function DataTableCell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}>
            {children}
        </td>
    );
}
