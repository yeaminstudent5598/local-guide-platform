"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Lock, ShieldAlert, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

// 1. Validation Schema for Password Change
const passwordSchema = z.object({
  oldPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  // 2. Handle Password Change Submit
  const onPasswordSubmit = async (data: PasswordFormData) => {
    setLoading(true);
    const toastId = toast.loading("Updating password...");

    try {
      const token = localStorage.getItem("accessToken");
      
      // ✅ Updated API Endpoint
      const res = await fetch("/api/v1/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        }),
      });

      const result = await res.json();

      if (result.success) {
        toast.success("Password changed successfully", { id: toastId });
        reset(); // Clear form
      } else {
        throw new Error(result.message || "Failed to update password");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Account Deletion
  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure? This action cannot be undone!")) return;

    const toastId = toast.loading("Processing...");
    try {
        // Optional: Call Delete API here if implemented
        // await fetch("/api/v1/profile", { method: "DELETE", ... })
        
        toast.error("Account deletion is restricted for security in this demo.", { id: toastId });
    } catch (error) {
        toast.error("Failed to delete account");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account security and preferences.</p>
      </div>

      {/* --- Change Password Section --- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Security
          </CardTitle>
          <CardDescription>
            Update your password to keep your account secure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-4 max-w-lg">
            
            <div className="space-y-2">
              <Label htmlFor="oldPassword">Current Password</Label>
              <Input 
                id="oldPassword" 
                type="password" 
                placeholder="••••••" 
                {...register("oldPassword")}
                className={errors.oldPassword ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.oldPassword && (
                <p className="text-xs text-red-500">{errors.oldPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input 
                id="newPassword" 
                type="password" 
                placeholder="••••••" 
                {...register("newPassword")}
                className={errors.newPassword ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.newPassword && (
                <p className="text-xs text-red-500">{errors.newPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                placeholder="••••••" 
                {...register("confirmPassword")}
                className={errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="pt-2">
                <Button type="submit" disabled={loading}>
                {loading ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                    </>
                ) : (
                    "Update Password"
                )}
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* --- Danger Zone Section --- */}
      <Card className="border-red-100 bg-red-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <ShieldAlert className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription className="text-red-600/80">
            Permanently delete your account and all associated data. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="destructive" 
            onClick={handleDeleteAccount}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4" />
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}