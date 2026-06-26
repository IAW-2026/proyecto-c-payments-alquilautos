import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getTransactions } from "./actions";
import AdminDashboard from "./components/AdminDashboard";
import AdminGuard from "./components/AdminGuard";
import { isAdminUser } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminPanel() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const isAuthorized = isAdminUser(user);
  const { transactions, stats } = isAuthorized
    ? await getTransactions()
    : { transactions: [], stats: { totalVentas: 0, cantidadPagos: 0, pagosAprobados: 0 } };

  return (
    <AdminGuard>
      <AdminDashboard transactions={transactions} stats={stats} />
    </AdminGuard>
  );
}
