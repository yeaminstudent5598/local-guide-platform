"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// User Interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "GUIDE" | "TOURIST";
  profileImage?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Call API to get real-time user data
        const res = await fetch("/api/v1/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.success) {
          setUser(data.data);
        } else {
          // If token is invalid, clear it
          localStorage.removeItem("accessToken");
          setUser(null);
        }
      } catch (error) {
        console.error("Auth fetch error:", error);
        localStorage.removeItem("accessToken");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    // Clear cookies as well
    document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    setUser(null);
    toast.success("Logged out successfully");
    router.push("/login");
    router.refresh();
  };

  return { user, loading, logout };
}