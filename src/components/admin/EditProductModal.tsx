"use client";

import React, { useState } from "react";
import { Button, Input, Label, Modal, TextField } from "@heroui/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import type { Equipment } from "@/types/equipment";

interface EditProductModalProps {
  product: Equipment;
}

const EditProductModal = ({ product }: EditProductModalProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // legacy form stores `title`, the newer rental form stores `equipmentName`
  const nameKey: "title" | "equipmentName" = product.equipmentName
    ? "equipmentName"
    : "title";
  const initialName = product[nameKey] ?? "";
  const initialPrice = product.price ?? product.rentalPrice ?? "";
  const initialCategory = product.category ?? "";

  const handleSave = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    const form = event.currentTarget;
    const name = String(new FormData(form).get("name") ?? "").trim();
    const price = Number(new FormData(form).get("price"));
    const category = String(new FormData(form).get("category") ?? "").trim();

    if (!name) {
      toast.error("Product name is required");
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      toast.error("Enter a valid price");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/${product._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [nameKey]: name, price, category }),
        },
      );

      const data = (await res.json()) as { message?: string };

      if (res.ok) {
        toast.success("Product updated");
        setIsOpen(false);
        router.refresh();
      } else {
        toast.error(data?.message || "Could not update the product");
      }
    } catch {
      toast.error("Try again later");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        isIconOnly
        aria-label="Edit product"
        onPress={() => setIsOpen(true)}
      >
        <Pencil className="size-4" />
      </Button>

      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <Modal.Backdrop>
          <Modal.Container placement="auto">
            <Modal.Dialog className="sm:max-w-md">
              <Modal.CloseTrigger />

              <Modal.Header>
                <Modal.Heading>Edit Product</Modal.Heading>
                <p className="mt-1.5 text-sm leading-5 text-muted">
                  Update the product information and save the changes.
                </p>
              </Modal.Header>

              <Modal.Body className="p-6">
                <form onSubmit={handleSave} className="flex flex-col gap-4">
                  <TextField className="w-full" name="name" isRequired defaultValue={initialName}>
                    <Label>Product Name</Label>
                    <Input placeholder="Product name" />
                  </TextField>

                  <TextField
                    className="w-full"
                    name="price"
                    isRequired
                    defaultValue={initialPrice === "" ? undefined : String(initialPrice)}
                  >
                    <Label>Price</Label>
                    <Input type="number" min={0} step="any" placeholder="Price" />
                  </TextField>

                  <TextField className="w-full" name="category" defaultValue={initialCategory}>
                    <Label>Category</Label>
                    <Input placeholder="Category" />
                  </TextField>

                  <div className="flex justify-end gap-3">
                    <Button slot="close" variant="tertiary" type="button">
                      Cancel
                    </Button>
                    <Button type="submit" isDisabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
};

export default EditProductModal;
