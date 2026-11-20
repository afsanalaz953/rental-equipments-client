
import { headers } from 'next/headers';
import React from 'react';
import { auth } from '@/lib/auth';
import MyEquipmentsTable from '@/components/equipments/MyEquipmentsTable';
import type { Equipment } from '@/types/equipment';


interface EquipList extends Equipment {
  imageUrl?: string;
  userId?: string;
}


const OwnerEquipmentsPage =async () => {

const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
 });
 const user = session?.user
  // সেশন না থাকলে এরর বা রিডাইরেক্ট
  if (!user) {
    console.error("No session found");
    return <div>Unauthorized: Please login</div>;
  }
console.log(session, "myequipsession")
// server-side a token
//   const tokenObjData = await auth.api.getToken({
//         headers: await headers()
//     })
//      console.log(tokenObjData, "ManageTokenData")

const res = await fetch (`${process.env.NEXT_PUBLIC_SERVER_URL}/owner/myequipments/${user?.id}`,{
  cache: 'no-store',
//    headers:{
//      authorization: `Bearer ${tokenObjData.token}`
      
//  }
});


 if (!res.ok) {
    const errorText = await res.text();
    console.error(`API error ${res.status}: ${errorText}`);
    return <div>Failed to load equips</div>;
  }


const myEquipmentsList: EquipList[] = await res.json()
console.log(myEquipmentsList, "owner equip list")


    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-6">
            <h1 className="text-2xl font-bold text-blue-800 text-center my-2">
                My Equipments
            </h1>

            <MyEquipmentsTable equipments={myEquipmentsList} />
        </div>
    );
};

export default OwnerEquipmentsPage;