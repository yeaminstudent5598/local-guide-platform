"use client";
import { motion } from "framer-motion";
import { Users, Map, ShieldCheck, Star } from "lucide-react";

const stats = [
  { icon: Users, label: "Happy Travelers", value: "12,000+" },
  { icon: Map, label: "Tours Completed", value: "850+" },
  { icon: ShieldCheck, label: "Verified Guides", value: "120+" },
  { icon: Star, label: "Average Rating", value: "4.9/5" },
];

export default function Stats() {
  return (
    <section className="py-20 bg-slate-950 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-center space-y-3"
            >
              <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <stat.icon className="h-6 w-6 text-emerald-500" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{stat.value}</h3>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}