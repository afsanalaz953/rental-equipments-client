"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  CircleDollarSign,
  ImageOff,
  MapPin,
  Wrench,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Equipment } from "@/types/equipment";
import WishlistButton from "@/components/customer/WishlistButton";

/* ---------- motion variants ---------- */
const gridContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const gridItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/* ---------- style maps ---------- */
const conditionStyles: Record<string, string> = {
  excellent: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  "like new": "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  good: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  better: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  refurbished: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
};

const statusStyles: Record<string, string> = {
  Approved: "bg-emerald-500/90 text-white",
  Pending: "bg-red-500/90 text-white",
  Rejected: "bg-destructive/90 text-white",
};

/* ---------- single card (EquipmentCard layout) ---------- */
const FeaturedEquipmentItem = ({ equipment }: { equipment: Equipment }) => {
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
                  <span className="text-[10px] leading-tight text-black font-medium">
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

/* ---------- grid wrapper ---------- */
interface FeaturedEquipmentsProps {
  equipments: Equipment[];
}

const FeaturedEquipments = ({ equipments }: FeaturedEquipmentsProps) => {
  const reduceMotion = useReducedMotion();

  const container: Variants = reduceMotion
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : gridContainer;
  const item: Variants = reduceMotion
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : gridItem;

  if (!equipments || equipments.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        No featured equipments right now—check back soon.
      </p>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {equipments.map((equip) => (
        <motion.div key={equip._id} variants={item} className="h-full">
          <FeaturedEquipmentItem equipment={equip} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FeaturedEquipments;






// "use client";

// import Link from "next/link";
// import { motion, useReducedMotion, type Variants } from "framer-motion";
// import { CalendarDays, Eye, MapPin } from "lucide-react";
// // import { format, isValid, parseISO } from "date-fns";
// import { Badge } from "@/components/ui/badge";
// import { buttonVariants } from "@/components/ui/button";
// import { Card, CardContent, CardFooter } from "@/components/ui/card";
// import type { Equipment } from "@/types/equipment";
// import { cn } from "@/lib/utils";

// const gridContainer: Variants = {
//   hidden: { opacity: 0 },
//   show: {
//     opacity: 1,
//     transition: { staggerChildren: 0.12, delayChildren: 0.1 },
//   },
// };

// const gridItem: Variants = {
//   hidden: { opacity: 0, y: 28 },
//   show: {
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.5, ease: "easeOut" },
//   },
// };

// // function formatEventDate(date?: string): string {
// //   if (!date) return "Date to be announced";
// //   const parsed = parseISO(date);
// //   return isValid(parsed) ? format(parsed, "EEE, MMM d, yyyy") : date;
// // }

// interface FeaturedEquipmentsProps {
//   equipments: Equipment[];
// }

// const FeaturedEvents = ({ equipments }: FeaturedEquipmentsProps) => {
//   const reduceMotion = useReducedMotion();

//   const container: Variants = reduceMotion
//     ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
//     : gridContainer;
//   const item: Variants = reduceMotion
//     ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
//     : gridItem;

//   if (equipments.length === 0) {
//     return (
//       <p className="py-12 text-center text-sm text-muted-foreground">
//         No featured equipments right now—check back soon.
//       </p>
//     );
//   }

//   return (
//     <motion.div
//       variants={container}
//       initial="hidden"
//       whileInView="show"
//       viewport={{ once: true, amount: 0.15 }}
//       className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
//     >
//       {equipments.map((equip) => {
//         const title = equip.equipmentName ?? equip.title ?? "Untitled";
//         const image =
//           equip.equipmentImage ?? equip.image ?? "/assets/banner.avif";
//         const location = equip.location ?? "Location to be announced";

//         return (
//           <motion.div
//             key={equip._id}
//             variants={item}
//             whileHover={reduceMotion ? undefined : { y: -6 }}
//             transition={{ type: "spring", stiffness: 300, damping: 22 }}
//             className="h-full"
//           >
//             <Card className="group h-full gap-0 overflow-hidden py-0 shadow-sm transition-shadow hover:shadow-xl">
//               {/* ---- Image + category ---- */}
//               <div className="relative aspect-4/3 w-full overflow-hidden">
//                 {/* eslint-disable-next-line @next/next/no-img-element */}
//                 <img
//                   src={image}
//                   alt={title}
//                   loading="lazy"
//                   className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
//                 />
//                 {equip.category && (
//                   <Badge className="absolute top-4 right-4 bg-[#D9F265] px-3 py-4 text-xs font-semibold text-[#1F3D2B]">
//                     {equip.category}
//                   </Badge>
//                 )}
//               </div>

//               {/* ---- Title, date, location ---- */}
//               <CardContent className="flex flex-1 flex-col gap-4 pt-5 pb-5">
//                 <h3 className="text-xl leading-snug font-bold text-foreground">
//                   {title}
//                 </h3>

//                 {/* {equip.createdAt && (
//                   <div className="flex items-center gap-3">
//                     <CalendarDays className="size-5 shrink-0 text-[#EB7036]" />
//                     <span className="text-sm font-semibold text-[#EB7036]">
//                       {formatEventDate(equip.createdAt)}
//                     </span>
//                   </div>
//                 )} */}

//                 <div className="flex items-start gap-3 text-muted-foreground">
//                   <MapPin className="mt-0.5 size-5 shrink-0" />
//                   <span className="text-sm">{location}</span>
//                 </div>
//               </CardContent>

//               {/* ---- View button ---- */}
//               <CardFooter className="border-t bg-transparent p-4">
//                 <Link
//                   href={`/equipments/${equip._id}`}
//                   className={cn(
//                     buttonVariants({ variant: "default", size: "lg" }),
//                     "h-11 w-full gap-2 rounded-xl bg-[#FFC000] text-sm font-semibold text-white hover:bg-[#d95f27]"
//                   )}
//                 >
//                   <Eye className="size-4" />
//                   View Equipment
//                 </Link>
//               </CardFooter>
//             </Card>
//           </motion.div>
//         );
//       })}
//     </motion.div>
//   );
// };

// export default FeaturedEvents;





// // "use client";

// // import Link from "next/link";
// // import { motion, useReducedMotion, type Variants } from "framer-motion";
// // import { CalendarDays, Eye, MapPin } from "lucide-react";
// // // import { format, isValid, parseISO } from "date-fns";
// // // import { Badge } from "@/components/ui/badge";
// // import { Button, buttonVariants } from "@/components/ui/button";
// // import { Card, CardContent, CardFooter } from "@/components/ui/card";
// // import type { Equipment } from "@/types/equipment";
// // import { cn } from "@/lib/utils";

// // const gridContainer: Variants = {
// //   hidden: { opacity: 0 },
// //   show: {
// //     opacity: 1,
// //     transition: { staggerChildren: 0.12, delayChildren: 0.1 },
// //   },
// // };

// // const gridItem: Variants = {
// //   hidden: { opacity: 0, y: 28 },
// //   show: {
// //     opacity: 1,
// //     y: 0,
// //     transition: { duration: 0.5, ease: "easeOut" },
// //   },
// // };

// // // function formatEventDate(date?: string) {
// // //   if (!date) return "Date to be announced";
// // //   const parsed = parseISO(date);
// // //   return isValid(parsed) ? format(parsed, "EEE, MMM d, yyyy") : date;
// // // }

// // // function formatEventLocation(location?: Event["location"]) {
// // //   const parts = [location?.venue, location?.area, location?.city].filter(
// // //     (part): part is string => Boolean(part),
// // //   );
// // //   return parts.length > 0 ? parts.join(", ") : "Location to be announced";
// // // }

// // interface FeaturedEventsProps {
// //   Equipment: equipment[];
// // }

// // const FeaturedEvents = ({ Equipment }: FeaturedEventsProps) => {
// //   const reduceMotion = useReducedMotion();

// //   const container: Variants = reduceMotion
// //     ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
// //     : gridContainer;
// //   const item: Variants = reduceMotion
// //     ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
// //     : gridItem;

// //   if (equipments.length === 0) {
// //     return (
// //       <p className="py-12 text-center text-sm text-muted-foreground">
// //         No featured events right now—check back soon.
// //       </p>
// //     );
// //   }

// //   return (
// //     <motion.div
// //       variants={container}
// //       initial="hidden"
// //       whileInView="show"
// //       viewport={{ once: true, amount: 0.15 }}
// //       className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
// //     >
// //       {equipments.map((equip) => (
// //         <motion.div
// //           key={equip._id}
// //           variants={item}
// //           whileHover={reduceMotion ? undefined : { y: -6 }}
// //           transition={{ type: "spring", stiffness: 300, damping: 22 }}
// //           className="h-full"
// //         >
// //           <Card className="group h-full gap-0 overflow-hidden py-0 shadow-sm transition-shadow hover:shadow-xl">
// //             {/* ---- Image + category ---- */}
// //             <div className="relative aspect-4/3 w-full overflow-hidden">
// //               {/* eslint-disable-next-line @next/next/no-img-element */}
// //               <img
// //                 src={equip.imageUrl ?? "/assets/banner.avif"}
// //                 alt={equip.title}
// //                 loading="lazy"
// //                 className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
// //               />
// //               {equip.category && (
// //                 <Badge className="absolute top-4 right-4 bg-[#D9F265] px-3 py-4 text-xs font-semibold text-[#1F3D2B]">
// //                   {equip.category}
// //                 </Badge>
// //               )}
// //             </div>

// //             {/* ---- Title, date, location ---- */}
// //             <CardContent className="flex flex-1 flex-col gap-4 pt-5 pb-5">
// //               <h3 className="text-xl leading-snug font-bold text-foreground">
// //                 {equip.title}
// //               </h3>

// //               <div className="flex items-center gap-3">
// //                 <CalendarDays className="size-5 shrink-0 text-[#EB7036]" />
// //                 <span className="text-sm font-semibold text-[#EB7036]">
// //                   {formatEventDate(equip.date)}
// //                 </span>
// //               </div>

// //               <div className="flex items-start gap-3 text-muted-foreground">
// //                 <MapPin className="mt-0.5 size-5 shrink-0" />
// //                 <span className="text-sm">{formatEventLocation(equip.location)}</span>
// //               </div>
// //             </CardContent>

// //             {/* ---- View button ---- */}
// //             <CardFooter className="border-t bg-transparent p-4">
// //               {/* <Button
// //                 render={<Link href={`/upcoming/${event._id}`} />}
// //                 className="h-11 w-full gap-2 rounded-xl bg-[#EB7036] text-sm font-semibold text-white hover:bg-[#d95f27]"
// //               >
// //                 <Eye className="size-4" />
// //                 View Event
// //               </Button> */}
// //               <Link
// //       href={`/equipments/${equip._id}`}
// //       className={cn(
// //         buttonVariants({ variant: "default", size: "lg" }),
// //         "h-11 w-full gap-2 rounded-xl bg-[#EB7036] text-sm font-semibold text-white hover:bg-[#d95f27]"
// //       )}
// //     >
// //       <Eye className="size-4" />
// //       View Event
// //     </Link>
// //             </CardFooter>
// //           </Card>
// //         </motion.div>
// //       ))}
// //     </motion.div>
// //   );
// // };

// // export default FeaturedEvents;
