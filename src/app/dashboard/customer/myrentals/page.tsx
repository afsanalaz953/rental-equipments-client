import React from 'react';
import { redirect } from 'next/navigation';
import RentalTable from '@/components/customer/RentalTable';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const CustomerRentalsPage = async () => {
const session = await auth.api.getSession({
     headers: await headers(), // you need to pass the headers object.
 });
 const user = session?.user;
 

  if (!user) {
    redirect('/signin');
  }
// const userId = user?.id;
//  const buyerId = userId;

//  const buyerEmail = user?.email;
 
console.log(session, "rental session")

//  const tokenObj = await auth.api.getToken({
//        headers: await headers()
//      })
// console.log(tokenObj, "buyerOrderBookingToken")

 let bookings = [];
 try{
const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/customer/myorders/${user?.id}`, {
  cache: 'no-store',

//   headers:{
//     Authorization: `Bearer ${tokenObj?.token}`
//      }    
});
   if (!res.ok) {
      console.error('❌ Order fetch failed:', res.status);
    } else {
 bookings = await res.json();
  }
  } catch (error) {
    console.error('❌ Order fetch error:', error instanceof Error ? error.message : error);
  }
 console.log(bookings, "bookings Data")


    return (
        <div>
            customers rental page
             <h1>My Order List  ({bookings.length}) </h1> 
           <div>
              <RentalTable bookings={bookings} />
              {/* ai props ta same same hobe both component and page. 
              means ordertable a je props pathiaso, sei props e hobe  */}
           </div>
        </div>
    );
};

export default CustomerRentalsPage;



    
 

   

