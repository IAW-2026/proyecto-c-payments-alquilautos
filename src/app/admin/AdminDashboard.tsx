"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import Header from "@/components/checkout/Header";
import Footer from "@/components/checkout/Footer";
import AdminHeader from "./components/AdminHeader";
import StatCard from "./components/StatCard";
import TransactionTable from "./components/TransactionTable";
import { formatCurrency, Transaction } from "./constants";
import { isAdminUser } from "@/lib/admin";

interface AdminDashboardProps {
  transactions: Transaction[];
  stats: {
    totalVentas: number;
    cantidadPagos: number;
    pagosAprobados: number;
  };
}

export default function AdminDashboard({ transactions, stats }: AdminDashboardProps) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
  const isAuthorized = isAdminUser(user);

  // --- RETORNOS TEMPRANOS DE RENDER ---

  // 4. Pantalla de carga mientras Clerk inicializa
  if (!isLoaded) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-loading-container">
          <div className="admin-loading-spinner" />
          <span>Verificando credenciales...</span>
        </div>
      </div>
    );
  }

  // 5. Pantalla de Acceso Denegado si no es administrador
  if (!isSignedIn || !isAuthorized) {
    return (
      <div className="admin-denied-layout">
        <Header />
        <main className="admin-denied-main">
          <div className="admin-denied-card">
            <div className="admin-denied-icon-container">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>

            <h2 className="admin-denied-title">Acceso Restringido</h2>

            <p className="admin-denied-text">
              Tu cuenta <strong>{email || "sin correo"}</strong> no tiene permisos de administrador en este panel de control.
            </p>

            <div className="admin-denied-actions">
              <button 
                onClick={() => signOut({ redirectUrl: "/" })}
                className="admin-denied-btn-logout"
              >
                Cerrar Sesión e Iniciar con otra cuenta
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const approvedPaymentIds = new Set(
    transactions.filter((t) => t.estado === "Aprobada").map((t) => t.id_pago)
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
      const formattedInputDate = `${day}/${month}/${year}`;
      matchesDate = t.fecha.startsWith(formattedInputDate);
    }

    return matchesSearch && matchesDate;
  });

  return (
    <div className="admin-layout">
      <Header />

      <div className="admin-container">
        <AdminHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <div className="admin-stats-grid">
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
      </div>
      <Footer />
    </div>
  );
}