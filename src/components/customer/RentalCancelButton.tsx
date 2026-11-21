"use client";
import { useState } from "react";
import {  toast } from 'react-toastify';
import { AlertDialog, Button} from "@heroui/react";
import { useRouter } from "next/navigation";

interface CancelledBookingButtonProps {
  id: string;
  orderStatus: string;
}

const RentalCancelButton = ({ id, orderStatus }: CancelledBookingButtonProps) => {
   const router = useRouter(); 
 const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
   
const handleCancelBooking = async (): Promise<void> => { 
//     const {data:tokenData} = await authClient.token()
//   console.log(tokenData, "tokendata")
setIsLoading(true);

try{    
const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/${id}`,{
method: "PATCH",
headers:{
    "content-type" : "application/json"},
//  authorization: `Bearer ${tokenData?.token}`
 body: JSON.stringify({ orderStatus: "cancelled" })
});

const data = await res.json();
console.log(data, 'buyercancelledData');
// window.location.reload();
if (res.ok)  {
 toast.success('Order cancelled');
                // duration: 2000,
                // position: 'top-center'})

       router.refresh();           

}else{
   toast.error(data.message || 'problem in cancel');  
     }
    } catch (error) {
      toast.error('try later');
    }
    finally {
      setIsLoading(false);
    }
}

if(orderStatus === "cancelled"){
     return <Button variant="danger" isDisabled>Cancelled</Button>; 
}
if (orderStatus !== 'pending') {
  return <Button variant="danger" isDisabled>Cancel</Button>; // অথবা <span>Cannot cancel</span>
}



return (
        
        <AlertDialog>
            
             <AlertDialog.Trigger>
                <Button variant="danger">Cancel</Button> 
             </AlertDialog.Trigger>
           <AlertDialog.Backdrop>
                <AlertDialog.Container>
                    <AlertDialog.Dialog className="sm:max-w-100">
                        <AlertDialog.CloseTrigger />
                        <AlertDialog.Header>
                            <AlertDialog.Icon orderStatus="danger" />
                            <AlertDialog.Heading>Confirm Cancellation</AlertDialog.Heading>
                        </AlertDialog.Header>
                        <AlertDialog.Body>
                            <p className="text-slate-600">
                                Are you sure you want to cancel this enrollment? This action cannot be undone and you
                                will lose access to the course materials.
                            </p>
                        </AlertDialog.Body>
                        <AlertDialog.Footer>
                            <Button
                                slot="close"
                                variant="tertiary"
                            >
                                Keep Booking
                            </Button>
                            <Button
                            onClick = { handleCancelBooking }
                                slot="close"
                                color="danger"
                                className="font-bold"

                            >
                                Yes, Cancel
                            </Button>
                             
                        </AlertDialog.Footer>
                    </AlertDialog.Dialog>
                </AlertDialog.Container>
            </AlertDialog.Backdrop>
        </AlertDialog>
    );
};

export default RentalCancelButton;