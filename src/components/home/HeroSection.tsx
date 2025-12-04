"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar, Users, Map as MapIcon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const HeroSection = () => {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState<Date>();
  const [guests, setGuests] = useState("1");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.append("city", destination);
    router.push(`/explore?${params.toString()}`);
  };

  return (
    <section className="relative h-[650px] flex items-center justify-center">
      {/* Background Image with Gradient Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-slate-50/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 container px-4">
        
        {/* Headline */}
        <div className="text-center mb-10 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-md">
            Let's Explore The World <br /> With <span className="text-primary">Local Experts</span>
          </h1>
          <p className="text-lg text-slate-200 max-w-2xl mx-auto font-medium">
            Discover authentic experiences, hidden gems, and local culture.
          </p>
        </div>

        {/* ShareTrip Style Search Widget */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-5xl mx-auto animate-in zoom-in duration-500">
          
          {/* Tabs (Optional decorative) */}
          <div className="flex gap-6 mb-6 border-b pb-4">
            <button className="flex items-center gap-2 text-primary font-bold border-b-2 border-primary pb-4 -mb-4.5">
              <MapIcon className="h-5 w-5" /> Tours
            </button>
            <button className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium pb-4 -mb-4">
              <Users className="h-5 w-5" /> Guides
            </button>
          </div>

          {/* Input Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            
            {/* Destination Input */}
            <div className="md:col-span-4 space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Destination</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input 
                  placeholder="Where do you want to go?" 
                  className="pl-10 h-12 text-lg border-slate-200 focus:border-primary bg-slate-50/50"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
            </div>

            {/* Date Picker */}
            <div className="md:col-span-3 space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full h-12 justify-start text-left font-normal border-slate-200 bg-slate-50/50",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-5 w-5 text-slate-400" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Guests Input */}
            <div className="md:col-span-3 space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Travelers</label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input 
                  type="number" 
                  min={1} 
                  placeholder="1 Person" 
                  className="pl-10 h-12 text-lg border-slate-200 focus:border-primary bg-slate-50/50"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="md:col-span-2">
              <Button 
                size="lg" 
                className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all"
                onClick={handleSearch}
              >
                <Search className="mr-2 h-5 w-5" /> Search
              </Button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;