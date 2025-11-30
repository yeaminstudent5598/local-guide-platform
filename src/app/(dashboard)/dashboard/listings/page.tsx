"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash, Eye, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

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
        // TODO: In real app, filter by Guide ID (?guideId=...)
        const res = await fetch("/api/v1/listings"); 
        const data = await res.json();
        
        if (data.success) {
          setListings(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch listings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Delete Handler
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`/api/v1/listings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        toast.success("Listing deleted successfully");
        setListings(listings.filter((item) => item.id !== id));
      } else {
        toast.error("Failed to delete listing");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading your listings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Listings</h2>
          <p className="text-muted-foreground">
            Manage your tour packages and availability.
          </p>
        </div>
        <Link href="/dashboard/listings/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create New Listing
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Tours ({listings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No listings found. Create your first tour!
                  </TableCell>
                </TableRow>
              ) : (
                listings.map((listing) => (
                  <TableRow key={listing.id}>
                    <TableCell>
                      <div className="relative h-12 w-20 rounded overflow-hidden">
                        <Image
                          src={listing.images[0] || "/placeholder.jpg"}
                          alt={listing.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{listing.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {listing.city}, {listing.country}
                      </div>
                    </TableCell>
                    <TableCell>BDT {listing.tourFee}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${listing.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {listing.isActive ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/tours/${listing.id}`}>
                          <Button variant="ghost" size="icon" title="View">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/dashboard/listings/${listing.id}/edit`}>
                          <Button variant="ghost" size="icon" title="Edit">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDelete(listing.id)}
                          title="Delete"
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