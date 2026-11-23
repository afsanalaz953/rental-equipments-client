"use client";

import React from "react";
import { Chip } from "@heroui/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ImageOff, PackageSearch } from "lucide-react";
import AdminStatusUpdate from "@/components/admin/AdminStatusUpdate";
import AdminRejected from "@/components/admin/RejectedProduct";
import EditProductModal from "@/components/admin/EditProductModal";
import DeleteProduct from "@/components/admin/DeleteProduct";
import type { Equipment } from "@/types/equipment";

interface AdminProductsTableProps {
  products: Equipment[];
}

/* ---------- helpers ---------- */
const productNameOf = (product: Equipment): string =>
  product.equipmentName ?? product.title ?? "Untitled product";

const imageUrlOf = (product: Equipment): string | undefined =>
  product.equipmentImage ?? product.image;

const statusOf = (product: Equipment): string =>
  product.status ?? product.availabilityStatus ?? "Available";

const statusColorOf = (status: string): "success" | "warning" | "danger" | "default" => {
  switch (status.toLowerCase()) {
    case "approved":
    case "available":
      return "success";
    case "pending":
      return "warning";
    case "rejected":
    case "unavailable":
      return "danger";
    default:
      return "default";
  }
};

const priceOf = (product: Equipment): number | null => {
  const value = Number(product.price ?? product.rentalPrice);
  return Number.isFinite(value) ? value : null;
};

/* ---------- component ---------- */
const AdminProductsTable = ({ products }: AdminProductsTableProps) => {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-bold text-foreground">
        Manage Products
      </h1>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
            <PackageSearch className="size-10 text-muted-foreground" />
            <div>
              <p className="text-base font-semibold text-foreground">
                No products found
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Products added by owners will show up here.
              </p>
            </div>
          </div>
        ) : (
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                  Product
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                  Seller
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                  Category
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                  Price
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="text-right text-xs uppercase tracking-wide text-muted-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {products.map((product) => {
                const name = productNameOf(product);
                const imageUrl = imageUrlOf(product);
                const price = priceOf(product);
                const status = statusOf(product);

                return (
                  <TableRow key={product._id}>
                    {/* product */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="size-10 shrink-0 overflow-hidden rounded-md border bg-muted">
                          {imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={imageUrl}
                              alt={name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <ImageOff className="size-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <span
                          className="max-w-[180px] truncate font-medium text-foreground"
                          title={name}
                        >
                          {name}
                        </span>
                      </div>
                    </TableCell>

                    {/* seller */}
                    <TableCell className="text-muted-foreground">
                      {product.ownerName ?? "—"}
                    </TableCell>

                    {/* category */}
                    <TableCell className="text-muted-foreground">
                      {product.category ?? "—"}
                    </TableCell>

                    {/* price */}
                    <TableCell className="font-semibold text-red-500">
                      {price === null ? "—" : `৳${price.toLocaleString("en-US")}`}
                    </TableCell>

                    {/* status */}
                    <TableCell>
                      <Chip color={statusColorOf(status)} variant="soft" size="sm">
                        {status}
                      </Chip>
                    </TableCell>

                    {/* actions */}
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <AdminStatusUpdate
                          adminproductid={product._id}
                          status={product.status}
                        />
                        <AdminRejected
                          rejectedproductid={product._id}
                          status={product.status}
                        />
                        <EditProductModal product={product} />
                        <DeleteProduct
                          productid={product._id}
                          productName={name}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default AdminProductsTable;
