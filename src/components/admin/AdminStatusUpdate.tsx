"use client";

import React from "react";
import { Chip } from "@heroui/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface AdminStatusUpdateProps {
  adminproductid: string;
  status?: string;
}

const AdminStatusUpdate = ({ adminproductid, status }: AdminStatusUpdateProps) => {
  const router = useRouter();
  const normalizedStatus = status?.toLowerCase();
  const isApproved = normalizedStatus === "approved";

  const handleApprove = async (): Promise<void> => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/status/${adminproductid}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Approved" }),
        },
      );

      const data = (await res.json()) as { message?: string };

      if (res.ok) {
        toast.success("Product Approved");
        router.refresh();
      } else {
        toast.error(data?.message || "Could not approve the product");
      }
    } catch {
      toast.error("Try again later");
    }
  };

  if (isApproved) {
    return (
      <Chip color="success" variant="soft">
        Approved
      </Chip>
    );
  }

  return (
    <Chip
      color="success"
      variant="soft"
      role="button"
      tabIndex={0}
      aria-label="Approve product"
      className="cursor-pointer select-none"
      onClick={handleApprove}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          void handleApprove();
        }
      }}
    >
      Approve
    </Chip>
  );
};

export default AdminStatusUpdate;
