'use client';

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function BlogsPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Blogs</h1>
        {/* Blog content here */}
      </div>
    </ProtectedRoute>
  );
} 