import Image from "next/image";
import Link from "next/link";

const destinations = [
  { id: 1, name: "Sylhet", count: "15+ Tours", image: "/images/demo1.jpg", size: "col-span-1 md:col-span-2 md:row-span-2 h-[400px]" },
  { id: 2, name: "Cox's Bazar", count: "24+ Tours", image: "/images/coxbazar.jpg", size: "col-span-1 h-[190px]" },
  { id: 3, name: "Bandarban", count: "10+ Tours", image: "/images/sreemongol.jpg", size: "col-span-1 h-[190px]" },
  { id: 4, name: "Sajek Valley", count: "8+ Tours", image: "/images/sajek.jpg", size: "col-span-1 md:col-span-2 h-[190px]" },
];

const PopularDestinations = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900">Popular Destinations</h2>
          <p className="text-slate-500 mt-2">Explore the most visited places by our community.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {destinations.map((dest) => (
            <Link 
              key={dest.id} 
              href={`/explore?city=${dest.name}`} 
              className={`group relative overflow-hidden rounded-2xl cursor-pointer ${dest.size}`}
            >
              <Image
                src={dest.image}
                alt={dest.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 text-white">
                <h3 className="text-2xl font-bold">{dest.name}</h3>
                <p className="text-sm text-slate-300 font-medium">{dest.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;