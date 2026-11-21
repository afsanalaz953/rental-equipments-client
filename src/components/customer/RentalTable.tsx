
import {
  Table,
} from "@heroui/react";
// import { div } from "framer-motion/client";
import CancelledButton from '@/components/customer/RentalCancelButton';
import OrderStatusBadge from '@/components/customer/OrderStatusBadge';
// import BuyerAcceptButton from '@/components/dashboard/BuyerAcceptButton';
// import BuyerPendingButton from '@/components/dashboard/BuyerPendingButton';

interface Booking {
  _id: string;
  title: string;
  sellerName: string;
  sellerEmail: string;
  price: number | string;
  metadata?: {
    quantity?: number;
    totalPrice?: number | string;
  };
  status: string;
  orderStatus: string;
  createdAt: string;
}

interface OrderTableProps {
  bookings: Booking[];
}

const RentalTable = ({ bookings }: OrderTableProps) => {
// const date = new Date(bookedData.createdAt);
// const formattedDate = date.toLocaleDateString
// console.log(formattedDate, "date");


  return (
    <div>
{/* ✅ Empty state check – put it here */}
      {!bookings || bookings.length === 0 ? (
        <div className="text-center m-6 p-10 bg-gray-100 rounded-lg shadow">
          <p className="text-gray-600 text-lg"> No bookings available yet.</p>
          <p className="text-gray-500">Click “Buy Product” to get started.</p>
        </div>
      ) : 

       ( <div className='shadow-lg'>

 <Table className='lg:w-min-700 bg-[#FFC000] my-10 md:`w-[760px]` '>
  {/* <Table.ScrollContainer>
    <Table.Content aria-label="Team members" className='p-4'>
      <Table.Header>
        {/* <Table.Column className= "font-bold text-lg">Photo</Table.Column> */}
        {/* <Table.Column className= "font-bold text-lg"  isRowHeader>Product Name</Table.Column>
        <Table.Column className= "font-bold text-lg">Quantity</Table.Column>
        <Table.Column className= "font-bold text-lg">Price</Table.Column>
        <Table.Column className= "font-bold text-lg">Total Price</Table.Column>
        {/* <Table.Column>booking Id</Table.Column>  */}
        {/* <Table.Column className= "font-bold text-lg" >Order Status</Table.Column>
        <Table.Column className= "font-bold text-lg" >Action</Table.Column> 
      </Table.Header>
      <Table.Body>
         {bookings && bookings.map((bookedData) => ( 
      
          <Table.Row key={bookedData?._id}>  */}
            {/* <Table.Cell>
              <Image
                src={bookedData.tutorImage}
                alt={bookedData.tutorName}
                width={50}
                height={50}
                className="rounded-full object-cover"
              />
            </Table.Cell> */}
            {/* <Table.Cell>{bookedData.title}</Table.Cell>
            <Table.Cell> {bookedData.quantity} </Table.Cell>
             {/* <Table.Cell>{bookedData._id}</Table.Cell>  */}
            {/* <Table.Cell>{bookedData.price}</Table.Cell>
            <Table.Cell>{bookedData.totalPrice}</Table.Cell>
            <Table.Cell className="" > {bookedData.status}</Table.Cell> 
           
              <Table.Cell className="flex gap-3 bg-white p-8">
                {bookedData.status === "pending" && (
                <CancelledButton 
                bookingId = {bookedData._id} 
                status={bookedData.status} 
                />
                )} */}
                 {/* {(bookedData.status === "approved" || bookedData.status === "accepted") && (
                      <Chip className="text-sm text-black bg-green-500 font-medium">
                        ⚠️ Cannot cancel (approved)
                      </Chip>
                    )}

                    {bookedData.status === "cancelled" && (
                      <Chip className="text-sm text-black bg-orange-500 font-medium">
                        ❌ Cancelled
                      </Chip>
                    )} */} 
                  {/* <BuyerAcceptButton bookingId = {bookedData._id} status={bookedData.status}   />    
                  <BuyerPendingButton bookingId = {bookedData._id} status={bookedData.status}   />    
                    */}
                       {/* </Table.Cell>
               */}
          
            {/* <Table.Cell className="" > {bookedData.status|| Cancelled}</Table.Cell>  */}
            {/* <Table.Cell> <Button bookingId = {bookedData._id} /> </Table.Cell> */}
            {/* <Table.Cell> <CancelledButton bookingId = {bookedData._id} status={bookedData.tutorStatus}  /> </Table.Cell> */}
          {/* </Table.Row>
        ))}
      </Table.Body>
    </Table.Content>
  </Table.ScrollContainer> */}

<Table.ScrollContainer>
    <Table.Content aria-label="Team members" className='p-4'>
      <Table.Header className='bg-[#142A5E] rounded'>
        {/* <Table.Column className= "font-bold text-lg">Photo</Table.Column> */}
        <Table.Column className= "font-bold text-lg">Equipment Name</Table.Column>
        <Table.Column className= "font-bold text-lg"  isRowHeader>Owner</Table.Column>
        <Table.Column className= "font-bold text-lg">Owner Email</Table.Column>
        <Table.Column className= "font-bold text-lg">Price</Table.Column>
        <Table.Column className= "font-bold text-lg">Quantity</Table.Column>
        <Table.Column className= "font-bold text-lg">Total Price</Table.Column>
        {/* <Table.Column>booking Id</Table.Column> */}
        <Table.Column className= "font-bold text-lg" >Status  </Table.Column>
        <Table.Column className= "font-bold text-lg" >Order Status  </Table.Column>
        <Table.Column className= "font-bold text-lg" >Order Date  </Table.Column>
        <Table.Column className= "font-bold text-lg" >Action </Table.Column>
      </Table.Header>
      <Table.Body>
         {bookings && bookings.map((orderedData) => ( 
       
          <Table.Row key={orderedData?._id}>
            {/* <Table.Cell>
              <Image
                src={orderedData.image}
                alt={orderedData.title}
                width={50}
                height={50}
                className="rounded-full object-cover"
              />
    
            </Table.Cell> */}
            <Table.Cell>{orderedData.title}</Table.Cell>
            <Table.Cell>{orderedData.ownerName}</Table.Cell>
            {/* <Table.Cell>{bookedData._id}</Table.Cell> */}
            <Table.Cell>{orderedData.ownerEmail}</Table.Cell> 
            <Table.Cell>$ {orderedData.price}</Table.Cell>
            <Table.Cell className="" > {orderedData.metadata?.quantity}</Table.Cell> 
            <Table.Cell className="" > {orderedData.metadata?.totalPrice}</Table.Cell> 
           
            <Table.Cell className="text-green-500" >  <OrderStatusBadge orderId={orderedData._id}
    currentStatus={orderedData.status}  /> </Table.Cell> 
             <Table.Cell className="" > {orderedData.orderStatus}</Table.Cell> 
             <Table.Cell className="" > {new Date(orderedData.createdAt).toLocaleDateString('en-GB')}</Table.Cell> 
           {/* <Table.Cell className='flex gap-2'> <BuyerAcceptButton orderId={orderedData._id} orderStatus={orderedData.orderStatus} />  
           < CancelledButton id={orderedData._id} />
            </Table.Cell>  */}
            <Table.Cell className='flex gap-2'>   
           < CancelledButton id={orderedData._id} orderStatus={orderedData.orderStatus}  />
            </Table.Cell> 
           
            {/* <Table.Cell className="" > {Success || Cancelled}</Table.Cell> */}
            {/* <Table.Cell> <Button bookingId = {bookedData._id} /> </Table.Cell> */}
            {/* <Table.Cell> <CancelledButton bookingId = {bookedData._id} status={bookedData.tutorStatus}  /> </Table.Cell> */}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Content>
  </Table.ScrollContainer>


</Table>
 
 </div>)
}


    </div>
    
  );
};

export default RentalTable;