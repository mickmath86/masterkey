import DashboardSidebar from "@/components/marketpulse/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#FAFAF8]">
      <DashboardSidebar />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
