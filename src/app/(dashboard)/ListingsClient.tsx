"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Eye, MapPin, MoreVertical, Calendar, Sparkles, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";

interface Listing {
  id: string;
  title: string;
  city: string;
  country: string;
  tourFee: number;
  images: string[];
  isActive: boolean;
  createdAt: Date | string;
}

export default function ListingsClient({ initialListings }: { initialListings: Listing[] }) {
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [loading, setLoading] = useState(true); // ✅ Loading State for Skeleton
  const { lang } = useLanguage();

  // --- 🔄 Simulation for Skeleton Loader [Requirement 10] ---
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Admin Action: Are you sure you want to permanently delete this tour?")) return;
    const toastId = toast.loading("Processing deletion...");

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`/api/v1/listings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Listing removed from Vistara", { id: toastId });
        setListings(listings.filter((item) => item.id !== id));
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    }
  };

  // ✅ Show Skeleton Loader while loading [Requirement 10]
  if (loading) return <ListingsSkeleton />;

  return (
    <div className="space-y-8 p-4 md:p-8 bg-[#F8FAFB] min-h-screen animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-slate-100 pb-8">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-[0.3em] mb-1">
               <Sparkles className="h-3 w-3" /> Content Management
          </div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900">
            {lang === 'en' ? 'My Listings' : 'আমার লিস্টিং'}
          </h2>
          <p className="text-slate-500 font-medium italic mt-1">
            {lang === 'en' ? 'Review and manage your curated tour packages.' : 'আপনার সাজানো ট্যুর প্যাকেজগুলো পরিচালনা করুন।'}
          </p>
        </div>
        <Link href="/dashboard/listings/create">
          <Button className="h-14 px-8 rounded-2xl bg-slate-900 hover:bg-emerald-600 text-white font-bold transition-all shadow-xl shadow-slate-200 border-none group">
            <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform" /> 
            {lang === 'en' ? 'Create Listing' : 'নতুন ট্যুর যোগ করুন'}
          </Button>
        </Link>
      </div>

      {listings.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-200 bg-white/50 rounded-[2.5rem]">
           <CardContent className="flex flex-col items-center justify-center py-24 text-center">
              <div className="bg-white p-6 rounded-full shadow-sm mb-4">
                 <Search className="h-10 w-10 text-slate-200" />
              </div>
              <p className="text-slate-500 font-bold mb-6">No tour packages found in your registry.</p>
              <Link href="/dashboard/listings/create">
                 <Button variant="outline" className="rounded-xl border-slate-200 font-bold">Create your first tour</Button>
              </Link>
           </CardContent>
        </Card>
      ) : (
        <>
          {/* ✅ DESKTOP VIEW (Luxury Table) */}
          <div className="hidden md:block">
            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="hover:bg-transparent border-slate-50">
                    <TableHead className="pl-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Preview & Title</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pricing</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</TableHead>
                    <TableHead className="text-right pr-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Control</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listings.map((listing) => (
                    <TableRow key={listing.id} className="group hover:bg-slate-50/30 border-slate-50 transition-colors">
                      <TableCell className="pl-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="relative h-16 w-24 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm shrink-0 transition-transform group-hover:scale-105">
                            <Image src={listing.images[0] || "/placeholder.jpg"} alt={listing.title} fill className="object-cover" />
                          </div>
                          <div className="space-y-1">
                            <p className="font-bold text-slate-900 line-clamp-1 max-w-[220px]">{listing.title}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                               <Calendar className="h-3 w-3" /> {new Date(listing.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                         <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                           <MapPin className="h-3.5 w-3.5 text-emerald-500" /> {listing.city}
                         </div>
                      </TableCell>
                      <TableCell><span className="font-black text-slate-900">৳{listing.tourFee.toLocaleString()}</span></TableCell>
                      <TableCell>
                        <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border", 
                          listing.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'
                        )}>
                          {listing.isActive ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                         <ActionButtons id={listing.id} onDelete={() => handleDelete(listing.id)} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>

          {/* ✅ MOBILE VIEW (Luxury Cards) */}
          <div className="md:hidden grid gap-6">
             {listings.map((listing) => (
                <Card key={listing.id} className="overflow-hidden border-none shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white group">
                   <div className="flex gap-4 p-5">
                      <div className="relative h-24 w-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-50 shadow-sm">
                         <Image src={listing.images[0] || "/placeholder.jpg"} alt={listing.title} fill className="object-cover" />
                      </div>
                      
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                         <div>
                            <div className="flex justify-between items-start">
                               <h3 className="font-bold text-slate-900 line-clamp-1 text-sm">{listing.title}</h3>
                               <DropdownMenu>
                                  <DropdownMenuTrigger className="p-1 hover:bg-slate-50 rounded-lg transition-colors"><MoreVertical className="h-4 w-4 text-slate-400" /></DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="rounded-xl border-slate-100 shadow-xl">
                                     <DropdownMenuItem className="font-bold text-xs" asChild><Link href={`/tours/${listing.id}`}>View Tour</Link></DropdownMenuItem>
                                     <DropdownMenuItem className="font-bold text-xs" asChild><Link href={`/dashboard/listings/${listing.id}/edit`}>Modify</Link></DropdownMenuItem>
                                     <DropdownMenuItem className="font-bold text-xs text-rose-600" onClick={() => handleDelete(listing.id)}>Remove</DropdownMenuItem>
                                  </DropdownMenuContent>
                               </DropdownMenu>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-1 uppercase tracking-tighter">
                               <MapPin className="h-3 w-3 text-emerald-500" /> {listing.city}, {listing.country}
                            </p>
                         </div>
                         
                         <div className="flex justify-between items-center mt-4 pt-2 border-t border-slate-50">
                            <span className="font-black text-emerald-600 text-sm">৳{listing.tourFee}</span>
                            <span className={cn("text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter", 
                               listing.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700')}>
                               {listing.isActive ? "Active" : "Inactive"}
                            </span>
                         </div>
                      </div>
                   </div>
                </Card>
             ))}
          </div>
        </>
      )}
    </div>
  );
}

// Action Buttons Component
const ActionButtons = ({ id, onDelete }: { id: string, onDelete: () => void }) => (
  <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
    <Link href={`/tours/${id}`}>
      <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-slate-200 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-100 transition-all"><Eye className="h-4 w-4" /></Button>
    </Link>
    <Link href={`/dashboard/listings/${id}/edit`}>
      <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-slate-200 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100 transition-all"><Edit className="h-4 w-4" /></Button>
    </Link>
    <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-slate-200 text-rose-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all" onClick={onDelete}>
      <Trash2 className="h-4 w-4" />
    </Button>
  </div>
);

// --- 🦴 Requirement 10: Skeleton Component ---
function ListingsSkeleton() {
  return (
    <div className="p-8 md:p-12 space-y-12 animate-pulse bg-slate-50 min-h-screen max-w-7xl mx-auto">
      <div className="flex justify-between items-center border-b border-slate-100 pb-8">
        <div className="space-y-3"><div className="h-10 w-64 bg-slate-200 rounded-xl" /><div className="h-4 w-48 bg-slate-200 rounded-lg" /></div>
        <div className="h-14 w-40 bg-slate-200 rounded-2xl" />
      </div>
      <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden">
        <div className="h-20 bg-white border-b border-slate-50" />
        <div className="p-0">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-8 border-b border-slate-50 bg-white">
              <div className="flex gap-4 items-center">
                  <div className="h-16 w-24 rounded-2xl bg-slate-100" />
                  <div className="space-y-2"><div className="h-4 w-40 bg-slate-100 rounded" /><div className="h-3 w-20 bg-slate-50 rounded" /></div>
              </div>
              <div className="h-4 w-32 bg-slate-50 rounded" />
              <div className="h-4 w-16 bg-slate-50 rounded" />
              <div className="h-6 w-20 bg-slate-50 rounded-full" />
              <div className="flex gap-2"><div className="h-9 w-9 bg-slate-100 rounded-xl" /><div className="h-9 w-9 bg-slate-100 rounded-xl" /></div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}