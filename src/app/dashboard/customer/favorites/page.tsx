import React from 'react';


import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface WishlistItem {
  _id: string;
  [key: string]: any;
}

const Wishlistpage = async () => {
//   const tokenObj = await auth.api.getToken({
//     headers: await headers()
//   });
//   console.log(tokenObj, "wishToken");

  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  const user = session?.user;
  //  const buyerId = user?.id;
  const userId = user?.id;
//   const customerId = userId;

//   if (!userId || !tokenObj?.token) {
 if (!userId ) {
    return (
      <div className="text-center text-red-500 text-xl mt-10">
        please log in
      </div>
    );
  }

  // ৪. API কল করুন (এরর হ্যান্ডলিং যোগ করলাম)
  let wishlistData: WishlistItem[] = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/wishlist/${encodeURIComponent(userId)}`, {
      cache: 'no-store',
    //   headers: {
    //     authorization: `Bearer ${tokenObj?.token}`
    //   }
    });

    // রেসপন্স চেক করুন
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    wishlistData = Array.isArray(data) ? data : []; // অ্যারে নিশ্চিত করুন
    console.log(wishlistData, "wishlist Data")
  } catch (error) {
    console.error("Error in wishlist:", error);
    wishlistData = [];
  }

  // ৫. UI রেন্ডার (খালি অবস্থা হ্যান্ডেল করুন)
  return (
    <div className="container mx-auto px-4 py-8">
      
    </div>

   
  );
};

export default Wishlistpage;