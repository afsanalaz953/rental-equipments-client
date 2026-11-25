"use client";

import React, { useState } from "react";
import { Button, Input, Label, Modal, Surface, TextField } from "@heroui/react";
import { authClient } from "@/lib/auth-client";

interface SingleEquip {
  _id: string;
  title: string;
  price: number | string;
  stock: number | string;
  ownerName: string;
  ownerId: string;
  ownerEmail: string;
  rentalType?: "perday" | "weekly" | "monthly" | string;
}

interface BuyFormCustomerProps {
  singleEquip: SingleEquip;
  action: React.ComponentProps<"form">["action"];
  method?: React.ComponentProps<"form">["method"];
}

const MS_PER_DAY = 86_400_000;
const todayIso = new Date().toISOString().split("T")[0];

export default function BuyFormCustomer({
  singleEquip, action, method = "post",
}: BuyFormCustomerProps) {
  const [isOpen, setIsOpen]         = useState(false);
  const { data: session }           = authClient.useSession();
  const user                        = session?.user;
  const [isLoading, setIsLoading]   = useState(false);
  const [quantity, setQuantity]     = useState(1);

  // 🆕 নতুন state
  const [startDate, setStartDate]   = useState("");
  const [endDate, setEndDate]       = useState("");
  const [error, setError]           = useState("");

  const stock       = Number(singleEquip.stock) || 0;
  const price       = Number(singleEquip.price) || 0;
  const rentalType  = singleEquip.rentalType ?? "perday";

  // 🔢 Duration (inclusive)
  const rentalDays = (() => {
    if (!startDate || !endDate) return 0;
    const s = Date.parse(`${startDate}T00:00:00Z`);
    const e = Date.parse(`${endDate}T00:00:00Z`);
    if (Number.isNaN(s) || Number.isNaN(e) || e < s) return 0;
    return Math.floor((e - s) / MS_PER_DAY) + 1;
  })();

  // 🔢 Billable units by type
  const billableUnits = (() => {
    if (rentalDays <= 0) return 0;
    if (rentalType === "weekly")  return Math.ceil(rentalDays / 7);
    if (rentalType === "monthly") return Math.ceil(rentalDays / 30);
    return rentalDays; // perday
  })();

  const totalPrice = Number((price * billableUnits * quantity).toFixed(2));

  const defaultName  = user?.name  ?? "";
  const defaultEmail = user?.email ?? "";
  const { title }    = singleEquip;

  // ✅ Validation
  const handleBuying = (e: React.FormEvent<HTMLFormElement>) => {
    if (!startDate || !endDate) {
      e.preventDefault();
      setError("Please select rental start & end date.");
      return;
    }
    if (billableUnits <= 0) {
      e.preventDefault();
      setError("End date must be on/after start date.");
      return;
    }
    if (quantity > stock) {
      e.preventDefault();
      setError(`Only ${stock} units available.`);
      return;
    }
    setError("");
    setIsLoading(true);
  };

  const handleQuantityChange = (value: string) => {
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
                <Modal.Heading>Buy / Rent Product</Modal.Heading>
              </Modal.Header>

              <Modal.Body className="p-6">
                <Surface variant="default">
                  <form
                    action={action}
                    method={method}
                    onSubmit={handleBuying}
                    className="flex flex-col gap-4"
                  >
                    {/* ---- Hidden ---- */}
                    <input type="hidden" name="productId"    value={singleEquip._id} />
                    <input type="hidden" name="price"        value={price} />
                    <input type="hidden" name="quantity"     value={quantity} />
                    <input type="hidden" name="title"        value={title} />
                    <input type="hidden" name="rentalType"   value={rentalType} />
                    <input type="hidden" name="ownerName"    value={singleEquip.ownerName} />
                    <input type="hidden" name="ownerId"      value={singleEquip.ownerId} />
                    <input type="hidden" name="ownerEmail"   value={singleEquip.ownerEmail} />

                    {/* 🆕 Rental window */}
                    <input type="hidden" name="rentalStartDate" value={startDate} />
                    <input type="hidden" name="rentalEndDate"   value={endDate} />
                    <input type="hidden" name="rentalDays"      value={rentalDays} />
                    <input type="hidden" name="billableUnits"   value={billableUnits} />
                    <input type="hidden" name="totalPrice"      value={totalPrice} />

                    {/* ---- Visible ---- */}
                    <TextField isRequired className="w-full" name="name" defaultValue={defaultName}>
                      <Label>Customer Name</Label>
                      <Input placeholder="Enter your name" />
                    </TextField>

                    <TextField isRequired type="email" className="w-full" name="email" defaultValue={defaultEmail}>
                      <Label>Customer Email</Label>
                      <Input placeholder="Email" />
                    </TextField>

                    <TextField className="w-full" name="phone" type="tel">
                      <Label>Customer Phone</Label>
                      <Input placeholder="Phone" />
                    </TextField>

                    {/* 🆕 Date pickers */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* <TextField isRequired className="w-full" name="rentalStartDateUi">
                        <Label>Rental Start</Label>
                        <Input
                          type="date"
                          min={todayIso}
                          value={startDate}
                          onChange={(v) => {
                            setStartDate(v);
                            if (endDate && endDate < v) setEndDate(v);
                          }}
                        />
                      </TextField> */}
                      <TextField
                           isRequired
                           className="w-full"
                            // name="rentalStartDateUi"
                            value={startDate}
                             onChange={setStartDate}      /* HeroUI TextField string value দেয় */
                           >
                        <Label>Rental Start</Label>
                        <Input type="date" min={todayIso} />
                     </TextField>

                      {/* <TextField isRequired className="w-full" name="rentalEndDateUi">
                        <Label>Rental End</Label>
                        <Input
                          type="date"
                          min={startDate || todayIso}
                          value={endDate}
                          onChange={(v) => setEndDate(v)}
                        />
                      </TextField> */}
                      {/* <TextField
                        isRequired
                        className="w-full"
                         name="rentalEndDateUi"
                       value={endDate}
                        onChange={(v) => {
                        setEndDate(v);
                      if (startDate && v < startDate) setStartDate(v);
                      }}
                     >
                    <Label>Rental End</Label>
                    <Input type="date" min={startDate || todayIso} />
                   </TextField> */}
                   <TextField
                     isRequired
                      className="w-full"
                       name="rentalEndDateUi"
                       value={endDate}
                         onChange={(v) => {
                        // end < start হলে শেষ input-টাই রাখো, start ছোঁও না
                        if (startDate && v < startDate) return;
                        setEndDate(v);
                          }}
                             >
                              <Label>Rental End</Label>
                           <Input type="date" min={startDate || todayIso} />
                           </TextField>
                    </div>

                    {/* Quantity */}
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

                    {/* 🆕 Duration summary */}
                    <div className="rounded-xl bg-slate-50 p-3 text-sm space-y-1">
                      <p>Rental type: <b className="capitalize">{rentalType}</b></p>
                      <p>Duration: <b>{rentalDays || 0}</b> day(s)</p>
                      <p>Billable units: <b>{billableUnits || 0}</b></p>
                      <p>Rate per unit: <b>${price}</b></p>
                    </div>

                    <p className="text-lg font-bold text-blue-600">
                      Total Amount: ${totalPrice}
                    </p>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <div className="flex gap-12">
                      <Button slot="close" variant="secondary">Cancel</Button>
                      <Button type="submit" isDisabled={isLoading || billableUnits <= 0}>
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

// import React, { useState } from "react";
// import { Button, Input, Label, Modal, Surface, TextField } from "@heroui/react";
// import { authClient } from "@/lib/auth-client";

// /* ---------- Types ---------- */
// interface SingleEquip {
//   _id: string;
//   title: string;
//   price: number | string;
//   stock: number | string;
//   ownerName: string;
//   ownerId: string;
//   ownerEmail: string;
//    rentalType?: string;
// }

// interface BuyFormCustomerProps {
//   singleEquip: SingleEquip;
//   action: React.ComponentProps<"form">["action"];   // string | Server Action
//   method?: React.ComponentProps<"form">["method"];   // "get" | "post"
// }

// /* ---------- Component ---------- */
// export default function BuyFormCustomer({
//   singleEquip,
//   action,
//   method = "post",
// }: BuyFormCustomerProps) {
//   const [isOpen, setIsOpen] = useState<boolean>(false);
//   const { data: session } = authClient.useSession();
//   const user = session?.user;
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [quantity, setQuantity] = useState<number>(1);

//   const stock = Number(singleEquip.stock) || 0;
//   const price = Number(singleEquip.price) || 0;
//   const totalPrice = Number((price * quantity).toFixed(2));

//   const defaultName = user?.name ?? "";
//   const defaultEmail = user?.email ?? "";
//   const { title } = singleEquip;

//   /* Form submit — React নিজেই action handle করবে, preventDefault/submit() দরকার নেই */
//   const handleBuying = (): void => {
//     setIsLoading(true);
//   };

//   /* Quantity change handler — HeroUI TextField এর onChange string দেয় */
//   const handleQuantityChange = (value: string): void => {
//     const parsed = Number.parseInt(value, 10);
//     if (Number.isNaN(parsed)) return;
//     setQuantity(Math.min(Math.max(parsed, 1), stock || 1));
//   };

//   return (
//     <div>
//       <Button className="w-full" onPress={() => setIsOpen(true)}>
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
//                   <form
//                     action={action}
//                     method={method}
//                     onSubmit={handleBuying}
//                     className="flex flex-col gap-4"
//                   >
//                     {/* ---------- Hidden metadata ---------- */}
//                     <input type="hidden" name="productId"    value={singleEquip._id} />
//                     <input type="hidden" name="price"        value={price} />
//                     <input type="hidden" name="totalPrice"   value={totalPrice} />
//                     <input type="hidden" name="quantity"     value={quantity} />
//                     <input type="hidden" name="title"        value={title} />
//                     <input type="hidden" name="ownerName"   value={singleEquip.ownerName} />
//                     <input type="hidden" name="ownerId"     value={singleEquip.ownerId} />
//                     <input type="hidden" name="ownerEmail"  value={singleEquip.ownerEmail} />

//                     {/* ---------- Visible / editable fields ---------- */}
//                     <TextField
//                       isRequired
//                       className="w-full"
//                       name="name"
//                       defaultValue={defaultName}
//                     >
//                       <Label>Customer Name</Label>
//                       <Input placeholder="Enter your name" className="rounded-2xl" />
//                     </TextField>

//                     <TextField
//                       isRequired
//                       type="email"
//                       className="w-full"
//                       name="email"
//                       defaultValue={defaultEmail}
//                     >
//                       <Label>Customer Email</Label>
//                       <Input placeholder="Email" />
//                     </TextField>

//                     <TextField className="w-full" name="phone" type="tel">
//                       <Label>Customer Phone</Label>
//                       <Input placeholder="Enter your phone number" />
//                     </TextField>

//                     {/* Product name — display only (hidden input ইতিমধ্যেই আছে) */}
//                     <TextField className="w-full" defaultValue={title} isReadOnly>
//                       <Label>Equipment Name</Label>
//                       <Input placeholder="product" />
//                     </TextField>

//                     {/* ---------- Quantity ---------- */}
//                     <div className="flex items-center gap-4">
//                       <TextField
//                         className="w-32"
//                         value={String(quantity)}
//                         onChange={handleQuantityChange}
//                       >
//                         <Label>Quantity</Label>
//                         <Input type="number" min={1} max={stock} />
//                       </TextField>
//                     </div>

//                     <p className="text-lg font-bold text-blue-600">
//                       Total Amount: {totalPrice} $
//                     </p>

//                     <div className="flex gap-12">
//                       <Button slot="close" variant="secondary">
//                         Cancel
//                       </Button>
//                       <Button type="submit" isDisabled={isLoading}>
//                         {isLoading ? "Creating Order..." : "Buy Equipment"}
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
// }






