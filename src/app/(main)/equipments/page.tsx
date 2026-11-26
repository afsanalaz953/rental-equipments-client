import React, { Suspense } from "react";
import type { Equipment } from "@/types/equipment";
// import SearchBar from "@/components/shared/SearchBar";
import CategoryFilter from "@/components/shared/CategoryFilter";
import EquipmentCard from "@/components/equipments/EquipmentCard";
import SearchProducts from "@/components/admin/SearchProducts";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const AllEquipmentsPage = async ({ searchParams }: Props) => {
  const params = await searchParams;

  const search =
    typeof params?.search === "string" ? params.search.trim() : "";
  const category =
    typeof params?.category === "string" ? params.category.trim() : "";

  // 🔧 Build query string for /allequipments
  const qs = new URLSearchParams();
  if (search) qs.set("search", search);
  if (category && category !== "all") qs.set("category", category);

  const equipmentUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/allequipments${
    qs.toString() ? `?${qs.toString()}` : ""
  }`;

  // 🔧 Fetch equipments
  let allEquipments: Equipment[] = [];
  try {
    const res = await fetch(equipmentUrl, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    allEquipments = Array.isArray(data) ? data : data?.data ?? [];
  } catch (error) {
    console.error("Failed to load equipments", error);
  }

  // 🔧 Fetch categories (for filter chips)
  let categories: string[] = [];
  try {
    const catRes = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories`,
      { cache: "no-store" }
    );
    const catData = await catRes.json();
    const raw = Array.isArray(catData) ? catData : catData?.data ?? [];
    categories = raw
      .map((c: unknown) =>
        typeof c === "string"
          ? c
          : (c as { name?: string; category?: string })?.name ??
            (c as { category?: string })?.category ??
            ""
      )
      .filter((n: string) => n.length > 0);
  } catch (err) {
    console.error("Failed to load categories", err);
  }

  // 🔧 Heading text
  const count = allEquipments.length;
  const heading =
    search && category
      ? `${count} result${count === 1 ? "" : "s"} for "${search}" in ${category}`
      : search
      ? `${count} result${count === 1 ? "" : "s"} for "${search}"`
      : category
      ? `${count} ${category} equipment${count === 1 ? "" : "s"}`
      : `${count} equipments available for rent`;

  const emptyText =
    search || category
      ? `No equipment found${search ? ` for "${search}"` : ""}${
          category ? ` in ${category}` : ""
        }.`
      : "No equipments found.";

  return (
    <section className="container mx-auto bg-[#142A5E]  flex flex-col gap-6 px-4 py-10">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-[#FFC000]">All Equipments</h1>
        <p className="text-muted-foreground">{heading}</p>
      </div>

      {/* Filters */}
      <div className="flex  gap-4 md:flex-col md:items-center md:justify-between">
        <Suspense fallback={<div className="h-10 w-full md:w-64" />}>
          <CategoryFilter categories={categories} />
        </Suspense>

        <Suspense fallback={<div className="h-10 w-full md:w-64" />}>
          {/* <SearchBar /> */}
          <SearchProducts />
        </Suspense>
      </div>

      {/* Grid / Empty */}
      {allEquipments.length === 0 ? (
        <p className="py-10 text-center text-muted-foreground">{emptyText}</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allEquipments.map((equipment) => (
            <EquipmentCard key={equipment._id} equipment={equipment} />
          ))}
        </div>
      )}
    </section>
  );
};

export default AllEquipmentsPage;





