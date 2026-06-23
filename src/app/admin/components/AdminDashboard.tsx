"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "./AdminHeader";
import StatCard from "./StatCard";
import SalesChart from "./SalesChart";
import TransactionTable from "./TransactionTable";
import AdminSidebar from "./AdminSidebar";
import { formatCurrency } from "@/lib/format";
import type { Transaction } from "@/types";

type Vista = "clientes" | "analiticas";

interface AdminDashboardProps {
  transactions: Transaction[];
  stats: {
    totalVentas: number;
    cantidadPagos: number;
    pagosAprobados: number;
  };
}

export default function AdminDashboard({ transactions, stats }: AdminDashboardProps) {
  const router = useRouter();
  const [activeView, setActiveView] = useState<Vista>("clientes");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const approvedPaymentIds = new Set(
    transactions.filter((t) => t.estado === "Pagada").map((t) => t.id_pago)
  );

  const filteredTransactions = transactions.filter((t) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      t.id.toLowerCase().includes(search) ||
      t.cliente.toLowerCase().includes(search) ||
      t.estado.toLowerCase().includes(search);

    let matchesDate = true;
    if (selectedDate) {
      const [year, month, day] = selectedDate.split("-");
      const formattedInputDate = `${day}-${month}-${year}`;
      matchesDate = t.fecha.startsWith(formattedInputDate);
    }

    return matchesSearch && matchesDate;
  });

  return (
    <div className="min-h-dvh flex bg-bg">
      <AdminSidebar activeView={activeView} onViewChange={setActiveView} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 py-8 px-8 max-lg:py-6 max-lg:px-6 max-md:py-4 max-md:px-4 overflow-y-auto">
          {activeView === "clientes" ? (
            <div className="space-y-6">
              <AdminHeader
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
              <TransactionTable
                transactions={filteredTransactions}
                approvedPaymentIds={approvedPaymentIds}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                onDeleteTransaction={() => router.refresh()}
              />
            </div>
          ) : (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div>
                <h1 className="text-[2rem] font-bold text-text-primary max-lg:text-[1.75rem] max-md:text-[1.5rem] max-sm:text-lg">Analíticas</h1>
                <p className="text-sm text-text-secondary max-sm:text-xs">Resumen de ingresos y rendimiento.</p>
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6 max-lg:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] max-md:grid-cols-1 max-md:gap-4">
                <StatCard
                  label="Ventas Totales"
                  value={formatCurrency(stats.totalVentas)}
                  sub="Monto acumulado en pesos"
                />
                <StatCard
                  label="Pagos Realizados"
                  value={stats.cantidadPagos}
                  sub="Transacciones registradas"
                />
                <StatCard
                  label="Tasa de Aprobación"
                  value={`${((stats.pagosAprobados / (stats.cantidadPagos || 1)) * 100).toFixed(1)}%`}
                  sub={`${stats.pagosAprobados} de ${stats.cantidadPagos} aprobadas`}
                />
              </div>
              <SalesChart />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
