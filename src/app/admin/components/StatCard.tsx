import React from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  sub: string;
}

export default function StatCard({ label, value, sub }: StatCardProps) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-card max-md:p-5 max-sm:p-3">
      <p className="text-xs font-semibold uppercase text-text-muted mb-2 max-sm:text-[0.6rem]">{label}</p>
      <div className="text-[1.75rem] font-bold text-text-primary max-md:text-[1.5rem] max-sm:text-[1.25rem]">{value}</div>
      <div className="text-xs font-medium text-text-muted max-sm:text-[0.65rem]">{sub}</div>
    </div>
  );
}
