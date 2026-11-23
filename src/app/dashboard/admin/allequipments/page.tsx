import React from "react";
import AdminProductsTable from "@/components/admin/AdminProductsTable";
import type { Equipment } from "@/types/equipment";

const AdminAllequipmentsPage = async () => {
  let adminProducts: Equipment[] = [];
  let loadError: string | null = null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/products/all`,
      { cache: "no-store" },
    );

    if (!res.ok) {
      loadError = `Failed to load products (${res.status})`;
    } else {
      const data = await res.json();
      adminProducts = Array.isArray(data) ? (data as Equipment[]) : [];
    }
  } catch {
    loadError = "Failed to reach the server";
  }

  if (loadError) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-6">
        <h1 className="mb-4 text-2xl font-bold text-foreground">
          Manage Products
        </h1>
        <div className="rounded-xl border bg-card px-6 py-10 text-center text-sm text-muted-foreground">
          {loadError}
        </div>
      </div>
    );
  }

  return <AdminProductsTable products={adminProducts} />;
};

export default AdminAllequipmentsPage;
