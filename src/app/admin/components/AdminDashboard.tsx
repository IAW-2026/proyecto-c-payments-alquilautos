"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminHeader from "./AdminHeader";
import StatCard from "./StatCard";
import TransactionTable from "./TransactionTable";
import { formatCurrency } from "@/lib/format";
import type { Transaction } from "@/types";

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
    <div className="min-h-dvh grid grid-rows-[auto_1fr_auto]">
      <Header />

      <main className="w-full py-10 px-12 flex flex-col gap-7 flex-1 max-lg:py-8 max-lg:px-6 max-md:py-6 max-md:px-5 max-md:gap-5 max-sm:p-3 max-sm:gap-3">
        <AdminHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

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

        <TransactionTable
          transactions={filteredTransactions}
          approvedPaymentIds={approvedPaymentIds}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onDeleteTransaction={() => router.refresh()}
        />
      </main>
      <Footer />
    </div>
  );
}
