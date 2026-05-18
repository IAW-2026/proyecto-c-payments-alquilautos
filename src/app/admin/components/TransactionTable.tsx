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
    <div className="admin-table-card">
      <div className="admin-table-header">
        <span className="admin-table-title">Transacciones</span>
        <div className="admin-table-actions">
          <div className="admin-date-filter-wrapper">
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="admin-date-filter-input"
            />
            {selectedDate && (
              <button onClick={() => onDateChange("")} className="admin-date-clear-btn">✕</button>
            )}
          </div>
          <button 
            onClick={exportToPDF}
            className="admin-export-btn"
          >
            Exportar PDF
          </button>
        </div>
      </div>

      <div className="admin-table-scroll-container custom-scroll">
        <table className="admin-table">
          <thead>
            <tr className="admin-table-head-row">
              {["ID", "Reserva", "Propietario", "Fecha", "Monto", "Estado"].map((h) => (
                <th key={h} className="admin-table-th sticky-header">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((t) => (
                <tr key={t.id} className="admin-table-tr">
                  <td className="admin-table-td-id">{t.id}</td>
                  <td className="admin-table-td">
                    <div className="admin-client-info">
                      <span className="admin-client-avatar" style={{ background: t.color }}>{t.iniciales}</span>
                      <span className="admin-client-name">{t.cliente}</span>
                    </div>
                  </td>
                  <td className="admin-table-td-vehicle">{t.vehiculo}</td>
                  <td className="admin-table-td-date">{t.fecha}</td>
                  <td className="admin-table-td-amount">{formatCurrency(t.monto)}</td>
                  <td className="admin-table-td">
                    <span className="admin-status-badge" style={{ background: ESTADO_STYLES[t.estado].bg, color: ESTADO_STYLES[t.estado].color }}>{t.estado}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="admin-table-empty">Sin resultados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
