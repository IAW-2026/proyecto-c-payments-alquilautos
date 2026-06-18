"use client";

import type { Transaction } from "@/types";
import { formatCurrency } from "@/lib/format";

interface ExportExcelButtonProps {
  transactions: Transaction[];
}

export default function ExportExcelButton({ transactions }: ExportExcelButtonProps) {
  const handleExport = async () => {
    try {
      const XLSX = await import("xlsx");
      const wsData = transactions.map(t => ({
        ID: t.id,
        Reserva: t.cliente,
        Propietario: t.vehiculo,
        Fecha: t.fecha,
        Monto: formatCurrency(t.monto),
        Estado: t.estado,
      }));

      const ws = XLSX.utils.json_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Transacciones");

      const colWidths = [
        { wch: 8 },
        { wch: 15 },
        { wch: 18 },
        { wch: 14 },
        { wch: 16 },
        { wch: 14 },
      ];
      ws["!cols"] = colWidths;

      XLSX.writeFile(wb, `reporte_pagos_${new Date().getTime()}.xlsx`);
    } catch (error) {
      console.error("Error al exportar Excel:", error);
      alert("No se pudo generar el Excel. Por favor, intente de nuevo.");
    }
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-[0.4rem] py-[0.45rem] px-[0.875rem] border rounded-lg bg-[#16a34a] border-[#16a34a] text-white text-[0.8125rem] cursor-pointer transition-opacity hover:opacity-90 hover:bg-[#15803d] max-sm:text-[0.7rem] max-sm:py-[0.3rem] max-sm:px-2"
    >
      Exportar Excel
    </button>
  );
}
