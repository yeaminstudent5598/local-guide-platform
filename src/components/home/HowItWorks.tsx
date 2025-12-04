import { Search, CalendarCheck, Map } from "lucide-react";

const HowItWorks = () => {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900">Plan Your Trip in 3 Steps</h2>
          <p className="text-slate-500 mt-3">Easy and fast booking process.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {[
            { icon: Search, title: "1. Search", desc: "Choose your destination and date." },
            { icon: CalendarCheck, title: "2. Book", desc: "Select a tour and confirm booking." },
            { icon: Map, title: "3. Enjoy", desc: "Meet your guide and explore." },
          ].map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                <step.icon className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-slate-500">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;