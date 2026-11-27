import React from 'react';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// Define the shape of a user returned by your API
interface AdminUser {
  id: string;
  name?: string;
  email: string;
  role?: string;
  // 👉 add more fields here to match your /api/admin/users response
}

const AdminOverviewUsersCard = async () => {
  // (session isn't used below, but kept in case you need it later)
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  // const userId = session?.user?.id;
  // const customerEmail = session?.user?.email;

  let totalUsersData: AdminUser[] = [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/users`,
      {
        cache: 'no-store',
        // headers: {
        //   Authorization: `Bearer ${tokenObj.token}`,
        // },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch users: ${res.status} ${res.statusText}`);
    }

    totalUsersData = (await res.json()) as AdminUser[];
    console.log(totalUsersData, 'total users in adminoverview');
  } catch (error) {
    console.error('Users fetch error:', error);
  }

  return (
    <div>
      <div className="card-body text-center flex flex-col justify-center items-center gap-2">
        <h2 className="card-title">Total Users</h2>
        <p className="text-2xl font-bold text-orange-700">
          {totalUsersData.length || 0}
        </p>
      </div>
    </div>
  );
};

export default AdminOverviewUsersCard;




// import React from 'react';
// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";

// const  AdminOverviewUsersCard= async() => {
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
//   let totalUsersData = [];
//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/users`,
//       {
//         cache: 'no-store',
// //         headers:{
// //       Authorization: `Bearer ${tokenObj.token}`
// //    }
//       }
//     );
//     totalUsersData  = await res.json();
//     console.log(totalUsersData, 'total orders in adminoverview')
//   } catch (error) {
//     console.error('Orders fetch error:', error);
//   }



//     return (
//         <div>
//              <div className="card-body, text-center flex flex-col justify-center items-center gap-2  ">
//             <h2 className="card-title">Total Equipments</h2>
//             <p className='text-2xl font-bold text-orange-700'>{totalUsersData.length || 0}</p>  {/* কাউন্ট দেখানো */}
//           </div>
//         </div>
//     );
// };

// export default AdminOverviewUsersCard;
