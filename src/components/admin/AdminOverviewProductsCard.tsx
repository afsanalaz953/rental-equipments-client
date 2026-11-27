import React from 'react';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// Shape of a product returned by /api/admin/products/all
// 👉 adjust fields to match your actual API response
interface AdminProduct {
  id: string;
  name: string;
  price?: number;
  category?: string;
  image?: string;
  stock?: number;
  // add more fields as needed
}

const AdminOverviewProductsCard = async () => {
  // session kept for parity / future use
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  // const userId = session?.user?.id;
  // const customerEmail = session?.user?.email;

  let totalProductsData: AdminProduct[] = [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/products/all`,
      {
        cache: 'no-store',
        // headers: {
        //   Authorization: `Bearer ${tokenObj.token}`,
        // },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
    }

    totalProductsData = (await res.json()) as AdminProduct[];
    console.log(totalProductsData, 'total products in adminoverview');
  } catch (error) {
    console.error('Products fetch error:', error);
  }

  return (
    <div>
      <div className="card-body text-center flex flex-col justify-center items-center gap-2">
        <h2 className="card-title">Total Equipments</h2>
        <p className="text-2xl font-bold text-orange-700">
          {totalProductsData.length || 0}
        </p>
      </div>
    </div>
  );
};

export default AdminOverviewProductsCard;




// import React from 'react';
// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";

// const  AdminOverviewProductsCard= async() => {
// // const tokenObj = await auth.api.getToken({
// //        headers: await headers()
// //      })
// //       console.log(tokenObj, "overviewOrder")


// const session = await auth.api.getSession({
//     headers: await headers(),
//   });
// //   const user = session?.user;
// //   const userId = user?.id;
// //    const CustomerEmail = user?.email;

//   // উইশলিস্ট ডেটা ফেচ (ঠিক উইশলিস্ট পেজের মতো)
//   let totalProductsData = [];
//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/products/all`,
//       {
//         cache: 'no-store',
// //         headers:{
// //       Authorization: `Bearer ${tokenObj.token}`
// //    }
//       }
//     );
//     totalProductsData  = await res.json();
//     console.log(totalProductsData, 'total orders in adminoverview')
//   } catch (error) {
//     console.error('Orders fetch error:', error);
//   }



//     return (
//         <div>
//              <div className="card-body, text-center flex flex-col justify-center items-center gap-2  ">
//             <h2 className="card-title">Total Equipments</h2>
//             <p className='text-2xl font-bold text-orange-700'>{totalProductsData.length || 0}</p>  {/* কাউন্ট দেখানো */}
//           </div>
//         </div>
//     );
// };

// export default AdminOverviewProductsCard;
