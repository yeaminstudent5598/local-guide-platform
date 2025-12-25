"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Trash, Eye, CheckCircle, XCircle, Sparkles, 
  Map as MapIcon, Image as ImageIcon, Search, Loader2 
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

// --- Interfaces ---
interface Listing {
  id: string;
  title: string;
  guide: { name: string; email: string };
  tourFee: number;
  images: string[];
  isActive: boolean;
}

export default function AdminListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch All Listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("/api/v1/listings"); 
        const data = await res.json();
        if (data.success) setListings(data.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch listings");
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  // 2. Delete Listing Handler
  const handleDelete = async (id: string) => {
    if (!confirm("Admin Action: Are you sure you want to permanently remove this listing?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`/api/v1/listings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast.success("Listing removed by Admin successfully");
        setListings(listings.filter((item) => item.id !== id));
      } else {
        toast.error("Unauthorized or failed to delete listing");
      }
    } catch (error) {
      toast.error("Network error! Try again later.");
    }
  };

  // --- 🦴 Requirement 10: Skeleton Loader ---
  if (loading) return <ListingsSkeleton />;

  return (
    <div className="flex-1 space-y-8 p-6 md:p-10 pt-6 max-w-7xl mx-auto bg-[#F8FAFB] min-h-screen font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-[0.3em] mb-1">
             <Sparkles className="h-3 w-3" /> Content Management
          </div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900">Manage <span className="text-emerald-600 italic font-serif">Listings</span></h2>
          <p className="text-slate-500 text-sm font-medium italic">Audit and moderate all tour packages across the platform.</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
            <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                <MapIcon className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase text-slate-400">Total Tours</p>
                <p className="text-xl font-black text-slate-900 leading-none">{listings.length}</p>
            </div>
        </div>
      </div>

      <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
        <CardHeader className="border-b border-slate-50 p-8">
           <CardTitle className="text-xl font-bold text-slate-900">Platform Tour Inventory</CardTitle>
           <CardDescription>Global database of all available tour listings.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-slate-50">
                <TableHead className="py-5 pl-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Preview</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tour Title</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Guide Provider</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tour Fee</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</TableHead>
                <TableHead className="pr-8 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-24 text-slate-300">
                    <div className="flex flex-col items-center gap-3">
                        <Search className="h-12 w-12 opacity-20" />
                        <p className="font-bold text-sm">No listings found on the platform.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                listings.map((listing) => (
                  <TableRow key={listing.id} className="group hover:bg-slate-50/50 transition-colors border-slate-50">
                    <TableCell className="pl-8 py-5">
                      <div className="relative h-14 w-20 rounded-xl overflow-hidden shadow-sm border border-slate-100 bg-slate-100 group-hover:scale-105 transition-transform">
                        <Image src={listing.images[0] || "/placeholder.jpg"} alt="img" fill className="object-cover" />
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-slate-800 text-sm max-w-[220px] truncate" title={listing.title}>
                      {listing.title}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-xs">{listing.guide?.name || "Anonymous"}</span>
                        <span className="text-[10px] font-medium text-slate-400">{listing.guide?.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-black text-slate-900">৳{listing.tourFee.toLocaleString()}</TableCell>
                    <TableCell>
                      {listing.isActive ? (
                        <div className="flex items-center text-emerald-600 text-[10px] font-black uppercase tracking-tighter bg-emerald-50 px-3 py-1 rounded-full w-fit border border-emerald-100">
                          <CheckCircle className="w-3 h-3 mr-1" /> Active
                        </div>
                      ) : (
                        <div className="flex items-center text-rose-600 text-[10px] font-black uppercase tracking-tighter bg-rose-50 px-3 py-1 rounded-full w-fit border border-rose-100">
                          <XCircle className="w-3 h-3 mr-1" /> Inactive
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="pr-8 text-right">
                      <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Link href={`/tours/${listing.id}`}>
                          <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-slate-200 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-9 w-9 rounded-xl border-slate-200 text-rose-500 hover:bg-rose-50 hover:border-rose-200 transition-colors"
                          onClick={() => handleDelete(listing.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
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
function ListingsSkeleton() {
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
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-8 border-b border-slate-50 bg-white">
              <div className="h-14 w-20 bg-slate-100 rounded-xl" />
              <div className="h-4 w-48 bg-slate-100 rounded-lg" />
              <div className="space-y-2"><div className="h-3 w-32 bg-slate-100 rounded" /><div className="h-2 w-20 bg-slate-50 rounded" /></div>
              <div className="h-4 w-16 bg-slate-100 rounded" />
              <div className="h-8 w-24 bg-slate-50 rounded-full" />
              <div className="flex gap-2"><div className="h-9 w-9 bg-slate-100 rounded-xl" /><div className="h-9 w-9 bg-slate-100 rounded-xl" /></div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}