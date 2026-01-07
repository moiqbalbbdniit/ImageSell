"use client";

import AdminProductForm from "@/components/AdminProductForm";
import { ShieldAlert } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Basic route protection (Frontend only - Middleware handles the real protection)
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
      return null; // Or a loader
  }

  // Double check role visually
  if (session?.user?.role !== "admin") {
     return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-zinc-900">Access Denied</h1>
            <p className="text-zinc-500 mt-2">You do not have permission to view this page.</p>
        </div>
     )
  }

  return (
    <div className="container mx-auto px-4 py-8">
       {/* The header "Add New Product" is already inside the AdminProductForm component 
         for better encapsulation, so we just render the form wrapper here.
       */}
      <div className="max-w-5xl mx-auto">
        <AdminProductForm />
      </div>
    </div>
  );
}