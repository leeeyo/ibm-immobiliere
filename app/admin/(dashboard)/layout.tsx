import { redirect } from "next/navigation";
import { isAuthenticated, getSession } from "@/lib/auth/session";
import AdminShell from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAuthenticated())) redirect("/admin/login");
  const session = await getSession();
  return (
    <AdminShell user={{ email: session.email!, name: session.name }}>
      {children}
    </AdminShell>
  );
}
