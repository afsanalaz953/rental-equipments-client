// components/WishlistButton.tsx
"use client";

// import { authClient } from "@/lib/auth-client";
import { Heart } from "lucide-react";
import { useState, type MouseEvent } from "react";
import { toast } from "react-toastify";
import type { WishlistButtonProps, WishlistResponse } from "@/types/wishlist";
import { authClient } from "@/lib/auth-client";

const WishlistButton = ({
  equipmentData,
  equipmentId,

  className = "",
}: WishlistButtonProps) => {
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { data: session } = authClient.useSession(); // Better Auth example
  const customerId = session?.user?.id

  const toggleWishlist = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (loading) return;

    const previousState = isWishlisted;
    setIsWishlisted(!previousState);
    setLoading(true);

    try {
      if (!customerId) {
        toast.error("please sign in!");
        setIsWishlisted(previousState);
        return;
      }

    //   const { data: tokenData } = await authClient.token();
    //   const token = tokenData?.token;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/wishlist`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // ...(token ? { Authorization: `Bearer ${token}` } : {}),

          },
          body: JSON.stringify({
            equipmentData,
            equipmentId: equipmentId ?? equipmentData._id,
            customerId,
          }),
        }
      );

      const data: WishlistResponse = await response.json();
      console.log(data, "customerIdWishlist");

      if (response.ok) {
        toast.success(
          previousState
            ? "Removed from wishlist 🗑️"
            : "Product added to Wishlist ❤️"
        );
        console.log("success:", data.message);
      } else {
        toast.error(data.message || "Server Error!");
        setIsWishlisted(previousState);
      }
    } catch (error) {
      toast.error("Try again, Network issue");
      console.error("Network Error:", error);
      setIsWishlisted(previousState);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleWishlist}
      disabled={loading}
      className={`p-2 rounded-full hover:bg-slate-100 transition-all duration-200 active:scale-90 ${
        loading ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={isWishlisted}
    >
      <Heart
        className={`w-5 h-5 transition-all duration-300 ${
          isWishlisted
            ? "fill-red-500 text-red-500 drop-shadow-md"
            : "text-slate-400 hover:text-red-400"
        }`}
      />
    </button>
  );
};

export default WishlistButton;