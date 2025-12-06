"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Eye, MapPin, MoreVertical, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/components/providers/LanguageProvider"; // ✅ Language Support

interface Listing {
  id: string;
  title: string;
  city: string;
  country: string;
  tourFee: number;
  images: string[];
  isActive: boolean;
  createdAt: Date | string; // Handle date string serialization
}

export default function ListingsClient({ initialListings }: { initialListings: Listing[] }) {
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const { t, lang } = useLanguage(); // Language Hook

  // Delete Handler
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    const toastId = toast.loading("Deleting listing...");

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`/api/v1/listings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Listing deleted", { id: toastId });
        setListings(listings.filter((item) => item.id !== id));
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            {lang === 'en' ? 'My Listings' : 'আমার লিস্টিং'}
          </h2>
          <p className="text-muted-foreground mt-1">
            {lang === 'en' ? 'Manage your tour packages.' : 'আপনার ট্যুর প্যাকেজ ম্যানেজ করুন।'}
          </p>
        </div>
        <Link href="/dashboard/listings/create">
          <Button className="shadow-lg shadow-primary/20 gap-2">
            <Plus className="h-4 w-4" /> 
            {lang === 'en' ? 'Create Listing' : 'নতুন ট্যুর যোগ করুন'}
          </Button>
        </Link>
      </div>

      {listings.length === 0 ? (
        <Card className="border-dashed border-2">
           <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground mb-4">No listings found.</p>
              <Link href="/dashboard/listings/create">
                 <Button variant="outline">Create your first tour</Button>
              </Link>
           </CardContent>
        </Card>
      ) : (
        <>
          {/* ✅ DESKTOP VIEW (Table) */}
          <div className="hidden md:block">
            <Card className="shadow-sm border-slate-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead className="pl-6">Tour Details</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listings.map((listing) => (
                    <TableRow key={listing.id} className="group hover:bg-slate-50/30">
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative h-14 w-20 rounded-md overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                            <Image src={listing.images[0] || "/placeholder.jpg"} alt={listing.title} fill className="object-cover" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 line-clamp-1 max-w-[180px]" title={listing.title}>{listing.title}</p>
                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                               <Calendar className="h-3 w-3" /> {new Date(listing.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                         <div className="flex items-center gap-1 text-sm text-slate-600">
                           <MapPin className="h-3.5 w-3.5 text-slate-400" /> {listing.city}
                         </div>
                      </TableCell>
                      <TableCell><span className="font-bold text-slate-900">৳{listing.tourFee}</span></TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${listing.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {listing.isActive ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                         <ActionButtons id={listing.id} onDelete={() => handleDelete(listing.id)} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>

          {/* ✅ MOBILE VIEW (Cards) */}
          <div className="md:hidden grid gap-4">
             {listings.map((listing) => (
                <Card key={listing.id} className="overflow-hidden shadow-sm border-slate-200">
                   <div className="flex gap-4 p-4">
                      {/* Image */}
                      <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                         <Image src={listing.images[0] || "/placeholder.jpg"} alt={listing.title} fill className="object-cover" />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                         <div>
                            <div className="flex justify-between items-start">
                               <h3 className="font-bold text-slate-900 line-clamp-1 text-sm">{listing.title}</h3>
                               <DropdownMenu>
                                  <DropdownMenuTrigger><MoreVertical className="h-4 w-4 text-slate-400" /></DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                     <DropdownMenuItem asChild><Link href={`/tours/${listing.id}`}>View</Link></DropdownMenuItem>
                                     <DropdownMenuItem asChild><Link href={`/dashboard/listings/${listing.id}/edit`}>Edit</Link></DropdownMenuItem>
                                     <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(listing.id)}>Delete</DropdownMenuItem>
                                  </DropdownMenuContent>
                               </DropdownMenu>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                               <MapPin className="h-3 w-3" /> {listing.city}, {listing.country}
                            </p>
                         </div>
                         
                         <div className="flex justify-between items-center mt-3">
                            <span className="font-bold text-primary text-sm">৳{listing.tourFee}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${listing.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
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

// Sub-component for Action Buttons (Desktop)
const ActionButtons = ({ id, onDelete }: { id: string, onDelete: () => void }) => (
  <div className="flex items-center justify-end gap-2">
    <Link href={`/tours/${id}`}>
      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-primary"><Eye className="h-4 w-4" /></Button>
    </Link>
    <Link href={`/dashboard/listings/${id}/edit`}>
      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600"><Edit className="h-4 w-4" /></Button>
    </Link>
    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={onDelete}>
      <Trash2 className="h-4 w-4" />
    </Button>
  </div>
);