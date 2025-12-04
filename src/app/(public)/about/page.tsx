import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="py-24 container text-center max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
          We Connect People <br /> Through <span className="text-primary">Stories</span>
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          Vistara is a platform that empowers locals to share their culture and travelers to experience the world authentically.
        </p>
      </section>

      {/* Image Grid */}
      <section className="container mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[500px] rounded-3xl overflow-hidden">
          <div className="relative h-full bg-slate-200">
            <Image src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=2070&auto=format&fit=crop" alt="Travel" fill className="object-cover" />
          </div>
          <div className="relative h-full bg-slate-200 md:col-span-2">
            <Image src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=2070&auto=format&fit=crop" alt="Team" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-slate-50">
        <div className="container grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-900">Our Mission</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              We believe that the best way to see a place is through the eyes of someone who calls it home. Our mission is to democratize travel guiding, allowing anyone with passion and knowledge to become a guide.
            </p>
            <p className="text-slate-600 text-lg leading-relaxed">
              By connecting travelers directly with locals, we create more authentic experiences and keep tourism revenue within local communities.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-slate-500">Local Guides</div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="text-4xl font-bold text-primary mb-2">12k+</div>
              <div className="text-slate-500">Happy Travelers</div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center col-span-2">
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-slate-500">Cities Covered</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}