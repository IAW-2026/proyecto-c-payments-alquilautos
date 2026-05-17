"use client";

import { useState, useEffect } from "react";
import Header from "@/components/checkout/Header";
import Footer from "@/components/checkout/Footer";
import AdminHeader from "./components/AdminHeader";
import StatCard from "./components/StatCard";
import TransactionTable from "./components/TransactionTable";
import { formatCurrency } from "./constants";

export default function AdminPanel() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/admin/transactions");
        const data = await response.json();
        
        if (data.transactions) {
          setTransactions(data.transactions);
          
          // Formatear los stats para los StatCards
          const formattedStats = [
            { label: "Ventas Totales", value: formatCurrency(data.stats.totalVentas), change: "+12.5%", isPositive: true },
            { label: "Pagos Realizados", value: String(data.stats.cantidadPagos), change: "+3.2%", isPositive: true },
            { label: "Tasa de Aprobación", value: `${((data.stats.pagosAprobados / (data.stats.cantidadPagos || 1)) * 100).toFixed(1)}%`, change: "-1.5%", isPositive: false },
          ];
          setStats(formattedStats);
        }
      } catch (error) {
        console.error("Error al cargar datos del admin:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredTransactions = transactions.filter((t) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = 
      t.id.toLowerCase().includes(search) ||
      t.cliente.toLowerCase().includes(search) ||
      t.estado.toLowerCase().includes(search);

    let matchesDate = true;
    if (selectedDate) {
      const [year, month, day] = selectedDate.split("-");
      const formattedInputDate = `${day}/${month}/${year}`;
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

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>Cargando datos reales...</div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
              {stats.map((stat) => (
                <StatCard key={stat.label} stat={stat} />
              ))}
            </div>

            <TransactionTable 
              transactions={filteredTransactions}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}