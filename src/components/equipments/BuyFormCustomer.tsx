"use client";

import React, { useState } from "react";
import { Button, Input, Label, Modal, Surface, TextField } from "@heroui/react";
import { authClient } from "@/lib/auth-client";

/* ---------- Types ---------- */
interface SingleEquip {
  _id: string;
  title: string;
  price: number | string;
  stock: number | string;
  ownerName: string;
  ownerId: string;
  ownerEmail: string;
}

interface BuyFormCustomerProps {
  singleEquip: SingleEquip;
  action: React.ComponentProps<"form">["action"];   // string | Server Action
  method?: React.ComponentProps<"form">["method"];   // "get" | "post"
}

/* ---------- Component ---------- */
export default function BuyFormCustomer({
  singleEquip,
  action,
  method = "post",
}: BuyFormCustomerProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);

  const stock = Number(singleEquip.stock) || 0;
  const price = Number(singleEquip.price) || 0;
  const totalPrice = Number((price * quantity).toFixed(2));

  const defaultName = user?.name ?? "";
  const defaultEmail = user?.email ?? "";
  const { title } = singleEquip;

  /* Form submit — React নিজেই action handle করবে, preventDefault/submit() দরকার নেই */
  const handleBuying = (): void => {
    setIsLoading(true);
  };

  /* Quantity change handler — HeroUI TextField এর onChange string দেয় */
  const handleQuantityChange = (value: string): void => {
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) return;
    setQuantity(Math.min(Math.max(parsed, 1), stock || 1));
  };

  return (
    <div>
      <Button className="w-full" onPress={() => setIsOpen(true)}>
        Buy Product
      </Button>

      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <Modal.Backdrop>
          <Modal.Container placement="auto">
            <Modal.Dialog className="sm:max-w-md">
              <Modal.CloseTrigger />

              <Modal.Header>
                <Modal.Heading>Buy Product</Modal.Heading>
                <p className="mt-1.5 text-sm leading-5 text-muted">
                  Fill out the form below and proceed to payment.
                </p>
              </Modal.Header>

              <Modal.Body className="p-6">
                <Surface variant="default">
                  <form
                    action={action}
                    method={method}
                    onSubmit={handleBuying}
                    className="flex flex-col gap-4"
                  >
                    {/* ---------- Hidden metadata ---------- */}
                    <input type="hidden" name="productId"    value={singleEquip._id} />
                    <input type="hidden" name="price"        value={price} />
                    <input type="hidden" name="totalPrice"   value={totalPrice} />
                    <input type="hidden" name="quantity"     value={quantity} />
                    <input type="hidden" name="title"        value={title} />
                    <input type="hidden" name="sellerName"   value={singleEquip.ownerName} />
                    <input type="hidden" name="sellerId"     value={singleEquip.ownerId} />
                    <input type="hidden" name="sellerEmail"  value={singleEquip.ownerEmail} />

                    {/* ---------- Visible / editable fields ---------- */}
                    <TextField
                      isRequired
                      className="w-full"
                      name="name"
                      defaultValue={defaultName}
                    >
                      <Label>Customer Name</Label>
                      <Input placeholder="Enter your name" className="rounded-2xl" />
                    </TextField>

                    <TextField
                      isRequired
                      type="email"
                      className="w-full"
                      name="email"
                      defaultValue={defaultEmail}
                    >
                      <Label>Customer Email</Label>
                      <Input placeholder="Email" />
                    </TextField>

                    <TextField className="w-full" name="phone" type="tel">
                      <Label>Customer Phone</Label>
                      <Input placeholder="Enter your phone number" />
                    </TextField>

                    {/* Product name — display only (hidden input ইতিমধ্যেই আছে) */}
                    <TextField className="w-full" defaultValue={title} isReadOnly>
                      <Label>Equipment Name</Label>
                      <Input placeholder="product" />
                    </TextField>

                    {/* ---------- Quantity ---------- */}
                    <div className="flex items-center gap-4">
                      <TextField
                        className="w-32"
                        value={String(quantity)}
                        onChange={handleQuantityChange}
                      >
                        <Label>Quantity</Label>
                        <Input type="number" min={1} max={stock} />
                      </TextField>
                    </div>

                    <p className="text-lg font-bold text-blue-600">
                      Total Amount: {totalPrice} $
                    </p>

                    <div className="flex gap-12">
                      <Button slot="close" variant="secondary">
                        Cancel
                      </Button>
                      <Button type="submit" isDisabled={isLoading}>
                        {isLoading ? "Creating Order..." : "Buy Equipment"}
                      </Button>
                    </div>
                  </form>
                </Surface>
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}




// "use client";

// import React, { useState, useRef } from 'react';
// import { Button, Input, Label, Modal, Surface, TextField } from "@heroui/react";
// import { ToastContainer, toast } from 'react-toastify';
// import { authClient } from "@/lib/auth-client";
// import { useRouter } from 'next/navigation';

// const BuyFormCustomer = ({ singleEquip, action, method }) => {


// // console.log(token, 'modalToken')


// //   const router = useRouter();
//   const [isOpen, setIsOpen] = useState(false);
//   const { data: session } = authClient.useSession();
//   const user = session?.user;
//   const [isLoading, setIsLoading] = useState(false);
//   const [quantity, setQuantity] = useState(1);
//   // const [orderId, setOrderId] = useState(''); // ← অর্ডার আইডি সংরক্ষণের জন্য স্টেট

//   const stock = Number(singleEquip.stock) || 0;
//   const price = Number(singleEquip.price )|| 0;
//   const totalPrice = Number((price * quantity).toFixed(2));
 
//   const defaultName = user?.name || '';
//   const defaultEmail = user?.email || '';
//   const { title } = singleEquip;

//   // ফর্ম রেফারেন্স – পরে সাবমিট করার জন্য
//   // const formRef = useRef(null);

//   const handleBuying = async (e) => {
//     e.preventDefault(); // ডিফল্ট সাবমিট বন্ধ
// setIsLoading(true);
//   // শুধু ফর্ম সাবমিট করছি, অর্ডার বা স্টক আপডেট এখানে নেই
//   e.target.submit();
// };


//   return (
//     <div>
//       <Button className="w-full" onClick={() => setIsOpen(true)}>
//         Buy Product
//       </Button>

//       <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
//         <Modal.Backdrop>
//           <Modal.Container placement="auto">
//             <Modal.Dialog className="sm:max-w-md">
//               <Modal.CloseTrigger />
//               <Modal.Header>
//                 <Modal.Heading>Buy Product</Modal.Heading>
//                 <p className="mt-1.5 text-sm leading-5 text-muted">
//                   Fill out the form below and proceed to payment.
//                 </p>
//               </Modal.Header>
//               <Modal.Body className="p-6">
//                 <Surface variant="default">
//                   {/* ফর্মে action ও method প্রপস পাস করুন, এবং onSubmit হ্যান্ডলার দিন */}
//                   <form
                    
//                     action={action}
//                     method={method}
//                     onSubmit={handleBuying}
//                     className="flex flex-col gap-4"
//                   >
//                      {/* <input type="hidden" name="token" value={token || ''} /> */}
//                     {/* অর্ডার আইডি হিডেন ফিল্ড – value স্টেট বা DOM দিয়ে সেট হবে */}
//                     <input   label="Buyer Name" type="hidden" name="buyerName" value={defaultName} />
//                     <input   label="Buyer Email" type="hidden" name="buyerEmail" value={defaultEmail} />
//                     {/* <input type="hidden" name="orderId" value={orderId} /> */}
//                     <input type="hidden" name="productId" value={singleEquip._id} />
//   <input   label="price" type="hidden" name="price" value={price} />
//   <input   label="totalPrice" type="hidden" name="totalPrice" value={totalPrice} />
//   <input   label="quantity" type="hidden" name="quantity" value={quantity} />
//   <input   label="title" type="hidden" name="title" value={singleEquip.title} />
//   <input   label="sellerName" type="hidden" name="sellerName" value={singleEquip.ownerName} />
//   <input   label="sellerId" type="hidden" name="sellerId" value={singleEquip.ownerId} />
//   <input   label="sellerEmail" type="hidden" name="sellerEmail" value={singleEquip.ownerEmail} />
//                     <TextField   label="Buyer Name"  defaultValue={defaultName} className="w-full" name="name" isRequired>
//                       <Label>Buyer Name</Label>
//                       <Input placeholder="Enter your name" className="rounded-2xl" />
//                     </TextField>

//                     <TextField   label="Buyer Email" defaultValue={defaultEmail} className="w-full" name="email" type="email" isRequired>
//                       <Label>Buyer Email</Label>
//                       <Input placeholder="Email" />
//                     </TextField>

//                     <TextField   label="Buyer Phone" className="w-full" name="phone" type="tel">
//                       <Label>Buyer Phone</Label>
//                       <Input placeholder="Enter your phone number" />
//                     </TextField>

//                     <TextField   label="Product Name" defaultValue={title} className="w-full" name="title">
//                       <Label>Product Name</Label>
//                       <Input placeholder="product" />
//                     </TextField>

//                     <div className="flex items-center gap-4">
//                       <TextField  className="w-32" label="Quantity">
//                         <Input
//                           type="number"
//                             name="quantity"
//                           min={1}
//                           max={stock}
//                           value={quantity}
//                           onChange={(e) => {
//                             const val = parseInt(e.target.value) || 1;
//                             setQuantity(Math.min(Math.max(val, 1), stock));
//                           }}
//                         />
// <TextField
//   className="w-32"
//   label="Quantity"          // এই লেবেলটি এখন ইনপুটের সাথে যুক্ত হবে
//   type="number"
//   name="quantity"
//   inputProps={{ min: 1, max: stock }}   // min/max এভাবে দিন
//   value={quantity}
//   onChange={(e) => {
//     const val = parseInt(e.target.value) || 1;
//     setQuantity(Math.min(Math.max(val, 1), stock));
//   }}
// />
//                       </TextField>
//                     </div>

//                     <p className="text-lg font-bold text-blue-600">
//                       Total Amount: {totalPrice} $
//                     </p>

//                     <div className="flex gap-12">
//                       <Button slot="close" variant="secondary">
//                         Cancel
//                       </Button>
//                       <Button
//                         type="submit"
                     
//                         // isDisabled={isLoading}
//                         // isLoading={isLoading}
//                       >
//                         Buy Product
//                         {/* {isLoading ? 'Creating Order...' : 'Buy Product'} */}
//                       </Button>
//                     </div>
//                   </form>
//                 </Surface>
//               </Modal.Body>
//             </Modal.Dialog>
//           </Modal.Container>
//         </Modal.Backdrop>
//       </Modal>
//     </div>
//   );
// };

// export default BuyFormCustomer;








