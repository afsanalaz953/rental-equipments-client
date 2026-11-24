"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "cn";
import type { Equipment } from "@/types/equipment";
import {
  Eye,
  ImageOff,
  PackageSearch,
 
  
} from "lucide-react";
import Link from "next/link";
import UpdateModal from '@/components/owner/UpdateModal';
import OwnerDeleteButton  from '@/components/owner/OwnerDeleteButton';


type MyEquipmentRow = Equipment & { imageUrl?: string };

 

interface MyEquipmentsTableProps {
  equipments: MyEquipmentRow[];
}

/* ---------- helpers ---------- */
const conditionStyles: Record<string, string> = {
  excellent: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  "like new": "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  good: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  better: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  refurbished: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
};

const statusStyles: Record<string, string> = {
  Pending: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  Approved: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  Rejected: "bg-red-500/15 text-red-600 dark:text-red-400",
};

const formatPrice = (price?: number) => {
  if (typeof price !== "number" || Number.isNaN(price)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
};

const formatDate = (date?: string) => {
  if (!date) return "—";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/* ---------- animation variants ---------- */
const rowVariants = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const actionButton = {
  rest: { scale: 1 },
  hover: { scale: 1.12 },
  tap: { scale: 0.92 },
};

/* ---------- component ---------- */
const MyEquipmentsTable = ({ equipments }: MyEquipmentsTableProps) => {
  if (equipments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-card px-6 py-16 text-center">
        <PackageSearch className="size-10 text-muted-foreground" />
        <div>
          <p className="text-base font-semibold text-foreground">
            No equipment added yet
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Equipment you add will show up here as a list.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Added Equipment
          </h2>
          <p className="text-sm text-muted-foreground">
            {equipments.length}{" "}
            {equipments.length === 1 ? "item" : "items"} in your list
          </p>
        </div>
      </div>

      <Table className="min-w-[1100px]">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12 text-center">#</TableHead>
            <TableHead>Equipment</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-center">Stock</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead className="min-w-[200px]">Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Added On</TableHead>
            {/* <TableHead>id</TableHead> */}
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {equipments.map((product, index) => {
            const imageUrl = product.equipmentImage ?? product.image ?? product.imageUrl;
            const condition = product.condition?.toLowerCase();

            return (
              <motion.tr
                key={product._id}
                custom={index}
                variants={rowVariants}
                initial="hidden"
                animate="show"
                whileHover={{ backgroundColor: "rgba(120,120,120,0.06)" }}
                className="align-top"
              >
                {/* index */}
                <TableCell className="text-center text-muted-foreground">
                  {index + 1}
                </TableCell>

                {/* image + title */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="size-11 shrink-0 overflow-hidden rounded-lg border bg-muted">
                      {imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={imageUrl}
                          alt={product.title ?? "Equipment"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ImageOff className="size-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <span className="font-medium text-foreground">
                      {product.title ?? "Untitled equipment"}
                    </span>
                  </div>
                </TableCell>

                {/* category */}
                <TableCell className="text-muted-foreground">
                  {product.category ?? "—"}
                </TableCell>

                {/* price */}
                <TableCell className="font-medium text-foreground">
                  {formatPrice(product.price)}
               
                </TableCell>

                {/* stock */}
                <TableCell className="text-center text-muted-foreground">
                  {product.stock ?? "—"}
                </TableCell>

                {/* condition */}
                <TableCell>
                  {product.condition ? (
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                        conditionStyles[condition ?? ""] ??
                          "bg-muted text-muted-foreground",
                      )}
                    >
                      {product.condition}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>

                {/* description */}
                <TableCell>
                  <p className="line-clamp-2 max-w-[240px] whitespace-normal text-muted-foreground">
                    {product.description ?? "—"}
                  </p>
                </TableCell>

                {/* status */}
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                      statusStyles[product.status ?? ""] ??
                        "bg-muted text-muted-foreground",
                    )}
                  >
                    {product.status ?? "—"}
                  </span>
                </TableCell>

                {/* owner */}
                <TableCell>
                  <p className="font-medium text-foreground">
                    {product.ownerName ?? "—"}
                  </p>
                  {product.ownerEmail ? (
                    <p className="text-xs text-muted-foreground">
                      {product.ownerEmail}
                    </p>
                  ) : null}
                </TableCell>

                {/* added on */}
                <TableCell className="text-muted-foreground">
                  {formatDate(product.createdAt)}
                </TableCell>

                {/* actions */}
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <motion.div
                      initial="rest"
                      animate="rest"
                      whileHover="hover"
                      whileTap="tap"
                      variants={actionButton}
                    >
                        <Link href={`/equipments/${product._id}`} aria-label="View equipment">
                      <Button
                        size="sm"
                        variant="outline"
                        aria-label="View equipment"
                        className="gap-1.5 text-emerald-600 hover:text-emerald-600 dark:text-emerald-400"
                      >
                        
                        <Eye />
                        View
                      </Button>
                      </Link>
                    </motion.div>
{/* <TableCell> {product._id}  </TableCell> */}
                    <motion.div
                      initial="rest"
                      animate="rest"
                      whileHover="hover"
                      whileTap="tap"
                      variants={actionButton}
                      className="bg-blue-500"
                    >
                      {/* <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        aria-label="Update equipment"
                        className="gap-1.5 text-sky-600 hover:text-sky-600 dark:text-sky-400"
                      > */}
                        {/* <PencilLine /> */}
                        
                      {/* </Button> */}
                      <UpdateModal product ={product} />
                    </motion.div>

                    <motion.div
                      initial="rest"
                      animate="rest"
                      whileHover="hover"
                      whileTap="tap"
                      variants={actionButton}
                    >
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        aria-label="Delete equipment"
                        className="gap-1.5"
                      >
                        {/* <Trash2 /> */}
                        <OwnerDeleteButton  productId ={product._id} />
                      </Button>
                    </motion.div>
                  </div>
                </TableCell>
              </motion.tr>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default MyEquipmentsTable;
