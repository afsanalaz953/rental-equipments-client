import React from 'react';
import PaymentTable, { type Payment } from '@/components/customer/PaymentTable';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// interface TokenObj {
//   token: string;
// }

const CustomerPaymentPage = async (): Promise<React.JSX.Element> => {

// const tokenObj = (await auth.api.getToken({
//        headers: await headers()
//      })) as TokenObj;
//       console.log(tokenObj, "buyerpaymentToken")

    const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;
  const customerEmail: string | undefined = user?.email; // session থেকে ইমেইল

  let payments: Payment[] = [];

  if (customerEmail) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/customer/payment?customerEmail=${encodeURIComponent(customerEmail)}`,
        { cache: 'no-store',
//         headers:{
//       authorization: `Bearer ${tokenObj.token}`
//    }
    });

      if (!res.ok) {
        console.error(`API Error: ${res.status}`);
      } else {
        payments = (await res.json()) as Payment[];
        console.log('✅ Fetched bookings:', payments);
      }
    } catch (error: unknown) {
      console.error('❌ Fetch error:', (error as Error).message);
    }
  }

    return (
        <div>
<h1>Payment History ({payments.length})</h1>
      <PaymentTable payments={ payments } /> 
            
        </div>
    );
}; 

export default CustomerPaymentPage;





// import React from 'react';
// import PaymentTable from '@/components/customer/PaymentTable';
// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";

// interface PaymentProps{
//   id: string;
//   amount?: number;
//   status?: string;
//   [key: string]: unknown;
// }

// // interface TokenObj {
// //   token: string;
// // }

// const CustomerPaymentPage = async (): Promise<React.JSX.Element> => {

// // const tokenObj = (await auth.api.getToken({
// //        headers: await headers()
// //      })) as TokenObj;
// //       console.log(tokenObj, "buyerpaymentToken")

//     const session = await auth.api.getSession({
//     headers: await headers(),
//   });
//   const user = session?.user;
//   const customerEmail: string | undefined = user?.email; // session থেকে ইমেইল

//   let payments: PaymentProps[] = [];

//   if (customerEmail) {
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_SERVER_URL}/api/customer/payment?customerEmail=${encodeURIComponent(customerEmail)}`,
//         { cache: 'no-store',
// //         headers:{
// //       authorization: `Bearer ${tokenObj.token}`
// //    }
//     });

//       if (!res.ok) {
//         console.error(`API Error: ${res.status}`);
//       } else {
//         payments = (await res.json()) as PaymentProps[];
//         console.log('✅ Fetched bookings:', payments);
//       }
//     } catch (error: string) {
//       console.error('❌ Fetch error:', error.message);
//     }
//   }

//     return (
//         <div>
// <h1>Payment History ({payments.length})</h1>
//       <PaymentTable payments={ payments } /> 
            
//         </div>
//     );
// }; 

// export default CustomerPaymentPage;