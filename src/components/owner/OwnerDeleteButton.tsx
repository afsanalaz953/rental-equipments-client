"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertDialog, Button } from "@heroui/react";
import { toast } from "react-toastify";
import { RiDeleteBin3Line } from "react-icons/ri";

/* ---------- types ---------- */
interface OwnerDeleteButtonProps {
  productId: string;
  productTitle?: string;
}

/* ---------- component ---------- */
const OwnerDeleteButton = ({
  productId,
  productTitle,
}: OwnerDeleteButtonProps) => {
  const router = useRouter();
  const [deleting, setDeleting] = useState<boolean>(false);

  const handleDeleteButton = async (): Promise<void> => {
    if (!productId) {
      toast.error("Product id missing");
      return;
    }

    try {
      setDeleting(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/owner/${productId}`,
        {
          method: "DELETE",
          headers: { "content-type": "application/json" },
        }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

    //   await res.json();
    const data = await res.json ();
console.log( "delete response", data);
window.location.reload();


      toast.success("Product deleted successfully ✅", {
        duration: 4000,
        position: "top-center",
      });

      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed ❌", {
        duration: 4000,
        position: "top-center",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <Button variant="danger" type="button" isDisabled={deleting}>
        <RiDeleteBin3Line />
      </Button>

      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-100">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>Confirm Deletion</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p className="text-slate-600">
                Are you sure you want to delete{" "}
                <span className="font-semibold">
                  {productTitle ?? "this product"}
                </span>
                ? This action cannot be undone.
              </p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary">
                Keep Product
              </Button>
              <Button
                onClick={handleDeleteButton}
                slot="close"
                color="danger"
                className="font-bold"
                isDisabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete Product"}
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
};

export default OwnerDeleteButton;