"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getSalesStats } from "../actions";
import { formatCurrency, type Moneda } from "@/lib/format";

type Periodo = "dia" | "semana" | "mes";

interface SalesChartProps {
  currency: Moneda;
  cotizacion: number;
}

const simbolos: Record<string, string> = {
  USD: "US$",
  EUR: "€",
  GBP: "£",
  ARS: "$",
};

export default function SalesChart({ currency, cotizacion }: SalesChartProps) {
  const [periodo, setPeriodo] = useState<Periodo>("mes");
  const [data, setData] = useState<{ fecha: string; monto: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getSalesStats().then((stats) => {
      const map = {
        dia: stats.ventasPorDia,
        semana: stats.ventasPorSemana,
        mes: stats.ventasPorMes,
      };
      setData(map[periodo]);
    }).catch(console.error).finally(() => setLoading(false));
  }, [periodo]);

  const tabs: { key: Periodo; label: string }[] = [
    { key: "dia", label: "Día" },
    { key: "semana", label: "Semana" },
    { key: "mes", label: "Mes" },
  ];

  const convertir = (monto: number) =>
    currency === "ARS" ? monto : monto / cotizacion;

  const dataConvertida = data.map((d) => ({ ...d, monto: convertir(d.monto) }));
  const simbolo = simbolos[currency] || "$";

  const formatoEje = (v: number) => `${simbolo}${(v / 1000).toFixed(0)}k`;

  const [chartColors, setChartColors] = useState({ border: "#e4e7ec", text: "#9aa3b2", brand: "#2563eb" });
  useEffect(() => {
    const s = getComputedStyle(document.documentElement);
    setChartColors({
      border: s.getPropertyValue("--color-border").trim() || "#e4e7ec",
      text: s.getPropertyValue("--color-text-muted").trim() || "#9aa3b2",
      brand: s.getPropertyValue("--color-brand").trim() || "#2563eb",
    });
  }, []);

  return (
    <div className="bg-surface border border-border rounded-2xl shadow-card p-6 max-sm:p-4">
      <div className="flex items-center justify-between mb-6 max-sm:flex-col max-sm:items-start max-sm:gap-3">
        <h3 className="font-display text-lg font-semibold text-text-primary">
          Ingresos {currency !== "ARS" ? `(${currency})` : ""}
        </h3>
        <div className="flex gap-1 bg-bg rounded-lg p-1">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setPeriodo(key)}
              className={`py-1.5 px-4 rounded-md text-sm font-medium cursor-pointer transition-colors ${
                periodo === key
                  ? "bg-surface text-text-primary shadow-sm"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="h-[250px] flex items-center justify-center text-text-muted text-sm">Cargando...</div>
      ) : dataConvertida.length === 0 ? (
        <div className="h-[250px] flex items-center justify-center text-text-muted text-sm">Sin datos de ventas</div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={dataConvertida} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.border} />
            <XAxis
              dataKey="fecha"
              tick={{ fontSize: 11, fill: chartColors.text }}
              tickLine={false}
              axisLine={{ stroke: chartColors.border }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11, fill: chartColors.text }}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatoEje}
            />
            <Tooltip
              formatter={(value) => [formatCurrency(Number(value), currency), "Ingresos"]}
              labelFormatter={(label) => `Fecha: ${label}`}
              contentStyle={{
                borderRadius: 8,
                border: `1px solid ${chartColors.border}`,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                fontSize: 13,
              }}
            />
            <Bar dataKey="monto" fill={chartColors.brand} radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
