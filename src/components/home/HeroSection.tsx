import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative h-[600px] flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop")' }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-white max-w-4xl mx-auto leading-tight">
          Explore the World with <br />
          <span className="text-primary">Local Experts</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto">
          Discover hidden gems, authentic culture, and unforgettable experiences with verified local guides.
        </p>

        {/* Search Bar */}
        <div className="bg-white p-2 rounded-full shadow-xl max-w-2xl mx-auto flex items-center gap-2">
          <Search className="text-muted-foreground ml-3 h-5 w-5" />
          <Input 
            placeholder="Where do you want to go?" 
            className="border-none shadow-none focus-visible:ring-0 text-lg"
          />
          <Button size="lg" className="rounded-full px-8">
            Search
          </Button>
        </div>

        <div className="pt-4">
          <span className="text-slate-300 text-sm mr-2">Popular:</span>
          <div className="inline-flex gap-2">
            {["Dhaka", "Sylhet", "Cox's Bazar", "Bandarban"].map(city => (
              <Link key={city} href={`/explore?city=${city}`} className="text-white hover:underline text-sm font-medium">
                {city}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;