"use client";

import { useState } from "react";
import Header from "@/components/checkout/Header";
import Footer from "@/components/checkout/Footer";
import AdminHeader from "./components/AdminHeader";
import StatCard from "./components/StatCard";
import TransactionTable from "./components/TransactionTable";
import { MOCK_STATS, MOCK_TRANSACCIONES } from "./constants";

export default function AdminPanel() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const filteredTransactions = MOCK_TRANSACCIONES.filter((t) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = 
      t.id.toLowerCase().includes(search) ||
      t.cliente.toLowerCase().includes(search) ||
      t.vehiculo.toLowerCase().includes(search) ||
      t.estado.toLowerCase().includes(search);

    let matchesDate = true;
    if (selectedDate) {
      const [year, month, day] = selectedDate.split("-");
      const formattedInputDate = `${day}-${month}-${year}`;
      matchesDate = t.fecha === formattedInputDate;
    }

    return matchesSearch && matchesDate;
  });

  return (
    <div style={{ minHeight: "100dvh", display: "grid", gridTemplateRows: "auto 1fr auto", fontFamily: "var(--font)", background: "var(--bg)" }}>
      <style>{`
        thead th {
          position: sticky;
          top: 0;
          z-index: 10;
          background: #f8fafc;
          border-bottom: 2px solid var(--border-light) !important;
        }
        .custom-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

      <Header />

      <div style={{ padding: "2.5rem 3rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
        
        <AdminHeader 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
          {MOCK_STATS.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>

        <TransactionTable 
          transactions={filteredTransactions}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      </div>
      <Footer />
    </div>
  );
}