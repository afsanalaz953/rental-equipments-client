"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EquipmentCard from "@/components/equipments/EquipmentCard";
import type { Equipment } from "@/types/equipment";
import {
  LayoutGrid,
  Loader,
  RotateCcw,
  Search,
  SearchX,
  X,
} from "lucide-react";
import { cn } from "cn";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;

interface AllEquipmentsGridProps {
  initialData: Equipment[];
}

const AllEquipmentsGrid: React.FC<AllEquipmentsGridProps> = ({ initialData }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [equipments, setEquipments] = useState<Equipment[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // category options come from the backend data itself
  const categories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(
          initialData
            .map((item) => item.category)
            .filter((c): c is string => Boolean(c)),
        ),
      ),
    ],
    [initialData],
  );

  const hasSearched = Boolean(search.trim()) || category !== "All";

  // avoid race conditions between overlapping requests
  const requestIdRef = useRef(0);

  const fetchEquipments = useCallback(async (q: string, cat: string) => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set("search", q.trim());
      if (cat && cat !== "All") params.set("category", cat);

      const query = params.toString();
      const url = `${SERVER}/allequipments${query ? `?${query}` : ""}`;

      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      const data: Equipment[] = await res.json();
      if (requestId !== requestIdRef.current) return; // stale response

      setEquipments(Array.isArray(data) ? data : []);
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, []);

  // Debounced search — fires 450ms after the user stops typing.
  // Skips the first run: initial data is already provided by the server.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      void fetchEquipments(search, category);
    }, 450);
    return () => clearTimeout(timer);
  }, [search, category, fetchEquipments]);

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
  };

  return (
    <section className="mx-auto bg-[#142A5E] w-full max-w-7xl px-4 py-10 sm:px-6">
      {/* ============ Heading ============ */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8 text-center"
      >
        <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          <LayoutGrid className="size-3.5" />
          Browse inventory
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          All Equipments
        </h1>
        <p className="mt-2 max-w-xl mx-auto text-sm text-muted-foreground sm:text-base">
          Search and filter from our full catalog of rental equipments.
        </p>
      </motion.div>

      {/* ============ Search + filters ============ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8 space-y-4"
      >
        {/* Search bar */}
        <div className="relative mx-auto w-full max-w-xl">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search equipments by name..."
            aria-label="Search equipments"
            className="h-11 rounded-full pr-10 pl-10 text-base shadow-sm"
          />
          {search && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearch("")}
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => {
            const active = category === cat;
            return (
              <motion.button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                whileTap={{ scale: 0.94 }}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors duration-200 outline-none",
                  active
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground",
                )}
              >
                {cat}
              </motion.button>
            );
          })}
        </div>

        {/* Result meta / clear */}
        <div className="flex min-h-6 items-center justify-center gap-3 text-sm text-muted-foreground">
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader className="size-4 animate-spin" />
              Searching...
            </span>
          ) : (
            <>
              <span className="text-white">
                {equipments.length}{" "}
                {equipments.length === 1 ? "equipment" : "equipments"} found
              </span>
              {hasSearched && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1 text-white underline-offset-4 transition-colors hover:underline"
                >
                  <RotateCcw className="size-3.5 text-white" />
                  Reset filters
                </button>
              )}
            </>
          )}
        </div>
      </motion.div>

      {/* ============ Error state ============ */}
      {error && (
        <div className="mx-auto mb-8 max-w-md rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center">
          <p className="font-medium text-destructive">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => fetchEquipments(search, category)}
          >
            <RotateCcw className="size-4" />
            Try again
          </Button>
        </div>
      )}

      {/* ============ Empty state ============ */}
      {!loading && !error && equipments.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-12 text-center"
        >
          <SearchX className="size-10 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">
            No equipments found
          </h2>
          <p className="text-sm text-muted-foreground">
            Try a different search term or clear the filters.
          </p>
          <Button variant="outline" className="mt-2" onClick={clearFilters}>
            <RotateCcw className="size-4" />
            Reset filters
          </Button>
        </motion.div>
      )}

      {/* ============ 3-layer responsive grid ============ */}
      {equipments.length > 0 && (
        <div
          className={cn(
            "transition-opacity duration-300",
            loading ? "pointer-events-none opacity-50" : "opacity-100",
          )}
        >
          <motion.div
            layout
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 space-y-4"
          >
            <AnimatePresence mode="popLayout">
              {equipments.map((equipment, index) => (
                <motion.div
                  key={equipment._id}
                  layout
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{
                    duration: 0.35,
                    delay: Math.min(index * 0.05, 0.4),
                  }}
                  className="h-full"
                >
                  <EquipmentCard equipment={equipment} index={index} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default AllEquipmentsGrid;
