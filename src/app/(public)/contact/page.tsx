"use client";

import { useState } from "react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageSquare, 
  Clock, 
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Loader2,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";

export default function ContactPage() {
  // TypeScript error solved by casting to any
  const { t, lang } = useLanguage() as any;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch("/api/v1/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(
          t?.contact?.success || 
          (lang === "bn" ? "আপনার মেসেজটি সফলভাবে পাঠানো হয়েছে!" : "Your message has been sent successfully!")
        );
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        throw new Error(result.message || "Failed to send message");
      }
    } catch (error: any) {
      toast.error(
        error.message || 
        (lang === "bn" ? "মেসেজ পাঠাতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।" : "Failed to send message. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      
      {/* --- 🌊 Hero Section --- */}
      <div className="relative bg-slate-900 pt-32 pb-40 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles className="h-3 w-3" /> 
            {t?.contact?.getInTouch || (lang === "bn" ? "যোগাযোগ করুন" : "Get In Touch")}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
            {t?.contact?.title || (lang === "bn" ? "আমরা কীভাবে সাহায্য করতে পারি?" : "How can we help you?")}
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            {t?.contact?.subtitle || (lang === "bn" 
              ? "আপনার যেকোনো জিজ্ঞাসা বা মতামতের জন্য আমাদের সাথে যোগাযোগ করুন। আমরা ২৪ ঘণ্টার মধ্যে উত্তর দেওয়ার চেষ্টা করি।" 
              : "Reach out to us for any questions or feedback. We aim to respond within 24 hours.")}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-24 relative z-20">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* --- 📝 Contact Form --- */}
          <Card className="lg:col-span-7 border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
            <CardContent className="p-8 md:p-12">
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {t?.contact?.sendMessage || (lang === "bn" ? "মেসেজ পাঠান" : "Send Message")}
                </h3>
                <p className="text-slate-500 text-sm font-medium">
                  {t?.contact?.formDesc || (lang === "bn" 
                    ? "নিচের ফর্মটি পূরণ করুন এবং আমাদের টিম আপনার সাথে যোগাযোগ করবে।" 
                    : "Fill out the form below and our team will get back to you.")}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                      {t?.contact?.name || (lang === "bn" ? "নাম" : "Name")}
                    </label>
                    <Input 
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={lang === "bn" ? "আপনার নাম" : "John Doe"} 
                      className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                      {t?.contact?.emailLabel || (lang === "bn" ? "ইমেইল" : "Email")}
                    </label>
                    <Input 
                      required 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={lang === "bn" ? "example@email.com" : "john@example.com"} 
                      className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                    {t?.contact?.subject || (lang === "bn" ? "विषয়" : "Subject")}
                  </label>
                  <Input 
                    required
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder={lang === "bn" ? "বিষয় লিখুন" : "Booking Inquiry"} 
                    className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                    {t?.contact?.messageLabel || (lang === "bn" ? "মেসেজ" : "Message")}
                  </label>
                  <Textarea 
                    required
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t?.contact?.placeholder || (lang === "bn" ? "আপনার কথাগুলো এখানে লিখুন..." : "Type your message here...")} 
                    className="min-h-[150px] rounded-2xl bg-slate-50 border-slate-100 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all" 
                  />
                </div>

                <Button 
                  type="submit"
                  disabled={loading} 
                  className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-lg shadow-xl shadow-slate-200 transition-all active:scale-95 border-none"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      {t?.contact?.btnText || (lang === "bn" ? "মেসেজ পাঠান" : "Send Message")}
                      <Send className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* --- ℹ️ Info Section --- */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Contact Cards Grid */}
            <div className="grid gap-4">
              <InfoCard 
                icon={Mail} 
                title={t?.contact?.email || (lang === "bn" ? "ইমেইল সাপোর্ট" : "Email Support")} 
                value="hello@vistara.com" 
                color="text-indigo-600" 
                bg="bg-indigo-50" 
              />
              <InfoCard 
                icon={Phone} 
                title={t?.contact?.phone || (lang === "bn" ? "ফোন কল" : "Phone Call")} 
                value="+880 1641-801705" 
                color="text-emerald-600" 
                bg="bg-emerald-50" 
              />
              <InfoCard 
                icon={MapPin} 
                title={t?.contact?.office || (lang === "bn" ? "প্রধান অফিস" : "Head Office")} 
                value={lang === "bn" ? "ধানমন্ডি, ঢাকা, বাংলাদেশ" : "Dhanmondi, Dhaka, Bangladesh"} 
                color="text-rose-600" 
                bg="bg-rose-50" 
              />
            </div>

            {/* Availability Widget */}
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] bg-indigo-900 text-white p-8 relative overflow-hidden">
               <Globe className="absolute -right-6 -bottom-6 h-32 w-32 text-white/10 rotate-12" />
               <div className="relative z-10 space-y-4">
                 <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <Clock className="h-5 w-5 text-indigo-300" />
                 </div>
                 <h4 className="text-xl font-bold">
                   {t?.contact?.workHours || (lang === "bn" ? "কার্যসময়" : "Working Hours")}
                 </h4>
                 <div className="space-y-2 text-indigo-100 text-sm font-medium">
                   <p className="flex justify-between">
                     <span>{lang === "bn" ? "সোম - শুক্র:" : "Mon - Fri:"}</span> 
                     <span>{lang === "bn" ? "সকাল ৯টা - সন্ধ্যা ৬টা" : "9 AM - 6 PM"}</span>
                   </p>
                   <p className="flex justify-between">
                     <span>{lang === "bn" ? "শনি - রবি:" : "Sat - Sun:"}</span> 
                     <span>{lang === "bn" ? "সকাল ১০টা - বিকাল ৪টা" : "10 AM - 4 PM"}</span>
                   </p>
                 </div>
               </div>
            </Card>

            {/* Social Links */}
            <div className="flex justify-center gap-4">
              {[
                { Icon: Facebook, label: "Facebook" },
                { Icon: Twitter, label: "Twitter" },
                { Icon: Instagram, label: "Instagram" },
                { Icon: Linkedin, label: "LinkedIn" }
              ].map(({ Icon, label }, i) => (
                <button 
                  key={i} 
                  aria-label={label}
                  className="h-12 w-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-100 hover:shadow-lg transition-all"
                >
                  <Icon className="h-5 w-5" />
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// --- Helper Components ---

function InfoCard({ icon: Icon, title, value, color, bg }: any) {
  return (
    <div className="flex items-center gap-5 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
      <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", bg, color)}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-lg font-bold text-slate-900 truncate">{value}</p>
      </div>
    </div>
  );
}