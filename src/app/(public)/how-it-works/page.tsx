import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Globe, Heart } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white pb-20">

            {/* Hero */}
            <section className="py-24 container text-center max-w-4xl">
                <span className="text-primary font-bold tracking-wider text-sm uppercase mb-4 block">Our Mission</span>
                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-8 tracking-tight leading-tight">
                    We Connect People <br /> Through <span className="text-primary">Stories</span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                    Vistara is a platform that empowers locals to share their culture and travelers to experience the world authentically, beyond the guidebooks.
                </p>
            </section>

            {/* Image Grid */}
            <section className="container mb-24">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                    <div className="md:col-span-4 relative h-full bg-slate-200">
                        <Image
                            src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=2070&auto=format&fit=crop"
                            alt="Traveler"
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                    <div className="md:col-span-8 relative h-full bg-slate-200">
                        <Image
                            src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=2070&auto=format&fit=crop"
                            alt="Team"
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="absolute bottom-8 left-8 text-white">
                            <h3 className="text-2xl font-bold">Global Community</h3>
                            <p>Connecting cultures across 50+ cities.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 bg-slate-50">
                <div className="container">
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="border-none shadow-none bg-transparent">
                            <CardContent className="pt-6">
                                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                                    <Globe className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Authenticity</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    We believe the best way to see a place is through the eyes of someone who calls it home. No scripted tours, just real experiences.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-none bg-transparent">
                            <CardContent className="pt-6">
                                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                                    <Users className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Community</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    We empower locals to turn their passion into income, keeping tourism revenue within the local communities.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-none bg-transparent">
                            <CardContent className="pt-6">
                                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                                    <Heart className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Connection</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Travel is about the people you meet. We facilitate meaningful connections that last long after the trip ends.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-24 container">
                <div className="bg-slate-900 rounded-3xl p-12 md:p-20 text-center text-white">
                    <h2 className="text-3xl font-bold mb-12">Making an Impact</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <div className="text-4xl md:text-5xl font-extrabold text-primary mb-2">500+</div>
                            <div className="text-slate-400">Local Guides</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-extrabold text-primary mb-2">12k+</div>
                            <div className="text-slate-400">Happy Travelers</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-extrabold text-primary mb-2">50+</div>
                            <div className="text-slate-400">Cities Covered</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-extrabold text-primary mb-2">4.8</div>
                            <div className="text-slate-400">Average Rating</div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}