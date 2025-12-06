"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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

        // ✅ FIX: URL updated to match your folder structure (/api/v1/admin/users)
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

  // Delete Handler (Optional)
  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure?")) return;
    
    try {
        const token = localStorage.getItem("accessToken");
        // Assuming you created DELETE route at /api/v1/admin/users/[id]
        const res = await fetch(`/api/v1/admin/users/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        
        if(res.ok) {
            toast.success("User deleted");
            setUsers(users.filter(u => u.id !== id));
        }
    } catch (error) {
        toast.error("Failed to delete");
    }
  };

  // Role Color Helper
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN": return <Badge variant="destructive">Admin</Badge>;
      case "GUIDE": return <Badge className="bg-blue-500 hover:bg-blue-600">Guide</Badge>;
      default: return <Badge variant="secondary">Tourist</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manage Users</h2>
          <p className="text-muted-foreground">List of all registered users on the platform.</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-1 bg-white">
          Total: {users.length}
        </Badge>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle>User Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Stats</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                 <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No users found.
                    </TableCell>
                 </TableRow>
              ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border border-slate-200">
                            <AvatarImage src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">{user.name}</span>
                            <span className="text-xs text-muted-foreground">{user.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>
                        <div className="text-xs text-muted-foreground font-medium">
                          {user.role === "GUIDE" ? (
                            <span>{user._count?.listings || 0} Listings</span>
                          ) : (
                            <span>{user._count?.bookingsAsTourist || 0} Bookings</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                          {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {user.isVerified ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            Unverified
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
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