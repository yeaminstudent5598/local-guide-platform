"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!email) return toast.error("Please enter your email");
    
    setLoading(true);
    try {
      const res = await fetch("/api/v1/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
        toast.success("Reset link sent!");
      } else {
        toast.error(data.message);
      }
    } catch (err) { 
      toast.error("Something went wrong"); 
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md text-center p-6">
          <CardHeader>
            <CardTitle className="text-xl">Check your email</CardTitle>
            <CardDescription className="mt-2">
              We have sent a password reset link to <span className="font-medium text-slate-900">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-6">
              Didn't receive the email? Check your spam folder.
            </p>
            <Link href="/login">
              <Button variant="outline" className="w-full">Back to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-4">
            <Link href="/login" className="text-sm text-muted-foreground flex items-center hover:text-primary transition">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Login
            </Link>
          </div>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
            <Button className="w-full" size="lg" type="submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "Send Reset Link"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}