"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Eye, EyeOff, Mail, Lock } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      localStorage.setItem("accessToken", data.data.accessToken);
      document.cookie = `accessToken=${data.data.accessToken}; path=/; max-age=86400;`;

      toast.success("Welcome back to Vistara!");
      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email Terminal</FormLabel>
              <FormControl>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <Input 
                    placeholder="explorer@vistara.com" 
                    className="h-14 pl-12 rounded-2xl bg-slate-50 border-none focus-visible:ring-emerald-500 font-medium" 
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage className="text-[10px]" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <div className="flex justify-between items-center px-1">
                <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Pass-Key</FormLabel>
                {/* Fixed: disabled prop removed, handled via className */}
                <Link 
                  href="/forgot-password" 
                  className="text-[10px] font-bold text-slate-300 pointer-events-none uppercase tracking-tighter"
                >
                  Forgot?
                </Link>
              </div>
              <FormControl>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <Input
                    placeholder="******"
                    type={showPassword ? "text" : "password"}
                    className="h-14 pl-12 rounded-2xl bg-slate-50 border-none focus-visible:ring-emerald-500 font-medium"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-emerald-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage className="text-[10px]" />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full h-16 rounded-[1.8rem] bg-slate-950 hover:bg-emerald-600 text-white font-black text-lg transition-all shadow-xl shadow-slate-200" disabled={loading}>
          {loading ? <Loader2 className="animate-spin h-6 w-6" /> : "Confirm Access"}
        </Button>

        <div className="text-center">
          <p className="text-sm font-medium text-slate-400">
            New here? <Link href="/register" className="text-emerald-600 font-bold hover:underline">Create Journey</Link>
          </p>
        </div>
      </form>
    </Form>
  );
}