"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
  BadgeCheck,
  Boxes,
  CircleDollarSign,
  ImageOff,
  MapPin,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils"; // ✅ FIXED: ছিল "cn"
import type { Equipment } from "@/types/equipment";
import WishlistButton from "@/components/customer/WishlistButton";

interface EquipmentCardProps {
  equipment: Equipment;
  index?: number;
}

const conditionStyles: Record<string, string> = {
  excellent: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  // "like new": "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  good: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  better: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  // refurbished: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
};

const statusStyles: Record<string, string> = {
  Approved: "bg-emerald-500/90 text-white",
  Pending: "bg-red-500/90 text-white",
  Rejected: "bg-destructive/90 text-white",
};

const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment }) => {
  const [imageFailed, setImageFailed] = useState(false);

  const {
    _id,
    equipmentName,
    equipmentImage,
    category,
    rentalPrice,
    rentalType,
    location,
    availabilityStatus,
    stock,
    description,
    title,
    price,
    image,
    condition,
    status,
  } = equipment;
  console.log(equipment, 'equipment for rental tyupe')

  const name = equipmentName ?? title ?? "Untitled equipment";
  const imageUrl = equipmentImage ?? image;
  const rate = rentalPrice ?? price;
  const conditionKey = (condition ?? "").toLowerCase();
  const hasImage = Boolean(imageUrl) && !imageFailed;
  const isAvailable =
    (availabilityStatus ?? "").trim().toLowerCase() === "available";

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <Card className="group h-full gap-0 overflow-hidden py-0 ring-1 ring-foreground/10 transition-shadow duration-300 hover:shadow-2xl dark:ring-foreground/10">
        {/* ---------- Image ---------- */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
          {hasImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={name}
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <ImageOff className="size-8" />
              <span className="text-xs">No image available</span>
            </div>
          )}

          {category && (
            <span className="absolute top-3 left-3 rounded-full bg-[#FFC000] px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur">
              {category}
            </span>
          )}

          {availabilityStatus && (
            <span
              className={cn(
                "absolute top-3 right-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur",
                isAvailable
                  ? "bg-[#FFC000] font-bold"
                  : "bg-amber-500/90 text-white"
              )}
            >
              <BadgeCheck className="size-3" />
              {availabilityStatus}
            </span>
          )}

          <span className="absolute bottom-3 right-3 z-10 rounded-full bg-red-600">
            <WishlistButton equipmentData={equipment} />
          </span>
        </div>

        {/* ---------- Body ---------- */}
        <CardHeader className="px-4 pt-4">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="line-clamp-1 text-base font-semibold">
              {name}
            </CardTitle>
            {rate != null && (
              <span className="flex shrink-0 flex-col items-end rounded-lg bg-[#FFC000] px-2 py-1">
                <span className="flex items-center gap-1 font-bold">
                  <CircleDollarSign className="size-3.5" />
                  {rate}
                </span>
                {rentalType && (
                  <span className="text-[10px] bg-yellow-300 leading-tight text-black font-medium">
                    /{rentalType}
                  </span>
                 
                )}
                
              </span>
            )}
          </div>
          <CardDescription className="line-clamp-2">
            {description}
          </CardDescription>
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
                    "bg-muted text-muted-foreground"
                )}
              >
                <Wrench className="size-3" />
                {condition}
              </span>
            )}
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1",
                (stock ?? 0) > 0
                  ? "bg-muted"
                  : "bg-destructive/10 text-destructive"
              )}
            >
              <Boxes className="size-3" />
              {(stock ?? 0) > 0 ? `${stock} in stock` : "Out of stock"}
            </span>
            {status && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium",
                  statusStyles[status] ?? "bg-muted text-muted-foreground"
                )}
              >
                <BadgeCheck className="size-3" />
                {status}
              </span>
            )}
          </div>
        </CardContent>

        {/* ---------- Footer ---------- */}
        <CardFooter className="mt-auto border-t bg-muted/40 px-4 py-3">
          <Button
            render={<Link href={`/equipments/${_id}`} />}
            variant="outline"
            className="w-full justify-between text-black font-bold text-lg bg-[#FFC000] hover:text-white hover:bg-blue-950"
          >
            View details
            <ArrowRight className="transition-transform duration-300 group-hover/card:translate-x-1" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default EquipmentCard;





// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import { motion } from "framer-motion";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   ArrowRight,
//   BadgeCheck,
//   Boxes,
//   CircleDollarSign,

//   ImageOff,
//   MapPin,
//   Wrench,
// } from "lucide-react";
// // import { cn } from "cn";
// import { cn } from "@/lib/utils";
// import type { Equipment } from "@/types/equipment";
// // import { useFavorites } from "@/hooks/useFavorites";
// import WishlistButton from '@/components/customer/WishlistButton'

// interface EquipmentCardProps {
//   equipment: Equipment;
//   index?: number;
// }

// const conditionStyles: Record<string, string> = {
//   excellent: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
//   "like new": "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
//   good: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
//   better: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
//   refurbished: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
// };

// const statusStyles: Record<string, string> = {
//   Approved: "bg-emerald-500/90 text-white",
//   Pending: "bg-red-500/90 text-white",
//   Rejected: "bg-destructive/90 text-white",
// };

// const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment }) => {
//   const [imageFailed, setImageFailed] = useState(false);
//   // const { isFavorite, toggleFavorite } = useFavorites();

//   const {
//     _id,
//     equipmentName,
//     equipmentImage,
//     category,
//     rentalPrice,
//     rentalType,
//     location,
//     availabilityStatus,
//     stock,
//     description,
//     // legacy (form) fallbacks
//     title,
//     price,
//     image,
//     condition,
//     status,
//   } = equipment;

//   const name = equipmentName ?? title ?? "Untitled equipment";
//   const imageUrl = equipmentImage ?? image;
//   const rate = rentalPrice ?? price;
//   const conditionKey = (condition ?? "").toLowerCase();
//   const hasImage = Boolean(imageUrl) && !imageFailed;
//   const isAvailable =
//     (availabilityStatus ?? "").trim().toLowerCase() === "available";

//   return (
//     <motion.div
//       whileHover={{ y: -8 }}
//       transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
//       className="h-full"
//     >
//       <Card className="group h-full gap-0 overflow-hidden py-0 ring-1 ring-foreground/10 transition-shadow duration-300 hover:shadow-2xl dark:ring-foreground/10">
//         {/* ---------- Image layer ---------- */}
//         <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
//           {hasImage ? (
//             // eslint-disable-next-line @next/next/no-img-element
//             <img
//               src={imageUrl}
//               alt={name}
//               onError={() => setImageFailed(true)}
//               className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
//             />
//           ) : (
//             <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
//               <ImageOff className="size-8" />
//               <span className="text-xs">No image available</span>
//             </div>
//           )}

//           {/* Category badge */}
//           {category && (
//             <span className="absolute top-3 left-3 rounded-full bg-[#FFC000] px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur">
//               {category}
//             </span>
//           )}

//           {/* Availability badge */}
//           {availabilityStatus && (
//             <span
//               className={cn(
//                 "absolute top-3 right-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur",
//                 isAvailable
//                   ? "bg-[#FFC000] font-bold"
//                   : "bg-amber-500/90 text-white",
//               )}
//             >
//               <BadgeCheck className="size-3" />
//               {availabilityStatus}
//             </span>
//           )}

//           {/* Favorite (heart) toggle */}
//           {/* <motion.button
//             type="button"
//             onClick={() => toggleFavorite(_id)}
//             whileTap={{ scale: 0.85 }}
//             aria-pressed={isFavorite(_id)}
//             aria-label={
//               isFavorite(_id)
//                 ? `Remove ${name} from favorites`
//                 : `Add ${name} to favorites`
//             }
//             title={
//               isFavorite(_id) ? "Remove from favorites" : "Add to favorites"
//             }
//             className={cn(
//               "absolute bottom-3 right-3 z-10 inline-flex size-9 items-center justify-center rounded-full border border-foreground/10 bg-red-500 shadow-md backdrop-blur transition-colors duration-200 outline-none",
//               isFavorite(_id)
//                 ? "bg-red-500 hover:text-blue-900"
//                 : "text-muted-foreground hover:text-blue-900",
//             )}
//           >
//             <Heart
//               className={cn(
//                 "size-5 transition-transform duration-200",
//                 isFavorite(_id) && "fill-current",
//               )}
//             />
//           </motion.button> */}
//           <span className="absolute bottom-3 right-3 z-10 bg-red-600 rounded-full"   >
//               <WishlistButton equipmentData = {equipment}/>
//           </span>
         
//         </div>

//         {/* ---------- Body layer ---------- */}
//         <CardHeader className="px-4 pt-4">
//           <div className="flex items-start justify-between gap-3">
//             <CardTitle className="line-clamp-1 text-base font-semibold">
//               {name}
//             </CardTitle>
//             {rate != null && (
//               <span className="flex shrink-0 flex-col items-end rounded-lg bg-[#FFC000] px-2 py-1">
//                 <span className="flex items-center gap-1  font-bold ">
//                   <CircleDollarSign className="size-3.5" />
//                   {rate}
//                 </span>
//                 {rentalType && (
//                   <span className="text-[10px] leading-tight text-black font-medium ">
//                      /{rentalType}
//                   </span>
//                 )}
//               </span>
//             )}
//           </div>
//           <CardDescription className="line-clamp-2">
//             {description}
//           </CardDescription>
//         </CardHeader>

//         <CardContent className="px-4 pt-2">
//           <div className="flex flex-wrap items-center gap-2 text-xs">
//             {location && (
//               <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 font-bold">
//                 <MapPin className="size-3" />
//                 {location}
//               </span>
//             )}
//             {condition && (
//               <span
//                 className={cn(
//                   "inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium",
//                   conditionStyles[conditionKey] ??
//                     "bg-muted text-muted-foreground",
//                 )}
//               >
//                 <Wrench className="size-3" />
//                 {condition}
//               </span>
//             )}
//             <span
//               className={cn(
//                 "inline-flex items-center gap-1 rounded-full px-2.5 py-1 ",
//                 (stock ?? 0) > 0
//                   ? "bg-muted "
//                   : "bg-destructive/10 text-destructive",
//               )}
//             >
//               <Boxes className="size-3" />
//               {(stock ?? 0) > 0 ? `${stock} in stock` : "Out of stock"}
//             </span>
//             {status && (
//               <span
//                 className={cn(
//                   "inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium",
//                   statusStyles[status] ?? "bg-muted text-muted-foreground",
//                 )}
//               >
//                 <BadgeCheck className="size-3" />
//                 {status}
//               </span>
//             )}
//           </div>
//         </CardContent>

//         {/* ---------- Footer layer ---------- */}
//         <CardFooter className="mt-auto border-t bg-muted/40 px-4 py-3">
//           <Button
//             render={<Link href={`/equipments/${_id}`} />}
//             variant="outline"
//             className="w-full justify-between text-black font-bold text-lg bg-[#FFC000] hover:text-white hover:bg-blue-950 "
//           >
//             View details
//             <ArrowRight className="transition-transform duration-300 group-hover/card:translate-x-1" />
//           </Button>
//         </CardFooter>
//       </Card>
//     </motion.div>
//   );
// };

// export default EquipmentCard;
