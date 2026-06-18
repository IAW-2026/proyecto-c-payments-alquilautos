"use client";

import type { Transaction } from "@/types";
import { formatCurrency, formatDate } from "@/lib/format";

interface ExportPDFButtonProps {
  transactions: Transaction[];
}

export default function ExportPDFButton({ transactions }: ExportPDFButtonProps) {
  const handleExport = async () => {
    try {
      const jsPDF = (await import("jspdf")).default;
      const autoTable = (await import("jspdf-autotable")).default;
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text("Reporte de Transacciones - PaymentsApp", 14, 22);

      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Fecha de generación: ${formatDate(new Date())}`, 14, 30);

      const tableColumn = ["ID", "Reserva", "Propietario", "Fecha", "Monto", "Estado"];
      const tableRows = transactions.map(t => [
        t.id,
        t.cliente,
        t.vehiculo,
        t.fecha,
        formatCurrency(t.monto),
        t.estado
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 40,
        theme: "grid",
        headStyles: { fillColor: [31, 41, 55], textColor: [255, 255, 255], fontStyle: "bold" },
        styles: { fontSize: 9, cellPadding: 3 },
        alternateRowStyles: { fillColor: [249, 250, 251] }
      });

      doc.save(`reporte_pagos_${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error("Error al exportar PDF:", error);
      alert("No se pudo generar el PDF. Por favor, intente de nuevo.");
    }
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-[0.4rem] py-[0.45rem] px-[0.875rem] border border-border rounded-lg bg-[#1f2937] text-white text-[0.8125rem] cursor-pointer transition-opacity hover:opacity-90 max-sm:text-[0.7rem] max-sm:py-[0.3rem] max-sm:px-2"
    >
      Exportar PDF
    </button>
  );
}
