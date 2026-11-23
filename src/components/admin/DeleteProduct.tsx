"use client";

import React from "react";
import { AlertDialog, Button } from "@heroui/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface DeleteProductProps {
  productid: string;
  productName?: string;
}

const DeleteProduct = ({ productid, productName }: DeleteProductProps) => {
  const router = useRouter();

  const handleDelete = async (): Promise<void> => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/${productid}`,
        {
          method: "DELETE",
          headers: { "content-type": "application/json" },
        },
      );

      const data = (await res.json()) as { message?: string };

      if (res.ok) {
        toast.success("Product deleted");
        router.refresh();
      } else {
        toast.error(data?.message || "Could not delete the product");
      }
    } catch {
      toast.error("Try again later");
    }
  };

  return (
    <AlertDialog>
      <AlertDialog.Trigger>
        <Button
          size="sm"
          variant="danger-soft"
          isIconOnly
          aria-label="Delete product"
        >
          <Trash2 className="size-4" />
        </Button>
      </AlertDialog.Trigger>

      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-100">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>Delete Product?</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p className="text-slate-600">
                Are you sure you want to delete
                {productName ? ` "${productName}"` : " this product"}? This
                action cannot be undone.
              </p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary">
                Keep Product
              </Button>
              <Button
                onClick={handleDelete}
                slot="close"
                variant="danger"
                className="font-bold"
              >
                Delete
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
};

export default DeleteProduct;
