-- CreateTable
CREATE TABLE "Pago" (
    "id_pago" SERIAL NOT NULL,
    "id_reserva" TEXT NOT NULL,
    "id_alquilador" TEXT NOT NULL,
    "id_propietario" TEXT NOT NULL,
    "monto_pagar" DOUBLE PRECISION NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" TEXT NOT NULL DEFAULT 'Coordinado',
    "link_pago" TEXT,

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("id_pago")
);

-- CreateTable
CREATE TABLE "HistorialEstadoPago" (
    "id_historial_estado_pago" SERIAL NOT NULL,
    "id_pago" INTEGER NOT NULL,
    "estado" TEXT NOT NULL,
    "fecha_hora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "descripcion" TEXT,

    CONSTRAINT "HistorialEstadoPago_pkey" PRIMARY KEY ("id_historial_estado_pago")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pago_id_reserva_key" ON "Pago"("id_reserva");

-- AddForeignKey
ALTER TABLE "HistorialEstadoPago" ADD CONSTRAINT "HistorialEstadoPago_id_pago_fkey" FOREIGN KEY ("id_pago") REFERENCES "Pago"("id_pago") ON DELETE RESTRICT ON UPDATE CASCADE;
