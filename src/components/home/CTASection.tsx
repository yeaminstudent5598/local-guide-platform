import { Button } from "@/components/ui/button";
import Link from "next/link";

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-primary">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

      <div className="container relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
          Ready to Explore Like a Local?
        </h2>
        <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto">
          Join thousands of travelers who are discovering the hidden gems of Bangladesh with Vistara.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/explore">
            <Button size="lg" className="bg-white text-primary hover:bg-slate-100 h-14 px-8 text-lg font-bold rounded-full">
              Start Exploring
            </Button>
          </Link>
          <Link href="/register?role=GUIDE">
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/20 hover:text-white h-14 px-8 text-lg font-bold rounded-full bg-transparent">
              Become a Guide
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;