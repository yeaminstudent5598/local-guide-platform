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
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
      document.cookie = `accessToken=${data.data.accessToken}; path=/;`;

      toast.success("Welcome back!");
      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <div className="flex justify-between items-center">
                <FormLabel>Password</FormLabel>
                {/* ✅ FIX: Changed 'class' to 'className' */}
                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <FormControl><Input placeholder="******" type="password" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : "Login"}
        </Button>
        <div className="text-center text-sm text-muted-foreground mt-4">
          Don&apos;t have an account? <Link href="/register" className="text-primary hover:underline font-medium">Register</Link>
        </div>
      </form>
    </Form>
  );
}