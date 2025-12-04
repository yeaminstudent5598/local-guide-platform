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
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, MailCheck } from "lucide-react";

// Schema
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["TOURIST", "GUIDE"]),
});

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = Form, 2 = OTP
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "", email: "", password: "", role: "TOURIST",
    },
  });

  // Step 1: Request OTP
  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setLoading(true);
    try {
      const response = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      toast.success("OTP sent to your email!");
      setEmail(values.email);
      setStep(2); // Go to OTP screen
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  // Step 2: Verify OTP
  const handleVerify = async () => {
    if (!otp || otp.length < 6) return toast.error("Please enter a valid OTP");
    setLoading(true);

    try {
      const response = await fetch("/api/v1/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      // Auto Login Setup
      localStorage.setItem("accessToken", data.data.accessToken);
      document.cookie = `accessToken=${data.data.accessToken}; path=/;`;
      
      toast.success("Account verified successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- UI: OTP Verification Screen ---
  if (step === 2) {
    return (
      <div className="space-y-6 text-center py-4">
        <div className="flex justify-center">
          <div className="bg-blue-50 p-3 rounded-full">
            <MailCheck className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold">Verify your Email</h3>
          <p className="text-sm text-muted-foreground mt-2">
            We sent a verification code to <br />
            <span className="font-medium text-slate-900">{email}</span>
          </p>
        </div>
        
        <div className="space-y-4">
          <Input 
            className="text-center text-2xl tracking-[0.5em] font-bold h-12" 
            placeholder="XXXXXX" 
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.toUpperCase())}
          />
          <Button onClick={handleVerify} className="w-full" size="lg" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Verify Account"}
          </Button>
        </div>
        
        <button onClick={() => setStep(1)} className="text-sm text-slate-500 hover:text-primary">
          Wrong email? Go back
        </button>
      </div>
    );
  }

  // --- UI: Registration Form ---
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input placeholder="john@example.com" type="email" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl><Input placeholder="******" type="password" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>I want to join as</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="TOURIST">Tourist</SelectItem>
                  <SelectItem value="GUIDE">Local Guide</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : "Create Account"}
        </Button>
        
        <div className="text-center text-sm text-muted-foreground mt-4">
          Already have an account? <Link href="/login" className="text-primary hover:underline font-medium">Login</Link>
        </div>
      </form>
    </Form>
  );
}