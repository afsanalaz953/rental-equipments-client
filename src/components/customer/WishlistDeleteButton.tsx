
"use client";
import React, { useState } from 'react';

import { toast } from 'react-toastify';
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

interface WishlistDeleteButtonProps {
    /** Wishlist document _id (the id your Express DELETE /api/wishlist/:id removes from the DB) */
    id?: string;
    label?: string;
    className?: string;
}

const WishListDeleteButton = ({ id, label = "Delete", className = "" }: WishlistDeleteButtonProps) => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleDeleteButton = async () => {
        if (!id || loading) return;
        setLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/wishlist/${id}`, {
                method: "DELETE",
                headers: {
                    "content-type": "application/json"
                }
            });

            const data = await res.json();
            console.log("delete response", data);

            if (!res.ok) {
                throw new Error(data?.message || "Failed to delete wishlist item");
            }

            toast.success('Wishlist deleted ', {
                autoClose: 4000,
                position: 'top-center',
            });

            router.refresh();
        } catch (error) {
            console.error("Wishlist delete error:", error);
            toast.error('Could not delete from wishlist', {
                autoClose: 4000,
                position: 'top-center',
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            type="button"
            onClick={handleDeleteButton}
            disabled={!id || loading}
            aria-label="Remove from wishlist"
            title="Remove from wishlist"
            className={`inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        >
            {loading ? (
                <Loader2 className="size-4 animate-spin" />
            ) : (
                <Trash2 className="size-4" />
            )}
            {label}
        </button>
    );
};

export default WishListDeleteButton;
