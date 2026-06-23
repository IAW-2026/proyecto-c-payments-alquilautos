"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "./AdminHeader";
import StatCard from "./StatCard";
import SalesChart from "./SalesChart";
import TransactionTable from "./TransactionTable";
import AdminSidebar from "./AdminSidebar";
import { formatCurrency, type Moneda } from "@/lib/format";
import { getCotizacion } from "../actions";
import type { Transaction } from "@/types";

type Vista = "clientes" | "analiticas";

const monedas: Moneda[] = ["ARS", "USD", "EUR", "GBP"];

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
  const [currency, setCurrency] = useState<Moneda>("ARS");
  const [cotizaciones, setCotizaciones] = useState<Record<string, number>>({});

  useEffect(() => {
    if (currency !== "ARS") {
      getCotizacion().then(setCotizaciones);
    }
  }, [currency]);

  const convertir = (monto: number) =>
    currency === "ARS" ? monto : monto / (cotizaciones[currency] || 1);

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
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-[2rem] font-bold text-text-primary max-lg:text-[1.75rem] max-md:text-[1.5rem] max-sm:text-lg">Analíticas</h1>
                  <p className="text-sm text-text-secondary max-sm:text-xs">Resumen de ingresos y rendimiento.</p>
                </div>
                <div className="flex gap-1 bg-bg rounded-lg p-1">
                  {monedas.map((m) => (
                    <button
                      key={m}
                      onClick={() => setCurrency(m)}
                      className={`py-1.5 px-4 rounded-md text-sm font-medium cursor-pointer transition-colors ${
                        currency === m
                          ? "bg-surface text-text-primary shadow-sm"
                          : "text-text-muted hover:text-text-secondary"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6 max-lg:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] max-md:grid-cols-1 max-md:gap-4">
                <StatCard
                  label="Ventas Totales"
                  value={formatCurrency(convertir(stats.totalVentas), currency)}
                  sub={currency === "ARS" ? "Monto acumulado en pesos" : "Cotización oficial (Frankfurter)"}
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
              <SalesChart currency={currency} cotizacion={cotizaciones[currency] || 1} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
