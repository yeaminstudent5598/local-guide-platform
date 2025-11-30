import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar (Hidden on mobile, visible on desktop) */}
      <aside className="hidden w-64 md:flex flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col h-full overflow-y-auto">
        {/* Optional: Add a Dashboard Header here for Mobile Menu Trigger */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}