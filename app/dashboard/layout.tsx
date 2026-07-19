import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Heart, LayoutDashboard, Calendar, Users, Palette, BarChart3, Settings, User } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";
import { Toaster } from "sonner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { user } = session;
  const plan = (user as any).plan || "free";

  return (
    <div className="min-h-screen bg-[#120F0F] text-[#F3EFEA] font-sans w-full">
      <Toaster position="top-right" richColors />
      {children}
    </div>
  );
}
