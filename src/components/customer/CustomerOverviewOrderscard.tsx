import React from 'react';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const CustomerOverviewOrderscard = async() => {
// const tokenObj = await auth.api.getToken({
//        headers: await headers()
//      })
//       console.log(tokenObj, "overviewOrder")


const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;
  const userId = user?.id;
//    const CustomerEmail = user?.email;

  // উইশলিস্ট ডেটা ফেচ (ঠিক উইশলিস্ট পেজের মতো)
  let totalOrdersData = [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/customer/myorders/${userId}`,
      {
        cache: 'no-store',
//         headers:{
//       Authorization: `Bearer ${tokenObj.token}`
//    }
      }
    );
    totalOrdersData  = await res.json();
    console.log(totalOrdersData, 'total orders in overview')
  } catch (error) {
    console.error('Orders fetch error:', error);
  }



    return (
        <div>
             <div className="card-body, text-center flex flex-col justify-center items-center gap-2  ">
            <h2 className="card-title">Total Orders</h2>
            <p className='text-2xl font-bold text-orange-700'>{totalOrdersData.length || 0}</p>  {/* কাউন্ট দেখানো */}
          </div>
        </div>
    );
};

export default CustomerOverviewOrderscard;