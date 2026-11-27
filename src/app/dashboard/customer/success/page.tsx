import { redirect } from 'next/navigation'
import { stripe } from '@/lib/stripe'
import SuccessTable from '@/components/customer/SuccessTable'


interface CustomerSuccessPageProps {
  searchParams: Promise<{ session_id?: string }>
}

export default async function customerSuccess({ searchParams }: CustomerSuccessPageProps) {
  const { session_id } = await searchParams

  if (!session_id) {
    throw new Error('Please provide a valid session_id (`cs_test_...`)')
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent'],
  })

  const { status, metadata, payment_intent, customer_details } = session
  const customerEmail = customer_details?.email ?? undefined

  if (status === 'open') {
    redirect('/')
  }

  if (status !== 'complete') {
    return (
      <section id="success" className="py-10 px-4">
        <p>Payment status: {status}</p>
      </section>
    )
  }

  // ---------- 1. Save payment record ----------
  const paymentData = {
    sessionId: session_id,
    customerEmail: metadata?.customerEmail,
    customerId: metadata?.customerId,
    title: metadata?.title,
    price: Number(metadata?.price ?? 0),
    totalPrice: Number(metadata?.totalPrice ?? 0),
    paymentIntentId: payment_intent?.id,
    status: 'paid',
    createdAt: new Date().toISOString(),
    metadata,
  }
console.log(paymentData, 'pay data in successpage')
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/checkout_sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData),
    })
    if (!res.ok) {
      console.error('❌ Payment API error:', await res.text())
    } else {
      console.log('✅ PaymentData saved:', await res.json())
    }
  } catch (error) {
    console.error('❌ Payment fetch error:', (error as Error).message)
  }

  // // ---------- 2. Idempotency check ----------
  let orderExists = false
  try {
    const checkRes = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders?sessionId=${session_id}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      }
    )
    if (checkRes.ok) {
      const existingOrders: unknown = await checkRes.json()
      orderExists = Array.isArray(existingOrders)
        ? existingOrders.length > 0
        : (existingOrders as { sessionId?: string } | null)?.sessionId === session_id
    }
  } catch (error) {
    console.error('❌ Error checking existing order:', (error as Error).message)
  }

  if (!orderExists) {
    // ---------- 3. Update stock ----------
    try {
      const stockRes = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/${metadata?.equipmentId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity: Number(metadata?.quantity) }),
        }
      )
      if (!stockRes.ok) {
        throw new Error(`Stock update failed: ${await stockRes.text()}`)
      }
      console.log('✅ Stock updated successfully')
    } catch (error) {
      console.error('❌ Stock update error:', (error as Error).message)
    }

    // ---------- 4. Create order ----------
    try {
      const ownerOrderData = {
        sessionId: session_id,
        customerEmail,
        customerId: metadata?.customerId,
        customerName: metadata?.customerName,
        ownerId: metadata?.ownerId,
        ownerName: metadata?.ownerName,
        ownerEmail: metadata?.ownerEmail,
        equipmentId: metadata?.equipmentId,
        title: metadata?.title,
        price: metadata?.price,
        quantity: metadata?.quantity,
        totalPrice: metadata?.totalPrice,
        orderStatus: 'pending',
        status: 'paid',
        metadata,
        createdAt: new Date(),
      }

      console.log('📦 customerOrder payload:', ownerOrderData)
// orders date enter to the ordercollection
      const resData = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ownerOrderData),
      })

      if (!resData.ok) {
        throw new Error(`Order save failed: ${await resData.text()}`)
      }
      console.log('✅ Order saved:', await resData.json())
    } catch (error) {
      console.error('❌ Order save error:', (error as Error).message)
    }
  } else {
    console.log('⏩ Order already exists. Skipping stock update and order creation.')
  }

  return (
    <section id="success" className="py-10 px-4">
      <SuccessTable customerEmail={customerEmail} metadata={metadata} />
    </section>
  )
}





// import { redirect } from 'next/navigation'
// import Link from 'next/link'
// // import { CheckCircle, ArrowRight, Leaf } from "lucide-react";
// import { stripe } from '@/lib/stripe'
// import { motion } from "framer-motion";
// import SuccessTable from '@/components/dashboard/SuccessTable'
// import { headers } from 'next/headers';
// import { auth } from "@/lib/auth";

// export default async function buyersuccess({ searchParams }) {
//   const { session_id } = await searchParams

//   if (!session_id)
//     throw new Error('Please provide a valid session_id (`cs_test_...`)')

// //  const tokenObj = await auth.api.getToken({
// //        headers: await headers()
// //      })
// //       console.log(tokenObj, 'sucessToken')


//   const {
//     status,
//      metadata,                     // ← add this
//   payment_intent,  
//     customer_details: { email: customerEmail }
//   } = await stripe.checkout.sessions.retrieve(session_id, {
//     expand: ['line_items', 'payment_intent']
//   })

//   if (status === 'open') {
//     return redirect('/')
//   }
//   //  price_data: {
//       //       currency: "usd",
//       //       unit_amount: Number(price) * 100,
//       //       product_data: {
//       //           name: title,
//       //       }
//       //     },
//       //     quantity: Number(quantity),
//       //   },
//       // ],
//       // metadata: {
//       //   price: Number(price),
//       //   totalPrice,
//       //   buyerId: user?.id,
//       //   buyerEmail: user?.email,
//       //   title,
//       //   productId,
//       //    quantity: Number(quantity),
         

//   if (status === 'complete') {
//  const paymentData = {
//     sessionId: session_id,
//     buyerEmail: metadata?.buyerEmail,
//     buyerId: metadata?.buyerId,
//     title : metadata?.title,
//     price: Number(metadata?.price || 0),
//     totalPrice: Number(metadata?.totalPrice || 0),
//     paymentIntentId: payment_intent?.id,
//     status: 'paid',
//     createdAt: new Date().toISOString(),
//     metadata,
//   };


//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/payments`, {
//       method: 'POST',
//       headers: { 'Content-Type':'application/json',
//         authorization: `Bearer ${tokenObj.token}`
//       },
//       body: JSON.stringify(paymentData),
//     });
//     if (!res.ok) {
//       const errorText = await res.text();
//       console.error('❌ Payment API error:', errorText);
//     } else {
//       const saved = await res.json();
//       console.log('✅ PaymentData saved for client:', saved);
//     }
//   } catch (error) {
//     console.error('❌ Fetch error:', error.message);
//   }

//   // orderData by stock updating
//   if (status === 'complete') {
//   // স্ট্রাইপ থেকে মেটাডেটা ও পেমেন্ট ইনটেন্ট নিন
//   const { metadata, payment_intent } = await stripe.checkout.sessions.retrieve(session_id, {
//     expand: ['payment_intent']
//   });

//   // কনসোলে লগ করে দেখুন ডেটা আসছে কিনা
//   console.log('✅ Metadata from Stripe:', metadata);
//   console.log('Product ID:', metadata?.productId);
//   console.log('Quantity:', metadata?.quantity);

//   // ১. স্টক আপডেট
//    let orderExists = false;
//    try {
//     const checkRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders?sessionId=${session_id}`, {
//       method: 'GET',
//       headers: { 
//         'Content-Type': 'application/json',
//         // authorization: `Bearer ${tokenObj.token}`
//       },
//       cache: 'no-store' // যাতে ক্যাশ থেকে পুরোনো ডেটা না আসে
//     });

//      if (checkRes.ok) {
//       const existingOrders = await checkRes.json();
//       // আপনার ব্যাকএন্ড API রেসপন্স ফরম্যাট অনুযায়ী নিচের লাইনটি চেক করুন
//       // যদি অ্যারে রিটার্ন করে: existingOrders.length > 0
//       // যদি অবজেক্ট রিটার্ন করে: existingOrders.sessionId === session_id
//       if (existingOrders && (Array.isArray(existingOrders) ? existingOrders.length > 0 : existingOrders.sessionId === session_id)) {
//         orderExists = true;
//         console.log('⚠️ Order already exists for this sessionId. Skipping creation.');
//       }
//     }
//   } catch (error) {
//     console.error('❌ Error checking existing order:', error.message);
//   }
// // Stock update
// if (!orderExists) {
//   try {
//     const stockRes = await fetch(
//       `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/${metadata.productId}`,
//       {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json',
//         //      authorization: `Bearer ${tokenObj.token}`,
//          },
//         body: JSON.stringify({ quantity: Number(metadata.quantity) }),
//       }
//     );

//     if (!stockRes.ok) {
//       const errorText = await stockRes.text();
//       throw new Error(`Stock update failed: ${errorText}`);
//     }
//     console.log('✅ Stock updated successfully');
//   } catch (error) {
//     console.error('❌ Stock update error:', error.message);
//     // চাইলে এখানে রিটার্ন করে দিতে পারেন, যাতে অর্ডার না হয়
//     // return redirect('/error?message=stock-update-failed');
//   }

//   // ২. অর্ডার তৈরি (সরাসরি metadata ব্যবহার করুন)
//   try {
//     const ownerOrderData = {
//       sessionId: session_id,
//       customerEmail,
// customerId: metadata?.customerId,
//       customerName: metadata?.customerName,
//       ownerId: metadata?.ownerId,
//      ownerName:metadata?.ownerName,
//       ownerEmail: metadata?.ownerEmail,
//       equipmentId: metadata?.equipmemtId,
//       title: metadata?.title,
//       price: metadata?.price,
//       quantity: metadata?.quantity,
//       totalPrice: metadata?.totalPrice,
//       orderStatus: 'pending',
//       status: 'paid',
//       metadata,
//       createdAt: new Date(), 
//     };

//     console.log('📦 customerOrder payload:', ownerOrderData);

//     const resData = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json',
//         //  authorization: `Bearer ${tokenObj.token}`
//        },
     
//       body: JSON.stringify(ownerOrderData),
//     });

//     if (!resData.ok) {
//       const errorText = await resData.text();
//       throw new Error(`Order save failed: ${errorText}`);
//     }
//     const saved = await resData.json();
//     console.log('✅ Order saved:', saved);
//   } catch (error) {
//     console.error('❌ Order save error:', error.message);
//   }
//  } else {
//       console.log('⏩ Order already exists. Skipping stock update and order creation.');
//   }
 



//     return (


//     //       </section>


//     <section id="success" className="py-10 px-4">
      
//       <SuccessTable
//        customerEmail={customerEmail} 
//     metadata={metadata} 
//       />
//     </section>
  




//     )
//   }
// }
// }