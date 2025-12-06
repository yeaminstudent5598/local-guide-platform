"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Eye, MapPin, Loader2, MoreVertical } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Listing {
  id: string;
  title: string;
  city: string;
  country: string;
  tourFee: number;
  images: string[];
  isActive: boolean;
  createdAt: string;
}

export default function MyListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        // API Call (Backend automatically filters by guideId)
        const res = await fetch("/api/v1/listings?myListings=true", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const data = await res.json();
        
        if (data.success) {
          // Filter manually if API returns all (Backup safety)
          // Assuming backend handles it, but filtering by ownership is safer on client too if needed
          // For now using direct data
          setListings(data.data);
        } else {
          toast.error("Failed to load listings");
        }
      } catch (error) {
        console.error("Failed to fetch listings", error);
        toast.error("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Delete Handler
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing? This action cannot be undone.")) return;

    const toastId = toast.loading("Deleting listing...");

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`/api/v1/listings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Listing deleted successfully", { id: toastId });
        setListings(listings.filter((item) => item.id !== id));
      } else {
        throw new Error(data.message || "Failed to delete");
      }
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center flex-col gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Loading your tours...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-2 md:p-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">My Listings</h2>
          <p className="text-muted-foreground mt-1">
            Manage your tour packages, pricing, and availability.
          </p>
        </div>
        <Link href="/dashboard/listings/create">
          <Button className="shadow-lg shadow-primary/20">
            <Plus className="mr-2 h-4 w-4" /> Create New Listing
          </Button>
        </Link>
      </div>

      {/* Listings Table */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle>Active Tours ({listings.length})</CardTitle>
          <CardDescription>List of all tours you are currently hosting.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="pl-6">Tour Details</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p>No listings found.</p>
                      <Link href="/dashboard/listings/create">
                         <Button variant="link" className="text-primary">Create your first tour</Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                listings.map((listing) => (
                  <TableRow key={listing.id} className="group">
                    
                    {/* Image & Title */}
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-24 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                          <Image
                            src={listing.images[0] || "/placeholder.jpg"}
                            alt={listing.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                           <p className="font-semibold text-slate-900 line-clamp-1 max-w-[200px]" title={listing.title}>
                             {listing.title}
                           </p>
                           <p className="text-xs text-slate-500 mt-1">
                             Created on {new Date(listing.createdAt).toLocaleDateString()}
                           </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Location */}
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span>{listing.city}, {listing.country}</span>
                      </div>
                    </TableCell>

                    {/* Price */}
                    <TableCell>
                       <span className="font-bold text-slate-900">৳{listing.tourFee}</span>
                       <span className="text-xs text-slate-500"> / person</span>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        listing.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        {listing.isActive ? "Active" : "Inactive"}
                      </span>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/tours/${listing.id}`}>
                          <Button variant="ghost" size="icon" title="View" className="h-8 w-8 text-slate-500 hover:text-primary">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/dashboard/listings/${listing.id}/edit`}>
                          <Button variant="ghost" size="icon" title="Edit" className="h-8 w-8 text-slate-500 hover:text-blue-600">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                             <DropdownMenuItem 
                                className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                onClick={() => handleDelete(listing.id)}
                             >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Listing
                             </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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