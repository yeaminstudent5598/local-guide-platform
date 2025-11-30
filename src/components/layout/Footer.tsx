import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter, Linkedin, MapPin, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-200 border-t border-slate-800">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Vistara</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Discover hidden gems and authentic local experiences with verified guides. 
              Your journey to the heart of the culture starts here.
            </p>
            <div className="flex gap-4 pt-2">
              <Link href="#" className="hover:text-primary transition"><Facebook className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-primary transition"><Instagram className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-primary transition"><Twitter className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-primary transition"><Linkedin className="h-5 w-5" /></Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/" className="hover:text-primary transition">Home</Link></li>
              <li><Link href="/explore" className="hover:text-primary transition">Explore Tours</Link></li>
              <li><Link href="/about" className="hover:text-primary transition">About Us</Link></li>
              <li><Link href="/dashboard/listings/create" className="hover:text-primary transition">Become a Guide</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contact</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span>123 Tourism Street, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>support@vistara.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span>+880 1234 567 890</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Newsletter</h4>
            <p className="text-slate-400 text-sm">
              Subscribe to get special offers and travel inspiration.
            </p>
            <div className="flex flex-col gap-2">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-primary" 
              />
              <Button className="w-full">Subscribe</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 py-6">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Vistara. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;