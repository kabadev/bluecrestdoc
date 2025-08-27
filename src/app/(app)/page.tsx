import { Suspense } from "react";
import { getDashboardStats } from "@/actions/stats";

import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";

export const metadata: Metadata = {
  title: "Dashboard | MOJ  System",
  description:
    "Document management system dashboard with file and letter statistics",
};

export default async function DashboardPage() {
  // Fetch dashboard statistics using server action
  const statsdata = await getDashboardStats();
  const stats = JSON.parse(JSON.stringify(statsdata));
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <Suspense fallback={<DashboardSkeleton />}>
        <Dashboard
          fileStats={stats.fileStats}
          letterStats={stats.letterStats}
        />
      </Suspense>
    </div>
  );
}
