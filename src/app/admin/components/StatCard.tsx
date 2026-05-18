import React from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  sub: string;
}

export default function StatCard({ label, value, sub }: StatCardProps) {
  return (
    <div className="admin-stat-card">
      <p className="admin-stat-label">{label}</p>
      <div className="admin-stat-value">{value}</div>
      <div className="admin-stat-sub">{sub}</div>
    </div>
  );
}
