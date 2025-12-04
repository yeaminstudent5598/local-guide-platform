"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash, Eye, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

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
        const res = await fetch("/api/v1/listings"); // All listings API
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
    if (!confirm("Admin Action: Are you sure you want to delete this listing?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`/api/v1/listings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast.success("Listing removed by Admin");
        setListings(listings.filter((item) => item.id !== id));
      } else {
        toast.error("Failed to delete listing");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Admin Panel...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Manage Listings</h2>
        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
          Total: {listings.length}
        </span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Platform Tours</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Guide Info</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No listings found on the platform.
                  </TableCell>
                </TableRow>
              ) : (
                listings.map((listing) => (
                  <TableRow key={listing.id}>
                    <TableCell>
                      <div className="relative h-12 w-20 rounded overflow-hidden border">
                        <Image src={listing.images[0] || "/placeholder.jpg"} alt="img" fill className="object-cover" />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate" title={listing.title}>
                      {listing.title}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{listing.guide?.name || "Unknown"}</span>
                        <span className="text-xs text-muted-foreground">{listing.guide?.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>৳ {listing.tourFee}</TableCell>
                    <TableCell>
                      {listing.isActive ? (
                        <div className="flex items-center text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded w-fit">
                          <CheckCircle className="w-3 h-3 mr-1" /> Active
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600 text-xs font-medium bg-red-50 px-2 py-1 rounded w-fit">
                          <XCircle className="w-3 h-3 mr-1" /> Inactive
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/tours/${listing.id}`}>
                          <Button variant="ghost" size="icon" title="View Details">
                            <Eye className="h-4 w-4 text-slate-500" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="hover:bg-red-50"
                          onClick={() => handleDelete(listing.id)}
                          title="Delete Listing"
                        >
                          <Trash className="h-4 w-4 text-red-500" />
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