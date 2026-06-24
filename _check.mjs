import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

try {
  const pagos = await prisma.pago.findMany({ take: 5, orderBy: { id_pago: 'desc' }, include: { HistorialEstadoPago: { orderBy: { fecha_hora: 'desc' }, take: 2 } } });
  console.log(JSON.stringify(pagos, null, 2));
} finally {
  await prisma.$disconnect();
}
