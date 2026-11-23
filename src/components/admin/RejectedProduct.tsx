"use client";

import React from "react";
import { AlertDialog, Button } from "@heroui/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface RejectedProductProps {
  rejectedproductid: string;
  status?: string;
}

const AdminRejected = ({ rejectedproductid, status }: RejectedProductProps) => {
  const router = useRouter();
  const isApproved = status?.toLowerCase() === "approved";

  const handleReject = async (): Promise<void> => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/${rejectedproductid}`,
        {
          method: "DELETE",
          headers: { "content-type": "application/json" },
        },
      );

      const data = (await res.json()) as { message?: string };

      if (res.ok) {
        toast.success("Product rejected");
        router.refresh();
      } else {
        toast.error(data?.message || "Could not reject the product");
      }
    } catch {
      toast.error("Try again later");
    }
  };

  if (isApproved) {
    return (
      <Button variant="danger-soft" size="sm" isDisabled>
        Reject
      </Button>
    );
  }

  return (
    <AlertDialog>
      <AlertDialog.Trigger>
        <Button variant="danger-soft" size="sm">
          Reject
        </Button>
      </AlertDialog.Trigger>

      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-100">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>Reject Product?</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p className="text-slate-600">
                Are you sure you want to reject this product? It will be removed
                from the product list. This action cannot be undone.
              </p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary">
                Keep Product
              </Button>
              <Button
                onClick={handleReject}
                slot="close"
                variant="danger"
                className="font-bold"
              >
                Reject Product
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
};

export default AdminRejected;
