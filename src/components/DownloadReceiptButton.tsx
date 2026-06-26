"use client";

interface DownloadReceiptButtonProps {
  transaction: {
    id_pago: number;
    id_reserva: string;
    cliente: string;
    monto: number;
    fecha: string;
    vehiculo: string;
  };
}

export default function DownloadReceiptButton({ transaction }: DownloadReceiptButtonProps) {
  const handleDownload = async () => {
    try {
      const jsPDF = (await import("jspdf")).default;
      const autoTable = (await import("jspdf-autotable")).default;
      const doc = new jsPDF({ unit: "mm", format: "a4" });

      const pageWidth = doc.internal.pageSize.getWidth();

      // Colores corporativos
      const brandColor: [number, number, number] = [29, 185, 84];
      const darkGray: [number, number, number] = [15, 17, 23];
      const midGray: [number, number, number] = [90, 100, 120];
      const lightGray: [number, number, number] = [244, 246, 250];

      // === Header con fondo verde ===
      doc.setFillColor(...brandColor);
      doc.rect(0, 0, pageWidth, 50, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("AlquilAutos", 20, 22);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Comprobante de Pago", 20, 32);

      doc.setFontSize(8);
      doc.text(`Emisión: ${new Date().toLocaleDateString("es-AR")} ${new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}`, 20, 40);

      // === Línea divisoria ===
      doc.setDrawColor(...brandColor);
      doc.setLineWidth(0.5);
      doc.line(20, 58, pageWidth - 20, 58);

      // === Datos del comprobante ===
      doc.setTextColor(...darkGray);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Comprobante de Pago", 20, 74);

      const infoY = 86;
      const col1X = 20;
      const col2X = 105;

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("N° de Comprobante:", col1X, infoY);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...midGray);
      doc.text(`PAG-${String(transaction.id_pago).padStart(6, "0")}`, col1X + 45, infoY);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(...darkGray);
      doc.text("N° de Reserva:", col2X, infoY);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...midGray);
      doc.text(`#${transaction.id_reserva}`, col2X + 35, infoY);

      // === Línea separadora ===
      doc.setDrawColor(220, 225, 235);
      doc.setLineWidth(0.3);
      doc.line(20, infoY + 8, pageWidth - 20, infoY + 8);

      // === Detalles del pago ===
      const detailsStartY = infoY + 18;
      doc.setFillColor(...lightGray);
      doc.rect(20, detailsStartY, pageWidth - 40, 6, "F");

      doc.setTextColor(...darkGray);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Detalle del Pago", 20, detailsStartY + 4);

      autoTable(doc, {
        startY: detailsStartY + 10,
        tableLineColor: [220, 225, 235],
        tableLineWidth: 0.3,
        head: [],
        body: [
          ["Cliente", transaction.cliente],
          ["Vehículo / Propietario", transaction.vehiculo],
          ["Fecha de Pago", transaction.fecha],
          ["Monto Total", `$ ${transaction.monto.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`],
        ],
        theme: "plain",
        styles: { fontSize: 10, cellPadding: 2.5 },
        columnStyles: {
          0: { fontStyle: "bold", textColor: [90, 100, 120], cellWidth: 50 },
          1: { textColor: [15, 17, 23], cellWidth: "auto" },
        },
        bodyStyles: { minCellHeight: 8 },
      });

      // === Monto destacado ===
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFillColor(232, 248, 238);
      doc.rect(20, finalY, pageWidth - 40, 14, "F");

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...brandColor);
      doc.text("Total Pagado:", 20, finalY + 9);

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(`$ ${transaction.monto.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`, pageWidth - 20, finalY + 9, { align: "right" });

      // === Footer ===
      const footerY = doc.internal.pageSize.getHeight() - 30;
      doc.setDrawColor(220, 225, 235);
      doc.setLineWidth(0.3);
      doc.line(20, footerY, pageWidth - 20, footerY);

      doc.setFontSize(8);
      doc.setTextColor(...midGray);
      doc.setFont("helvetica", "normal");
      doc.text("AlquilAutos — Plataforma de alquiler de vehículos entre particulares", pageWidth / 2, footerY + 8, { align: "center" });
      doc.text(`Comprobante PAG-${String(transaction.id_pago).padStart(6, "0")} generado el ${new Date().toLocaleDateString("es-AR")}`, pageWidth / 2, footerY + 14, { align: "center" });

      doc.save(`comprobante_PAG-${String(transaction.id_pago).padStart(6, "0")}.pdf`);
    } catch (error) {
      console.error("Error al generar comprobante:", error);
      alert("No se pudo generar el comprobante.");
    }
  };

  return (
    <button
      onClick={handleDownload}
      title="Descargar comprobante"
      className="flex items-center justify-center w-7 h-7 rounded-full cursor-pointer bg-brand-light text-brand border border-brand/20 transition-colors hover:brightness-95"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    </button>
  );
}
