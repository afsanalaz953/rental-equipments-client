"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Equipment } from "@/types/equipment";
import { cn } from "cn";
import {
  ArrowLeft,
  BadgeCheck,
  Boxes,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  ImageOff,
  Loader2,
  Mail,
  MapPin,
  PackageSearch,
  ShieldCheck,
  User,
  Wrench,
} from "lucide-react";

interface EquipmentDetailsProps {
  equipment: Equipment;
}

const conditionStyles: Record<string, string> = {
  excellent: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  "like new": "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  good: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  better: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  refurbished: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
};

/* ---------- animation variants ---------- */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/* ---------- date helpers ---------- */
const toDateInput = (d: Date) => d.toISOString().split("T")[0];

const daysBetween = (from: string, to: string) => {
  if (!from || !to) return 0;
  const diff = new Date(to).getTime() - new Date(from).getTime();
  return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
};

const EquipmentDetails: React.FC<EquipmentDetailsProps> = ({ equipment }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  // Booking form state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

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
    condition,
    status,
    ownerName,
    ownerEmail,
    createdAt,
    // legacy fallbacks
    title,
    price,
    image,
  } = equipment;

  const name = equipmentName ?? title ?? "Untitled equipment";
  const imageUrl = equipmentImage ?? image;
  const rate = rentalPrice ?? price;
  const conditionKey = (condition ?? "").toLowerCase();
  const hasImage = Boolean(imageUrl) && !imageFailed;
  const isAvailable =
    (availabilityStatus ?? "").trim().toLowerCase() === "available";
  const inStock = (stock ?? 0) > 0;
  const canBook = isAvailable && inStock;

  const today = useMemo(() => toDateInput(new Date()), []);

  const rentalDays = daysBetween(startDate, endDate);
  const estimatedTotal =
    rate != null && rentalDays > 0 ? rate * rentalDays * quantity : null;

  const resetForm = () => {
    setStartDate("");
    setEndDate("");
    setQuantity(1);
    setFullName("");
    setPhone("");
    setNotes("");
    setSubmitting(false);
    setConfirmed(false);
  };

  const handleBookNow = () => {
    // 👉 the full single-equipment info travels with this click into the modal
    resetForm();
    setBookingOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !fullName || !phone) return;

    setSubmitting(true);
    // 🚀 Replace this timeout with your real booking API call:
    // await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/bookings`, { method: "POST", body: JSON.stringify({ equipment, startDate, endDate, quantity, fullName, phone, notes }) })
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setConfirmed(true);
  };

  /* ---------- specs list ---------- */
  const specs = [
    {
      icon: MapPin,
      label: "Location",
      value: location ?? "Not specified",
    },
    {
      icon: Wrench,
      label: "Condition",
      value: condition ?? "Not specified",
      className: condition ? conditionStyles[conditionKey] : undefined,
    },
    {
      icon: Boxes,
      label: "Stock",
      value: inStock ? `${stock} unit${(stock ?? 0) > 1 ? "s" : ""}` : "Out of stock",
      className: inStock ? undefined : "text-destructive",
    },
    {
      icon: PackageSearch,
      label: "Category",
      value: category ?? "Uncategorized",
    },
    {
      icon: User,
      label: "Owner",
      value: ownerName ?? "—",
    },
    {
      icon: CalendarDays,
      label: "Listed on",
      value: createdAt
        ? new Date(createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "—",
    },
  ];

  return (
    <section className="min-h-screen bg-[#142A5E]">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        {/* ============ Back link ============ */}
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
          <Link
            href="/equipments"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-[#FFC000]"
          >
            <ArrowLeft className="size-4" />
            Back to equipments
          </Link>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3"
        >
          {/* ================= LEFT: main info ================= */}
          <motion.div variants={fadeUp} className="lg:col-span-2">
            {/* ---- Image ---- */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-muted ring-1 ring-white/10">
              {hasImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt={name}
                  onError={() => setImageFailed(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                  <ImageOff className="size-10" />
                  <span className="text-sm">No image available</span>
                </div>
              )}

              {/* Category badge */}
              {category && (
                <span className="absolute top-4 left-4 rounded-full bg-[#FFC000] px-3 py-1.5 text-xs font-bold text-foreground backdrop-blur">
                  {category}
                </span>
              )}

              {/* Availability badge */}
              <span
                className={cn(
                  "absolute top-4 right-4 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold backdrop-blur",
                  canBook
                    ? "bg-[#FFC000]"
                    : "bg-amber-500/90 text-white",
                )}
              >
                <BadgeCheck className="size-3.5" />
                {availabilityStatus ?? (canBook ? "Available" : "Unavailable")}
              </span>

              {/* Status badge (legacy approval status) */}
              {status && (
                <span
                  className={cn(
                    "absolute right-4 bottom-4 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold",
                    status === "Approved" && "bg-emerald-500/90 text-white",
                    status === "Pending" && "bg-amber-500/90 text-white",
                    status === "Rejected" && "bg-destructive/90 text-white",
                  )}
                >
                  <ShieldCheck className="size-3.5" />
                  {status}
                </span>
              )}
            </div>

            {/* ---- Title + price ---- */}
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <motion.h1
                variants={fadeUp}
                className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
              >
                {name}
              </motion.h1>

              {rate != null && (
                <motion.span
                  variants={fadeUp}
                  className="flex shrink-0 items-center gap-2 rounded-xl bg-[#FFC000] px-4 py-2 text-foreground"
                >
                  <CircleDollarSign className="size-5" />
                  <span className="text-2xl font-bold">{rate}</span>
                  {rentalType && (
                    <span className="text-sm font-medium">/ {rentalType}</span>
                  )}
                </motion.span>
              )}
            </div>

            {/* ---- Description ---- */}
            <motion.p
              variants={fadeUp}
              className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base"
            >
              {description ?? "No description provided for this equipment."}
            </motion.p>

            {/* ---- Specs grid ---- */}
            <motion.div
              variants={fadeUp}
              className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
            >
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3.5"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#FFC000]/15 text-[#FFC000]">
                    <spec.icon className="size-4.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium tracking-wide text-white/50 uppercase">
                      {spec.label}
                    </p>
                    <p
                      className={cn(
                        "truncate text-sm font-semibold text-white",
                        spec.className,
                      )}
                    >
                      {spec.value}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* ---- Owner contact strip ---- */}
            {(ownerName || ownerEmail) && (
              <motion.div
                variants={fadeUp}
                className="mt-4 flex flex-wrap items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70"
              >
                <span className="inline-flex items-center gap-2 font-semibold text-white">
                  <User className="size-4 text-[#FFC000]" />
                  Listed by {ownerName ?? "Owner"}
                </span>
                {ownerEmail && (
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="size-3.5" />
                    {ownerEmail}
                  </span>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* ================= RIGHT: booking card ================= */}
          <motion.aside variants={fadeUp} className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-white/10 bg-white p-6 shadow-2xl">
              {/* price row */}
              <div className="flex items-end justify-between border-b pb-4">
                <div>
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Rental price
                  </p>
                  <p className="mt-1 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-foreground">
                      {rate != null ? rate : "—"}
                    </span>
                    {rentalType && (
                      <span className="text-sm font-medium text-muted-foreground">
                        / {rentalType}
                      </span>
                    )}
                  </p>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold",
                    canBook
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      : "bg-amber-500/15 text-amber-600 dark:text-amber-400",
                  )}
                >
                  <Clock className="size-3.5" />
                  {canBook ? "Ready to rent" : "Unavailable"}
                </span>
              </div>

              {/* quick facts */}
              <ul className="mt-4 space-y-2.5 text-sm">
                <li className="flex items-center justify-between text-muted-foreground">
                  <span>Availability</span>
                  <span className="font-semibold text-foreground">
                    {availabilityStatus ?? "—"}
                  </span>
                </li>
                <li className="flex items-center justify-between text-muted-foreground">
                  <span>In stock</span>
                  <span
                    className={cn(
                      "font-semibold",
                      inStock ? "text-foreground" : "text-destructive",
                    )}
                  >
                    {inStock ? `${stock} units` : "Out of stock"}
                  </span>
                </li>
                <li className="flex items-center justify-between text-muted-foreground">
                  <span>Location</span>
                  <span className="font-semibold text-foreground">
                    {location ?? "—"}
                  </span>
                </li>
                <li className="flex items-center justify-between text-muted-foreground">
                  <span>Condition</span>
                  <span className="font-semibold text-foreground">
                    {condition ?? "—"}
                  </span>
                </li>
              </ul>

              {/* ==== BOOK NOW — carries the whole equipment payload ==== */}
              <motion.div whileHover={{ scale: canBook ? 1.02 : 1 }} whileTap={{ scale: canBook ? 0.97 : 1 }}>
                <Button
                  type="button"
                  disabled={!canBook}
                  onClick={handleBookNow}
                  data-equipment-id={_id}
                  className={cn(
                    "mt-5 h-12 w-full rounded-xl text-base font-bold shadow-lg transition-colors",
                    canBook
                      ? "bg-[#FFC000] text-black hover:bg-[#e6ad00]"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  <CalendarDays className="size-5" />
                  {canBook ? "Book Now" : "Not available"}
                </Button>
              </motion.div>

              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="size-3.5 text-emerald-500" />
                Free cancellation up to 24 hours before pickup
              </p>
            </div>
          </motion.aside>
        </motion.div>
      </div>

      {/* ================= BOOKING MODAL ================= */}
      <Dialog open={bookingOpen} onOpenChange={(open) => {
        setBookingOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <AnimatePresence mode="wait">
            {confirmed ? (
              /* ---------- Success state ---------- */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-3 py-6 text-center"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 16 }}
                >
                  <CheckCircle2 className="size-14 text-emerald-500" />
                </motion.span>
                <DialogTitle className="text-xl font-bold">
                  Booking requested!
                </DialogTitle>
                <DialogDescription>
                  Your request for <b>{name}</b> ({startDate} → {endDate}) has
                  been sent to the owner. You&apos;ll get a confirmation soon.
                </DialogDescription>
                <Button
                  type="button"
                  onClick={() => setBookingOpen(false)}
                  className="mt-2 bg-[#FFC000] text-black hover:bg-[#e6ad00]"
                >
                  Done
                </Button>
              </motion.div>
            ) : (
              /* ---------- Booking form ---------- */
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <DialogHeader>
                  <DialogTitle className="text-lg font-bold">
                    Book this equipment
                  </DialogTitle>
                  <DialogDescription>
                    Complete the form below to request a rental.
                  </DialogDescription>
                </DialogHeader>

                {/* ---- Equipment summary (info passed by Book Now) ---- */}
                <div className="mt-4 flex items-center gap-3 rounded-xl border bg-muted/50 p-3">
                  <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {hasImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imageUrl}
                        alt={name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <ImageOff className="size-5" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{name}</p>
                    <p className="text-xs text-muted-foreground">
                      {location ?? "—"} • {condition ?? "—"}
                    </p>
                  </div>
                  {rate != null && (
                    <span className="shrink-0 rounded-lg bg-[#FFC000] px-2 py-1 text-xs font-bold text-black">
                      {rate}/{rentalType ?? "unit"}
                    </span>
                  )}
                </div>

                {/* ---- Form ---- */}
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="startDate">Start date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        required
                        min={today}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="endDate">End date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        required
                        min={startDate || today}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min={1}
                        max={stock ?? 1}
                        required
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(Math.max(1, Number(e.target.value) || 1))
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+880 1XXX-XXXXXX"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="fullName">Full name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Your name"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="notes">Notes (optional)</Label>
                    <Input
                      id="notes"
                      type="text"
                      placeholder="Delivery address, special requests..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  {/* ---- Estimate ---- */}
                  <div className="flex items-center justify-between rounded-xl bg-[#142A5E] p-3.5 text-white">
                    <div>
                      <p className="text-[11px] font-medium tracking-wide text-white/60 uppercase">
                        Estimated total
                      </p>
                      <p className="text-xs text-white/70">
                        {rentalDays > 0
                          ? `${rentalDays} day${rentalDays > 1 ? "s" : ""} × ${quantity} unit${quantity > 1 ? "s" : ""}`
                          : "Select dates to calculate"}
                      </p>
                    </div>
                    <p className="text-xl font-bold text-[#FFC000]">
                      {estimatedTotal != null ? `$${estimatedTotal}` : "—"}
                    </p>
                  </div>

                  <DialogFooter className="sm:justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setBookingOpen(false)}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting || rentalDays <= 0}
                      className="bg-[#FFC000] text-black hover:bg-[#e6ad00]"
                    >
                      {submitting && <Loader2 className="size-4 animate-spin" />}
                      {submitting ? "Confirming..." : "Confirm booking"}
                    </Button>
                  </DialogFooter>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default EquipmentDetails;
