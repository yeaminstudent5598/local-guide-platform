import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, DollarSign, Users, Star, Activity } from "lucide-react";

export default function DashboardPage() {
  // ডামি ডাটা (পরে API দিয়ে রিপ্লেস হবে)
  const stats = [
    { 
      title: "Total Earnings", 
      value: "৳ 15,230", 
      icon: DollarSign, 
      desc: "+20.1% from last month" 
    },
    { 
      title: "Active Bookings", 
      value: "12", 
      icon: CalendarDays, 
      desc: "+2 upcoming trips" 
    },
    { 
      title: "Total Tourists", 
      value: "573", 
      icon: Users, 
      desc: "+19 new this week" 
    },
    { 
      title: "Average Rating", 
      value: "4.8", 
      icon: Star, 
      desc: "Based on 120 reviews" 
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.title}
              </CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <p className="text-xs text-muted-foreground">
                {item.desc}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity Section Placeholder */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
             <div className="h-[200px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                Chart will appear here
             </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               {[1, 2, 3].map((_, i) => (
                 <div key={i} className="flex items-center">
                    <Activity className="mr-2 h-4 w-4 text-primary" />
                    <div className="ml-2 space-y-1">
                      <p className="text-sm font-medium leading-none">New booking received</p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </div>
                 </div>
               ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}