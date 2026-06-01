import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getTransactions } from "./actions";
import AdminDashboard from "./components/AdminDashboard";
import { isAdminUser } from "@/lib/admin";

export default async function AdminPanel() {
  const user = await currentUser();
  const isAuthorized = isAdminUser(user);

  if (!user) {
    redirect("/sign-in");
  }

  // Si no está autorizado, mostrar pantalla de acceso denegado en AdminDashboard
  if (!isAuthorized) {
    return <AdminDashboard transactions={[]} stats={{ totalVentas: 0, cantidadPagos: 0, pagosAprobados: 0 }} />;
  }

  const { transactions, stats } = await getTransactions();

  return <AdminDashboard transactions={transactions} stats={stats} />;
}