import React from 'react';
import { auth } from "@/lib/auth"; // path to your Better Auth server instance
import { headers } from "next/headers";
import { Table } from '@heroui/react';

// ---- Types ----
interface Order {
  _id: string;
  title: string;
  customerName: string;
  customerEmail: string;
  price: number;
  quantity: number;
  totalPrice: number;
  status?: string;
  orderStatus?: string;
  image?: string;
  metadata?: {
    quantity?: number;
    totalPrice?: number | string;
    rentalStartDate? : string;
    rentalEndtDate? : string;
    rentalType? : string;
    rentalDays? : string;
  };
}

const OwnerRentalsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;
  const ownerId = user?.id;
  const ownerName = user?.name;
  console.log(session, ownerId, ownerName, "ownerId");

  let orders: Order[] = [];

  if (ownerId) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/owner/orders?ownerId=${ownerId}`,
        { cache: 'no-store' }
      );

      // ❌ আগে ছিল: const orders = await res.json();  (shadowing!)
      // ✅ এখন বাইরের orders-এ assign
      orders = await res.json();

      console.log('✅ Fetched owner orders:', orders);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('❌ Fetch error:', message);
    }
  }

  return (
    <div>
      <h1 className="font-bold text-3xl m-10">My Orders List</h1>

      {orders.length === 0 ? (
        <div className="text-center m-6 p-10 bg-gray-100 rounded-lg shadow">
          <p className="text-gray-600 text-lg">No Orders available yet.</p>
          <p className="text-gray-500">Click “Book Products” to get started.</p>
        </div>
      ) : (
        <div className="shadow-lg">
          <Table className="lg:w-full bg-yellow-200 my-10 md:w-[760px]">
            <Table.ScrollContainer>
              <Table.Content aria-label="Owner orders" className="p-4">
                <Table.Header className='bg-[#142A5E]'>
                  <Table.Column className="font-bold text-lg">Equipment Name</Table.Column>
                  <Table.Column className="font-bold text-lg" isRowHeader>Customer</Table.Column>
                  <Table.Column className="font-bold text-lg">Customer Email</Table.Column>
                  <Table.Column className="font-bold text-lg">Price</Table.Column>
                  <Table.Column className="font-bold text-lg">Rental Type</Table.Column>
                  <Table.Column className="font-bold text-lg">Rental Duration</Table.Column>
                  <Table.Column className="font-bold text-lg">Quantity</Table.Column>
                  <Table.Column className="font-bold text-lg">Total Price</Table.Column>
                  <Table.Column className="font-bold text-lg">Payment Status</Table.Column>
                  <Table.Column className="font-bold text-lg">Booking Status</Table.Column>
                </Table.Header>
                <Table.Body>
                  {orders.map((orderedData) => (
                    <Table.Row key={orderedData._id}>
                      <Table.Cell>{orderedData.title}</Table.Cell>
                      <Table.Cell>{orderedData.customerName}</Table.Cell>
                      <Table.Cell>{orderedData.customerEmail}</Table.Cell>
                      <Table.Cell>$ {orderedData.price}</Table.Cell>
                      <Table.Cell>{orderedData.metadata?.rentalType}</Table.Cell>
                      <Table.Cell> {orderedData.metadata?.rentalDays} Days</Table.Cell>
                      <Table.Cell>{orderedData.quantity}</Table.Cell>
                      <Table.Cell>{orderedData.totalPrice}</Table.Cell>
                      <Table.Cell>
                        {orderedData.status}
                      </Table.Cell>
                      <Table.Cell>
                        {orderedData.orderStatus}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
        </div>
      )}
    </div>
  );
};

export default OwnerRentalsPage;







// import React from 'react';
// import { auth } from "@/lib/auth"; // path to your Better Auth server instance
// import { headers } from "next/headers";
// import Image from "next/image";
// import { Table } from '@heroui/react';
// // import OrderStatusBadge from "@/components/dashboard/OrderStatusBadge"
// // import SellerOrderAction from "@/components/dashboard/SellerOrderAction"
// //  import SellerOrderRejectButton from "@/components/dashboard/SellerOrderRejectButton";


// const OwnerRentalsPage = async() => {
// const session = await auth.api.getSession({
//      headers: await headers(), // you need to pass the headers object.
//  });
//  const user = session?.user;
// const ownerId = user?.id;
// const ownerName = user?.name;
// // const ownerEmail = user?.email;
// console.log(session, ownerId, ownerName, "sellerId")

// // from buyer manageorders
// // const buyerEmail = user?.email; // session থেকে ইমেইল
// // console.log(buyerEmail, "email")
//    let orders = [];

// //   const tokenObj = await auth.api.getToken({
// //        headers: await headers()
// //      })
// //       console.log(tokenObj, "sellerordertoken")


//   if (ownerId) {
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/owner/orders?ownerId=${ownerId}`,
//         { cache: 'no-store'
// //      headers:{
// //    authorization: `Bearer ${tokenObj.token}`
// //   }
//     });
// //       const sellerEmail = user?.email; // session থেকে ইমেইল নিন


//            const orders = await res.json();
//         console.log('✅ Fetched ownerordersbookings:', orders);
     
//     } catch (error) {
//       console.error('❌ Fetch error:', error.message);
//     }
//   }






//     return (
//         <div>
          
//            <h1 className='font-bold text-3xl m-10'> My Orders List</h1>
      
//       {!orders || orders.length === 0 ? (
//         <div className="text-center m-6 p-10 bg-gray-100 rounded-lg shadow">
//           <p className="text-gray-600 text-lg"> No Orders available yet.</p>
//           <p className="text-gray-500">Click “Book Products” to get started.</p>
//         </div>
//       ) : 

//        ( <div className='shadow-lg'>

//  <Table className='lg:w-full bg-yellow-200 my-10 md:w-[760px] '>
//   <Table.ScrollContainer>
//     <Table.Content aria-label="Team members" className='p-4'>
//       <Table.Header>
//         {/* <Table.Column className= "font-bold text-lg">Photo</Table.Column> */}
//         <Table.Column className= "font-bold text-lg">Equipment Name</Table.Column>
//         <Table.Column className= "font-bold text-lg"  isRowHeader>Customer</Table.Column>
//         <Table.Column className= "font-bold text-lg">Customer Email</Table.Column>
//         <Table.Column className= "font-bold text-lg">Price</Table.Column>
//         <Table.Column className= "font-bold text-lg">Quantity</Table.Column>
//         <Table.Column className= "font-bold text-lg">Total Price</Table.Column>
//         {/* <Table.Column>booking Id</Table.Column> */}
//         <Table.Column className= "font-bold text-lg" >Status  </Table.Column>
//         {/* <Table.Column className= "font-bold text-lg" >Order Status  </Table.Column> */}
//         {/* <Table.Column className= "font-bold text-lg" >Action </Table.Column> */}
//       </Table.Header>
//       <Table.Body>
//          {orders && orders.map((orderedData) => ( 
       
//           <Table.Row key={orderedData?._id}>
//             {/* <Table.Cell>
//               <Image
//                 src={orderedData.image}
//                 alt={orderedData.title}
//                 width={50}
//                 height={50}
//                 className="rounded-full object-cover"
//               />
    
//             </Table.Cell> */}
//             <Table.Cell>{orderedData.title}</Table.Cell>
//             <Table.Cell>{orderedData?.customerName}</Table.Cell>
//             {/* <Table.Cell>{bookedData._id}</Table.Cell> */}
//             {/* ata mone hoi meta customer */}
//             <Table.Cell>{orderedData.customerEmail}</Table.Cell> 
//             <Table.Cell>$ {orderedData.price}</Table.Cell>
//             <Table.Cell className="" > {orderedData.quantity}</Table.Cell> 
//             <Table.Cell className="" > {orderedData.totalPrice}</Table.Cell> 
          
//      {/* <Table.Cell className="text-green-500" >  <OrderStatusBadge  orderId={orderedData._id}
//     currentStatus={orderedData.status}  /> </Table.Cell>  
//              <Table.Cell className="" > {orderedData.orderStatus}</Table.Cell> 
//            {/* <Table.Cell className='flex gap-2'> <SellerOrderAction orderId={orderedData._id} orderStatus={orderedData.orderStatus} />  
//            <SellerOrderRejectButton  id={orderedData._id}  orderStatus={orderedData.orderStatus} />
//             </Table.Cell> 
           
//             {/* <Table.Cell className="" > {Success || Cancelled}</Table.Cell> */}
//             {/* <Table.Cell> <Button bookingId = {bookedData._id} /> </Table.Cell> */}
//             {/* <Table.Cell> <CancelledButton bookingId = {bookedData._id} status={bookedData.tutorStatus}  /> </Table.Cell> */}
//           </Table.Row>
//         ))}
//       </Table.Body>
//     </Table.Content>
//   </Table.ScrollContainer>
// </Table>
 
//  </div>)
// } 
//         </div>
//     );
// };

// export default OwnerRentalsPage;