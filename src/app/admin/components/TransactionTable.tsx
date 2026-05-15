import React from "react";
import { Transaction, ESTADO_STYLES, formatCurrency } from "../constants";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface TransactionTableProps {
  transactions: Transaction[];
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export default function TransactionTable({ transactions, selectedDate, onDateChange }: TransactionTableProps) {
  
  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Título del reporte
      doc.setFontSize(18);
      doc.text("Reporte de Transacciones - PaymentsApp", 14, 22);
      
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 30);

      const tableColumn = ["ID", "Cliente", "Vehículo", "Fecha", "Monto", "Estado"];
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
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", boxShadow: "var(--shadow-card)", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.75rem", borderBottom: "1px solid var(--border-light)", flexWrap: "wrap", gap: "1rem" }}>
        <span style={{ fontWeight: 600 }}>Transacciones</span>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", border: "1px solid var(--border)", borderRadius: "8px", padding: "0.4rem 0.75rem", background: "#fff" }}>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              style={{ border: "none", outline: "none", fontSize: "0.8125rem", cursor: "pointer" }}
            />
            {selectedDate && (
              <button onClick={() => onDateChange("")} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.8rem" }}>✕</button>
            )}
          </div>
          <button 
            onClick={exportToPDF}
            style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: "0.4rem", 
              padding: "0.45rem 0.875rem", 
              border: "1px solid var(--border)", 
              borderRadius: "8px", 
              background: "#1f2937", 
              color: "#fff",
              fontSize: "0.8125rem", 
              cursor: "pointer",
              transition: "opacity 0.2s"
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Exportar PDF
          </button>
        </div>
      </div>

      <div className="custom-scroll" style={{ maxHeight: "450px", overflowY: "auto", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["ID", "Cliente", "Vehículo", "Fecha", "Monto", "Estado"].map((h) => (
                <th key={h} style={{ padding: "0.75rem 1.75rem", textAlign: "left", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", color: "var(--text-muted)", borderBottom: "1px solid var(--border-light)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((t) => (
                <tr key={t.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                  <td style={{ padding: "1rem 1.75rem", fontFamily: "monospace", fontSize: "0.8rem" }}>{t.id}</td>
                  <td style={{ padding: "1rem 1.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                      <span style={{ width: "28px", height: "28px", borderRadius: "50%", background: t.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", color: "#fff" }}>{t.iniciales}</span>
                      <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>{t.cliente}</span>
                    </div>
                  </td>
                  <td style={{ padding: "1rem 1.75rem", fontSize: "0.875rem" }}>{t.vehiculo}</td>
                  <td style={{ padding: "1rem 1.75rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>{t.fecha}</td>
                  <td style={{ padding: "1rem 1.75rem", fontSize: "0.875rem", fontWeight: 600 }}>{formatCurrency(t.monto)}</td>
                  <td style={{ padding: "1rem 1.75rem" }}>
                    <span style={{ padding: "3px 10px", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 600, background: ESTADO_STYLES[t.estado].bg, color: ESTADO_STYLES[t.estado].color }}>{t.estado}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>Sin resultados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
