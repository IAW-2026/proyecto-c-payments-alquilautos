"use client";

import { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import Header from "@/components/checkout/Header";
import Footer from "@/components/checkout/Footer";
import AdminHeader from "./components/AdminHeader";
import StatCard from "./components/StatCard";
import TransactionTable from "./components/TransactionTable";
import { formatCurrency, Transaction } from "./constants";

export default function AdminPanel() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState({ totalVentas: 0, cantidadPagos: 0, pagosAprobados: 0 });
  const [loading, setLoading] = useState(true);

  // 1. Extraemos email y rol de Clerk
  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
  const role = user?.publicMetadata?.role;

  // 2. Obtenemos emails permitidos de la whitelist pública
  const adminEmailsEnv = process.env.NEXT_PUBLIC_ADMIN_EMAILS || "";
  const adminEmails = adminEmailsEnv
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  // 3. Verificamos si tiene acceso por rol o whitelist de emails
  const isAuthorized = role === "admin" || (email && adminEmails.includes(email));

  useEffect(() => {
    // 4. Regla de Hooks: Declarar todos los hooks primero.
    // Solo iniciamos el fetch si Clerk cargó y el usuario está autenticado y autorizado.
    if (!isLoaded || !isSignedIn || !isAuthorized) {
      return;
    }

    async function fetchData() {
      try {
        const response = await fetch("/api/admin/transactions");
        const data = await response.json();

        if (data.transactions) {
          setTransactions(data.transactions);

          if (data.stats) {
            setStats(data.stats);
          }
        }
      } catch (error) {
        console.error("Error al cargar datos del admin:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [isLoaded, isSignedIn, isAuthorized]);

  // --- RETORNOS TEMPRANOS DE RENDER (colocados al final de los hooks) ---

  // 5. Pantalla de carga mientras Clerk inicializa
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

  // 6. Pantalla de Acceso Denegado si no es administrador (Diseño Claro Integrado, sin nota de desarrollo)
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

            <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem", width: "100%" }}>
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
    <div className="admin-layout">
      <Header />

      <div className="admin-container">
        <AdminHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>Cargando datos...</div>
        ) : (
          <>
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