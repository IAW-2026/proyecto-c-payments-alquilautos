import React from "react";
import { Stat } from "../constants";

interface StatCardProps {
  stat: Stat;
}

export default function StatCard({ stat }: StatCardProps) {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "1.5rem", boxShadow: "var(--shadow-card)" }}>
      <p style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.5rem" }}>{stat.label}</p>
      <div style={{ fontSize: "1.75rem", fontWeight: 700 }}>{stat.value}</div>
      <div style={{ fontSize: "0.75rem", color: stat.color, fontWeight: 500 }}>{stat.sub}</div>
    </div>
  );
}
