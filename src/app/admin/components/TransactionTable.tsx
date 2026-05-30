import { useState } from "react";
import { Transaction, ESTADO_STYLES, formatCurrency } from "../constants";
import { cancelTransaction } from "../actions";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

interface TransactionTableProps {
  transactions: Transaction[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  onDeleteTransaction: (id: string) => void;
}

export default function TransactionTable({ transactions, selectedDate, onDateChange, onDeleteTransaction }: TransactionTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const exportToExcel = () => {
    try {
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

      // Ajustar ancho de columnas automáticamente
      const colWidths = [
        { wch: 8 },   // ID
        { wch: 15 },  // Reserva
        { wch: 18 },  // Propietario
        { wch: 14 },  // Fecha
        { wch: 16 },  // Monto
        { wch: 14 },  // Estado
      ];
      ws["!cols"] = colWidths;

      XLSX.writeFile(wb, `reporte_pagos_${new Date().getTime()}.xlsx`);
    } catch (error) {
      console.error("Error al exportar Excel:", error);
      alert("No se pudo generar el Excel. Por favor, intente de nuevo.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de cancelar esta transacción?")) return;
    
    setDeletingId(id);
    try {
      await cancelTransaction(id);
      onDeleteTransaction(id);
    } catch (error) {
      console.error("Error al cancelar transacción:", error);
      alert(error instanceof Error ? error.message : "No se pudo cancelar la transacción. Por favor, intente de nuevo.");
    } finally {
      setDeletingId(null);
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
            onClick={exportToExcel}
            className="admin-export-btn admin-export-excel-btn"
          >
            Exportar Excel
          </button>
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
                    <span
                      className={`admin-status-badge admin-status-${t.estado}`}
                      style={ESTADO_STYLES[t.estado]}
                    >
                      {t.estado}
                    </span>
                    {(t.estado === "Pendiente" || t.estado === "Coordinado") && (
                      <button
                        onClick={() => handleDelete(t.id)}
                        disabled={deletingId === t.id}
                        className="admin-delete-btn"
                        title="Cancelar transacción"
                      >
                        {deletingId === t.id ? (
                          "..."
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                          </svg>
                        )}
                      </button>
                    )}
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