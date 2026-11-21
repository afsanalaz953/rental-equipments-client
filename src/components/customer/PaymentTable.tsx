// import Link from "next/link";
import {
  Card,
  Table,
  TableContent,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button
} from "@heroui/react";
// import { div } from "framer-motion/client";

interface PaymentMetadata {
  title?: string;
  price?: number | string;
  quantity?: number | string;
  totalPrice?: number | string;
  [key: string]: unknown;
}

export interface Payment {
  _id: string;
  paymentIntentId: string;
  metadata?: PaymentMetadata;
  status: string;
  createdAt: string;
  [key: string]: unknown;
}

interface PaymentTableProps {
  payments?: Payment[];
}

const PaymentTable = ({ payments }: PaymentTableProps) => {
  

  return (
    <div>
{/* ✅ Empty state check – put it here */}
      {!payments || payments.length === 0 ? (
        <div className="text-center m-6 p-10 bg-gray-100 rounded-lg shadow">
          <p className="text-gray-600 text-lg"> No bookings available yet.</p>
          <p className="text-gray-500">Click “Buy Equipment” to get started.</p>
        </div>
      ) : 

       ( <div className='shadow-lg ml-10'>

 <Table className='lg:w-min-700 bg-[#FFC000] my-10 md:`w-[760px] ` '>
  <Table.ScrollContainer>
    <Table.Content aria-label="Team members" className='p-4'>
      <Table.Header className='bg-[#142A5E] text-white rounded'>
        {/* <Table.Column className= "font-bold text-lg">Photo</Table.Column> */}
        <Table.Column className= "font-bold text-lg"  isRowHeader>Transaction ID</Table.Column>
        <Table.Column className= "font-bold text-lg"  isRowHeader>Equipment Name</Table.Column>
       <Table.Column className= "font-bold text-lg">Price</Table.Column>
        <Table.Column>Quantity</Table.Column>
        <Table.Column className= "font-bold text-lg" >Status</Table.Column>
          <Table.Column className= "font-bold text-lg">Date</Table.Column>
        <Table.Column className= "font-bold text-lg" >Total Price</Table.Column>
      </Table.Header>
      <Table.Body>
         {payments && payments.map((paymentsData) => ( 
      
          <Table.Row key={paymentsData?._id}>
            {/* <Table.Cell>
              <Image
                src={bookedData.tutorImage}
                alt={bookedData.tutorName}
                width={50}
                height={50}
                className="rounded-full object-cover"
              />
            </Table.Cell> */}
            <Table.Cell>{paymentsData.paymentIntentId}</Table.Cell>
            <Table.Cell>{paymentsData.metadata?.title}</Table.Cell>
            <Table.Cell>{paymentsData.metadata?.price}</Table.Cell>
            <Table.Cell>{paymentsData.metadata?.quantity}</Table.Cell>
            <Table.Cell className="" > {paymentsData.status}</Table.Cell> 
             <Table.Cell>{new Date (paymentsData.createdAt).toLocaleDateString()}</Table.Cell>
             <Table.Cell>{paymentsData.metadata?.totalPrice}</Table.Cell>
            {/* <Table.Cell className="" > {Success || Cancelled}</Table.Cell>  */}
            {/* <Table.Cell> <Button bookingId = {bookedData._id} /> </Table.Cell> */}
            {/* <Table.Cell> <CancelledButton bookingId = {bookedData._id} 
            status={bookedData.tutorStatus}  /> </Table.Cell> */}
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

export default PaymentTable;