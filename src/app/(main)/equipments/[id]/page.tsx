import React from 'react';
import EquipmentDetails from "@/components/equipments/EquipmentDetails";
import type { Equipment } from "@/types/equipment";


interface DetailsProps {
  params: Promise<{ id: string }>;
}

const DetailsPage = async({params}: DetailsProps) => {
    const {id} = await params;
    console.log(id, 'id')

const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/equipments/${id}`,{
cache:"no-store",
// headers:{
//       authorization: `Bearer ${tokenObj.token}`
//    }
});

// if (!res.ok) {
//   throw new Error(`Failed to fetch event: ${res.status}`);
// }
// const detailsEvent = (await res.json()) as Event;
// console.log(detailsEvent,"single event detail")
if (!res.ok) {
  throw new Error(`Failed to fetch equip: ${res.status}`);
}

// ❶ বডি টেক্সট হিসেবে পড়ুন (খালি বডি সেফটি)
const text = await res.text();

// ❷ খালি বডি হলে সাথে সাথে এরর দিন
if (!text) {
  throw new Error("Empty response body from server");
}

const detailsEquip = JSON.parse(text) as Equipment | null;

// ❸ null হলে কার্ডে পাঠাবেন না
if (!detailsEquip) {
  return (
    <section className="container mx-auto px-4 py-10">
      <p className="text-center text-red-500">Equipments not found</p>
    </section>
  );
}

console.log(detailsEquip, "single equip detail");

    return (
        <div className="min-h-screen bg-[#142A5E]">
            <EquipmentDetails equipment={detailsEquip} />
        </div>
    );
};

export default DetailsPage;