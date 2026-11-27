import React from 'react';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// Shape of an order returned by /api/admin/allorders
// 👉 adjust fields to match your actual API response
interface AdminOrder {
  id: string;
  userId?: string;
  productId?: string;
  total?: number;
  status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt?: string;
  // add more fields as needed
}

const AdminOverviewRentalsCard = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
//   const user = session?.user;
//   const userId = user?.id;
  // const customerEmail = user?.email;

  let totalOrdersData: AdminOrder[] = [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/allorders`,
      {
        cache: 'no-store',
        // headers: {
        //   Authorization: `Bearer ${tokenObj.token}`,
        // },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch orders: ${res.status} ${res.statusText}`);
    }

    totalOrdersData = (await res.json()) as AdminOrder[];
    console.log(totalOrdersData, 'total orders in adminoverview');
  } catch (error) {
    console.error('Orders fetch error:', error);
  }

  return (
    <div>
      <div className="card-body text-center  flex flex-col justify-center items-center gap-2">
        <h2 className="card-title">Total Orders</h2>
        <p className="text-2xl font-bold text-orange-700">
          {totalOrdersData.length || 0}
        </p>
      </div>
    </div>
  );
};

export default AdminOverviewRentalsCard;




// import React from 'react';
// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";

// const  AdminOverviewRentalsCard= async() => {
// // const tokenObj = await auth.api.getToken({
// //        headers: await headers()
// //      })
// //       console.log(tokenObj, "overviewOrder")


// const session = await auth.api.getSession({
//     headers: await headers(),
//   });
//   const user = session?.user;
//   const userId = user?.id;
// //    const CustomerEmail = user?.email;

//   // উইশলিস্ট ডেটা ফেচ (ঠিক উইশলিস্ট পেজের মতো)
//   let totalOrdersData = [];
//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/allorders`,
//       {
//         cache: 'no-store',
// //         headers:{
// //       Authorization: `Bearer ${tokenObj.token}`
// //    }
//       }
//     );
//     totalOrdersData  = await res.json();
//     console.log(totalOrdersData, 'total orders in adminoverview')
//   } catch (error) {
//     console.error('Orders fetch error:', error);
//   }



//     return (
//         <div>
//              <div className="card-body, text-center flex flex-col justify-center items-center gap-2  ">
//             <h2 className="card-title">Total Orders</h2>
//             <p className='text-2xl font-bold text-orange-700'>{totalOrdersData.length || 0}</p>  {/* কাউন্ট দেখানো */}
//           </div>
//         </div>
//     );
// };

// export default AdminOverviewRentalsCard;
