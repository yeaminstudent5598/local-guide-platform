"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Loader2, Trash2, ShieldCheck, UserCheck, Users, Sparkles, Search, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// --- Interfaces ---
interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "GUIDE" | "TOURIST";
  isVerified: boolean;
  createdAt: string;
  _count: {
    listings: number;
    bookingsAsTourist: number;
  };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const res = await fetch("/api/v1/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        
        if (data.success) {
          setUsers(data.data);
        } else {
          toast.error("Failed to load users");
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 2. Delete Handler
  const handleDelete = async (id: string) => {
    if(!confirm("Security Protocol: Are you sure you want to remove this user from the platform?")) return;
    
    try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`/api/v1/admin/users/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        
        if(res.ok) {
            toast.success("User successfully de-platformed");
            setUsers(users.filter(u => u.id !== id));
        }
    } catch (error) {
        toast.error("Authorization failed or server error");
    }
  };

  // --- 🎨 Premium Role Badges ---
  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      ADMIN: "bg-rose-100 text-rose-700 border-rose-200",
      GUIDE: "bg-blue-100 text-blue-700 border-blue-200",
      TOURIST: "bg-emerald-100 text-emerald-700 border-emerald-200",
    };

    return (
      <Badge variant="outline" className={cn("px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-tighter", styles[role] || "bg-slate-50")}>
        {role}
      </Badge>
    );
  };

  // --- 🦴 Requirement 10: Skeleton Loader ---
  if (loading) return <UsersTableSkeleton />;

  return (
    <div className="flex-1 space-y-8 p-6 md:p-10 pt-6 max-w-7xl mx-auto bg-[#F8FAFB] min-h-screen font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-[0.3em] mb-1">
             <Sparkles className="h-3 w-3" /> Identity Management
          </div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900">User <span className="text-emerald-600 italic font-serif">Registry</span></h2>
          <p className="text-slate-500 text-sm font-medium italic">Manage permissions and oversee platform members.</p>
        </div>
        
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
            <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                <Users className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase text-slate-400">Verified Members</p>
                <p className="text-xl font-black text-slate-900 leading-none">{users.length}</p>
            </div>
        </div>
      </div>

      <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
        <CardHeader className="border-b border-slate-50 p-8">
           <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">Global Directory</CardTitle>
                <CardDescription>Authentication and role audit logs.</CardDescription>
              </div>
              <Badge variant="secondary" className="bg-slate-50 text-slate-500 border-none px-3 py-1 font-bold">
                  Admin Access Only
              </Badge>
           </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-slate-50">
                <TableHead className="py-5 pl-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Member Identity</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Access Level</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Contribution</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Join Date</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Auth Status</TableHead>
                <TableHead className="pr-8 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Control</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-24">
                    <div className="flex flex-col items-center gap-3 text-slate-300">
                        <Search className="h-12 w-12 opacity-20" />
                        <p className="font-bold text-sm">No users found in the system.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} className="group hover:bg-slate-50/50 transition-colors border-slate-50">
                    {/* User Info */}
                    <TableCell className="py-6 pl-8">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 border-2 border-slate-50 shadow-sm group-hover:scale-105 transition-transform">
                          <AvatarImage src={`https://ui-avatars.com/api/?name=${user.name}&background=10b981&color=fff&bold=true`} />
                          <AvatarFallback className="bg-slate-100 font-bold">{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors">{user.name}</span>
                          <span className="text-[11px] font-medium text-slate-400">{user.email}</span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Role */}
                    <TableCell>
                      {getRoleBadge(user.role)}
                    </TableCell>

                    {/* Stats */}
                    <TableCell>
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">
                        {user.role === "GUIDE" ? (
                          <span className="flex items-center gap-1"><Sparkles className="h-3 w-3 text-blue-500" /> {user._count?.listings || 0} Tours Hosted</span>
                        ) : (
                          <span className="flex items-center gap-1"><Fingerprint className="h-3 w-3 text-emerald-500" /> {user._count?.bookingsAsTourist || 0} Journeys</span>
                        )}
                      </div>
                    </TableCell>

                    {/* Joined Date */}
                    <TableCell className="text-xs font-bold text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                    </TableCell>

                    {/* Verification Status */}
                    <TableCell>
                      {user.isVerified ? (
                        <div className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-black uppercase">
                          <ShieldCheck className="h-3.5 w-3.5" /> Verified
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-amber-500 text-[10px] font-black uppercase">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Pending
                        </div>
                      )}
                    </TableCell>

                    {/* Action */}
                    <TableCell className="pr-8 text-right">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-9 w-9 rounded-xl border-slate-100 text-rose-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-all opacity-0 group-hover:opacity-100"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// --- 🦴 Requirement 10: Skeleton Component ---
function UsersTableSkeleton() {
  return (
    <div className="p-10 space-y-10 animate-pulse bg-slate-50 min-h-screen max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div className="space-y-3">
            <div className="h-4 w-32 bg-slate-200 rounded-lg" />
            <div className="h-10 w-64 bg-slate-200 rounded-xl" />
        </div>
        <div className="h-20 w-40 bg-white rounded-2xl shadow-sm" />
      </div>
      <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden">
        <div className="h-20 bg-white border-b border-slate-50" />
        <div className="p-0">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center justify-between p-8 border-b border-slate-50 bg-white">
              <div className="flex gap-4 items-center">
                  <div className="h-12 w-12 rounded-full bg-slate-100" />
                  <div className="space-y-2"><div className="h-4 w-32 bg-slate-100 rounded" /><div className="h-2 w-20 bg-slate-50 rounded" /></div>
              </div>
              <div className="h-8 w-24 bg-slate-50 rounded-full" />
              <div className="h-4 w-24 bg-slate-50 rounded" />
              <div className="h-4 w-20 bg-slate-50 rounded" />
              <div className="h-6 w-20 bg-slate-50 rounded-full" />
              <div className="h-9 w-9 bg-slate-100 rounded-xl" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}