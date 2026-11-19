import React from "react";
import AllEquipmentsGrid from "@/components/equipments/AllEquipmentsGrid";
import type { Equipment } from "@/types/equipment";

const AllEquipmentsPage = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/allequipments`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch equipments: ${res.status}`);
  }

  const allEquipments: Equipment[] = await res.json();

  return (
    <div className="min-h-screen bg-background">
      <AllEquipmentsGrid initialData={allEquipments} />
    </div>
  );
};

export default AllEquipmentsPage;
