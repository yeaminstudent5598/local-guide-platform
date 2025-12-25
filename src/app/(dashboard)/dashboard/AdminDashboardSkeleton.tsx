import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function AdminDashboardSkeleton() {

    if (loading) {
    return <AdminDashboardSkeleton />; // ✅ রিকোয়ারমেন্ট ১০ অনুযায়ী স্কেলিটন লোডার
  }
  return (
    <div className="flex-1 space-y-8 p-6 md:p-8 pt-6 max-w-7xl mx-auto bg-slate-50/50 min-h-screen animate-pulse">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-slate-200 rounded-lg" />
          <div className="h-4 w-64 bg-slate-200 rounded-lg" />
        </div>
        <div className="h-10 w-24 bg-slate-200 rounded-lg" />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-slate-200 rounded" />
              <div className="h-9 w-9 bg-slate-100 rounded-lg" />
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="h-8 w-24 bg-slate-200 rounded" />
              <div className="h-4 w-16 bg-slate-100 rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4 border-slate-200 h-[450px]">
           <CardHeader className="h-20 bg-slate-100" />
           <CardContent className="h-full bg-slate-50/50" />
        </Card>
        <Card className="col-span-1 lg:col-span-3 border-slate-200 h-[450px]">
           <CardHeader className="h-20 bg-slate-100" />
           <CardContent className="space-y-4 p-4">
              {[1, 2, 3, 4, 5].map((j) => (
                <div key={j} className="flex items-center gap-4">
                   <div className="h-10 w-10 rounded-full bg-slate-200" />
                   <div className="space-y-2 flex-1">
                      <div className="h-4 w-full bg-slate-200 rounded" />
                      <div className="h-3 w-1/2 bg-slate-100 rounded" />
                   </div>
                </div>
              ))}
           </CardContent>
        </Card>
      </div>
    </div>
  );
}