"use client";

import { Transaction } from "@/types";
import { formatCurrency } from "@/lib/format";
import { cancelTransaction } from "../actions";
import ExportPDFButton from "@/components/ExportPDFButton";
import ExportExcelButton from "@/components/ExportExcelButton";
import CancelButton from "@/components/CancelButton";
import DownloadReceiptButton from "@/components/DownloadReceiptButton";

interface TransactionTableProps {
  transactions: Transaction[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  onDeleteTransaction: (id_pago: number) => void;
}

function getStatusClasses(estado: string) {
  const map: Record<string, string> = {
    Pagada: "bg-[#f3e8ff] text-[#9333ea]",
    Pendiente: "bg-[#fef9c3] text-[#a16207]",
    Cancelada: "bg-[#fee2e2] text-[#dc2626]",
    Coordinada: "bg-[#dbeafe] text-[#1d4ed8]",
  };
  return map[estado] || "bg-gray-100 text-gray-600";
}

export default function TransactionTable({ transactions, selectedDate, onDateChange, onDeleteTransaction }: TransactionTableProps) {
  const handleCancel = async (idPago: number) => {
    await cancelTransaction(String(idPago));
    onDeleteTransaction(idPago);
  };

  return (
    <div className="bg-surface border border-border rounded-2xl shadow-card overflow-hidden flex-1">
      <div className="flex items-center justify-between py-5 px-7 border-b border-border-light flex-wrap gap-4 max-md:flex-col max-md:items-stretch max-md:p-4 max-md:gap-3 max-sm:p-2">
        <span className="font-semibold text-text-primary max-sm:text-[0.85rem]">Transacciones</span>
        <div className="flex gap-3 max-md:flex-wrap max-md:gap-2">
          <div className="flex items-center gap-2 border border-border rounded-lg py-[0.4rem] px-3 bg-surface max-sm:py-1 max-sm:px-[0.4rem]">
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="border-none outline-none text-[0.8125rem] text-text-primary cursor-pointer max-sm:text-[0.7rem] max-sm:max-w-[100px]"
            />
            {selectedDate && (
              <button onClick={() => onDateChange("")} className="bg-none border-none text-text-muted cursor-pointer text-[0.8rem]">✕</button>
            )}
          </div>
          <ExportExcelButton transactions={transactions} />
          <ExportPDFButton transactions={transactions} />
        </div>
      </div>

      <div className="max-h-[450px] overflow-y-auto overflow-x-auto custom-scroll">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-bg">
              {["ID", "Reserva", "Propietario", "Fecha", "Monto", "Estado"].map((h) => (
                <th key={h} className="py-3 px-7 text-center text-[0.72rem] font-semibold uppercase text-text-muted border-b border-border-light sticky top-0 z-10 bg-bg max-md:py-2 max-md:px-4 max-md:text-[0.65rem] max-sm:py-[0.3rem] max-sm:px-[0.4rem] max-sm:text-[0.55rem] max-sm:tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((t) => (
                <tr key={t.id} className="border-b border-border-light">
                  <td className="py-4 px-7 font-mono text-[0.8rem] text-text-primary text-center max-md:py-3 max-md:px-4 max-sm:py-[0.4rem] max-sm:px-[0.4rem] max-sm:text-[0.65rem]">{t.id}</td>
                  <td className="py-4 px-7 text-center max-md:py-3 max-md:px-4 max-sm:py-[0.4rem] max-sm:px-[0.4rem] max-sm:text-[0.7rem]">
                    <div className="flex items-center justify-center gap-[0.625rem] max-sm:gap-[0.375rem]">
                      <span className="w-7 h-7 rounded-full flex items-center justify-center text-[0.7rem] text-white max-md:hidden" style={{ background: t.color }}>{t.iniciales}</span>
                      <span className="text-[0.875rem] font-medium text-text-primary max-sm:text-[0.7rem]">{t.cliente}</span>
                    </div>
                  </td>
                  <td className="py-4 px-7 text-[0.875rem] text-text-primary text-center max-md:py-3 max-md:px-4 max-sm:py-[0.4rem] max-sm:px-[0.4rem] max-sm:text-[0.7rem]">{t.vehiculo}</td>
                  <td className="py-4 px-7 text-[0.875rem] text-text-secondary text-center max-md:py-3 max-md:px-4 max-sm:py-[0.4rem] max-sm:px-[0.4rem] max-sm:text-[0.7rem]">{t.fecha}</td>
                  <td className="py-4 px-7 text-[0.875rem] font-semibold text-text-primary text-center max-md:py-3 max-md:px-4 max-sm:py-[0.4rem] max-sm:px-[0.4rem] max-sm:text-[0.7rem]">{formatCurrency(t.monto)}</td>
                  <td className="py-4 px-7 text-center max-md:py-3 max-md:px-4 max-sm:py-[0.4rem] max-sm:px-[0.4rem]">
                    <div className="flex items-center justify-center gap-2">
                      <span className={`py-[3px] px-[10px] rounded-full text-[0.75rem] font-semibold uppercase max-sm:text-[0.6rem] max-sm:py-px max-sm:px-[5px] ${getStatusClasses(t.estado)}`}>
                        {t.estado}
                      </span>
                      {t.estado === "Pagada" && (
                        <DownloadReceiptButton
                          transaction={{
                            id_pago: t.id_pago,
                            id_reserva: t.id_reserva,
                            cliente: t.cliente,
                            monto: t.monto,
                            fecha: t.fecha,
                            vehiculo: t.vehiculo,
                          }}
                        />
                      )}
                      {(t.pagoEstado === "Pendiente" || t.pagoEstado === "Coordinada") && (
                        <CancelButton
                          idPago={t.id_pago}
                          onCancel={handleCancel}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center text-text-muted">Sin resultados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
