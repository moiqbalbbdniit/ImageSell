"use client";

import AdminProductForm from "@/components/AdminProductForm";

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Add New Product</h1>
        <AdminProductForm />
      </div>
    </div>
  );
}
