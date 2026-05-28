import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getTransactions } from "./actions";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPanel() {
  const user = await currentUser();

  // Check authorization server-side
  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
  const role = user?.publicMetadata?.role;

  const adminEmailsEnv = process.env.NEXT_PUBLIC_ADMIN_EMAILS || process.env.ADMIN_EMAILS || "";
  const adminEmails = adminEmailsEnv
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const isAuthorized = role === "admin" || (email && adminEmails.includes(email));

  if (!user || !isAuthorized) {
    redirect("/");
  }

  const { transactions, stats } = await getTransactions();

  return <AdminDashboard transactions={transactions} stats={stats} />;
}