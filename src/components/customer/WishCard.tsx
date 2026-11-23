"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Boxes,
  CircleDollarSign,
  ImageOff,
  MapPin,
  Wrench,
} from "lucide-react";
import { cn } from "cn";
import type { EquipmentData } from "@/types/wishlist";
import WishListDeleteButton from "@/components/customer/WishlistDeleteButton";

interface WishCardProps {
  equipmentData: EquipmentData;
  /** Wishlist document _id — used to delete this entry from the DB */
  wishlistId?: string;
}

const conditionStyles: Record<string, string> = {
  excellent: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  "like new": "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  good: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  better: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  refurbished: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
};

const WishCard: React.FC<WishCardProps> = ({ equipmentData, wishlistId }) => {
  const [imageFailed, setImageFailed] = useState(false);

  const {
    _id,
    // canonical equipment fields
    equipmentName,
    equipmentImage,
    category,
    rentalPrice,
    rentalType,
    location,
    availabilityStatus,
    stock,
    description,
    // legacy (form) fallbacks
    title,
    name,
    price,
    image,
    condition,
  } = equipmentData as EquipmentData & {
    equipmentName?: string;
    equipmentImage?: string;
    rentalPrice?: number;
    rentalType?: string;
    location?: string;
    availabilityStatus?: string;
  };

  const displayName = equipmentName ?? title ?? name ?? "Untitled equipment";
  const imageUrl = equipmentImage ?? image;
  const rate = rentalPrice ?? price;
  const conditionKey = (condition ?? "").toLowerCase();
  const hasImage = Boolean(imageUrl) && !imageFailed;
  const isAvailable =
    (availabilityStatus ?? "").trim().toLowerCase() === "available";

  return (
    <Card className="group h-full gap-0 overflow-hidden py-0 ring-1 ring-foreground/10 transition-shadow duration-300 hover:shadow-2xl">
      {/* ---------- Image layer ---------- */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        {hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={displayName}
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageOff className="size-8" />
            <span className="text-xs">No image available</span>
          </div>
        )}

        {/* Category badge */}
        {category && (
          <span className="absolute top-3 left-3 rounded-full bg-[#FFC000] px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur">
            {category}
          </span>
        )}

        {/* Availability badge */}
        {availabilityStatus && (
          <span
            className={cn(
              "absolute top-3 right-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur",
              isAvailable
                ? "bg-[#FFC000] font-bold"
                : "bg-amber-500/90 text-white",
            )}
          >
            {availabilityStatus}
          </span>
        )}
      </div>

      {/* ---------- Body layer ---------- */}
      <CardHeader className="px-4 pt-4">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="line-clamp-1 text-base font-semibold">
            {displayName}
          </CardTitle>
          {rate != null && (
            <span className="flex shrink-0 flex-col items-end rounded-lg bg-[#FFC000] px-2 py-1">
              <span className="flex items-center gap-1 font-bold">
                <CircleDollarSign className="size-3.5" />
                {rate}
              </span>
              {rentalType && (
                <span className="text-[10px] leading-tight font-medium">
                  / {rentalType}
                </span>
              )}
            </span>
          )}
        </div>
        {description && (
          <CardDescription className="line-clamp-2">
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="px-4 pt-2">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {location && (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 font-bold">
              <MapPin className="size-3" />
              {location}
            </span>
          )}
          {condition && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium",
                conditionStyles[conditionKey] ??
                  "bg-muted text-muted-foreground",
              )}
            >
              <Wrench className="size-3" />
              {condition}
            </span>
          )}
          {stock != null && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1",
                stock > 0 ? "bg-muted" : "bg-destructive/10 text-destructive",
              )}
            >
              <Boxes className="size-3" />
              {stock > 0 ? `${stock} in stock` : "Out of stock"}
            </span>
          )}
        </div>
      </CardContent>

      {/* ---------- Footer layer ---------- */}
      <CardFooter className="mt-auto gap-2 border-t bg-muted/40 px-4 py-3">
        <Button
          render={<Link href={`/equipments/${_id}`} />}
          variant="outline"
          className="flex-1 justify-between bg-[#FFC000] font-bold text-black text-lg hover:bg-blue-950 hover:text-white"
        >
          View details
          <ArrowRight className="transition-transform duration-300 group-hover/card:translate-x-1" />
        </Button>

        {/* Delete button — removes this wishlist entry from the DB */}
        {wishlistId && (
          <WishListDeleteButton id={wishlistId} />
        )}
        
      </CardFooter>
    </Card>
  );
};

export default WishCard;
