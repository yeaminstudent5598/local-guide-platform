import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from "lucide-react";
import Link from "next/link";

const guides = [
  { id: 1, name: "Rahim Ahmed", location: "Dhaka", rating: 4.9, reviews: 120, expertise: "History", image: "/images/men1.jpg" },
  { id: 2, name: "Sarah Kabir", location: "Sylhet", rating: 5.0, reviews: 85, expertise: "Nature", image: "/images/men3.jpg" },
  { id: 3, name: "Tanvir Hasan", location: "Bandarban", rating: 4.8, reviews: 200, expertise: "Adventure", image: "/images/men2.jpg" },
];

const TopGuides = () => {
  return (
    <section className="py-16 bg-slate-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Top Rated Guides</h2>
          <p className="text-muted-foreground">Meet the locals who know their cities best.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {guides.map((guide) => (
            <Link key={guide.id} href={`/guides/${guide.id}`}>
              <Card className="hover:shadow-lg transition-all text-center p-6 border-slate-100">
                <CardContent className="pt-4 flex flex-col items-center">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-sm">
                      <AvatarImage src={guide.image} />
                      <AvatarFallback>{guide.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Badge className="absolute -bottom-2 -right-2 bg-yellow-400 text-black hover:bg-yellow-500">
                      <Star className="h-3 w-3 mr-1 fill-black" /> {guide.rating}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-bold mt-4">{guide.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" /> {guide.location}
                  </p>
                  
                  <div className="mt-4 flex gap-2 justify-center">
                    <Badge variant="secondary">{guide.expertise}</Badge>
                    <Badge variant="outline">{guide.reviews} Reviews</Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopGuides;