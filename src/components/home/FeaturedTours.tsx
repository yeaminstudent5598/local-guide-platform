import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Dummy Data (Pore API call hobe)
const tours = [
  {
    id: 1,
    title: "Old Dhaka Heritage Walk",
    location: "Dhaka, Bangladesh",
    price: 1200,
    rating: 4.8,
    reviews: 124,
    duration: "1 Day",
    image: "https://images.unsplash.com/photo-1628065097495-23c347963283?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Sylhet Tea Garden Tour",
    location: "Sylhet, Bangladesh",
    price: 3500,
    rating: 4.9,
    reviews: 85,
    duration: "2 Days",
    image: "https://images.unsplash.com/photo-1600109923842-12e03940854d?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Saint Martin's Island Adventure",
    location: "Cox's Bazar",
    price: 5000,
    rating: 4.7,
    reviews: 200,
    duration: "3 Days",
    image: "https://images.unsplash.com/photo-1589981836691-11c504944d07?q=80&w=1000&auto=format&fit=crop"
  }
];

const FeaturedTours = () => {
  return (
    <section className="py-16 bg-slate-50">
      <div className="container">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Experiences</h2>
            <p className="text-muted-foreground">Top-rated tours loved by travelers.</p>
          </div>
          <Link href="/explore">
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour) => (
            <Card key={tour.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 w-full">
                <Image 
                  src={tour.image} 
                  alt={tour.title} 
                  fill 
                  className="object-cover"
                />
                <Badge className="absolute top-3 right-3 bg-white text-black hover:bg-white">
                  Featured
                </Badge>
              </div>
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg line-clamp-1">{tour.title}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{tour.rating}</span>
                  </div>
                </div>
                <div className="flex items-center text-muted-foreground text-sm gap-1">
                  <MapPin className="h-4 w-4" />
                  {tour.location}
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {tour.duration}
                  </div>
                  <div>
                    {tour.reviews} Reviews
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-lg font-bold text-primary">৳ {tour.price} <span className="text-sm font-normal text-muted-foreground">/ person</span></p>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full">View Details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedTours;