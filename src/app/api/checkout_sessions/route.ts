// Start According to rental date and type
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";

const MS_PER_DAY = 86_400_000;

export async function POST(request: Request) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')

    const userSession = await auth.api.getSession({
      headers: await headers(),
    });

    const user = userSession?.user;
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized,fm route – Please login' },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    // 🆕 rental fields add
    const price           = formData.get('price')
    const title           = formData.get('title')
    const equipmentId     = formData.get('productId')
    const ownerId         = formData.get('ownerId')
    const ownerName       = formData.get('ownerName')
    const ownerEmail      = formData.get('ownerEmail')
    const quantity        = Number(formData.get('quantity') ?? 1)

    const rentalType      = String(formData.get('rentalType')      ?? 'perday')
    const rentalStartDate = String(formData.get('rentalStartDate') ?? '')
    const rentalEndDate   = String(formData.get('rentalEndDate')   ?? '')

    // 🆕 Server-side calculation
    const start = new Date(`${rentalStartDate}T00:00:00Z`)
    const end   = new Date(`${rentalEndDate}T00:00:00Z`)

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
      return NextResponse.json({ error: 'Invalid rental dates' }, { status: 400 })
    }

    const rentalDays = Math.floor((end.getTime() - start.getTime()) / MS_PER_DAY) + 1

    let billableUnits = rentalDays
    if (rentalType === 'weekly')  billableUnits = Math.ceil(rentalDays / 7)
    if (rentalType === 'monthly') billableUnits = Math.ceil(rentalDays / 30)

    const totalPrice = Number((Number(price) * billableUnits * quantity).toFixed(2))
    const totalCents = Math.round(totalPrice * 100)   // ⚠️ Stripe = integer cents

    if (totalCents < 50) {
      return NextResponse.json({ error: 'Amount too small (min $0.50)' }, { status: 400 })
    }

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: totalCents,      // 🆕 total (not per-unit)
            product_data: {
              name: `${title} (${rentalType})`,
              description: `${rentalStartDate} → ${rentalEndDate} · ${rentalDays} day(s) · ${billableUnits} unit(s)`,
            },
          },
          quantity: 1,                    // 🆕 qty 1, total already computed
        },
      ],
      metadata: {
        // 🆕 সব string করতে হবে (Stripe metadata = string only)
        price:           String(price),
        totalPrice:      String(totalPrice),
        customerId:      user?.id    ?? "",
        customerName:    user?.name  ?? "",
        customerEmail:   user?.email ?? "",
        title:           String(title),
        equipmentId:     String(equipmentId),
        ownerId:         String(ownerId),
        ownerName:       String(ownerName),
        ownerEmail:      String(ownerEmail),
        quantity:        String(quantity),
        // 🆕 rental info
        rentalType,
        rentalStartDate,
        rentalEndDate,
        rentalDays:      String(rentalDays),
        billableUnits:   String(billableUnits),
      },
      mode: 'payment',
      success_url: `${origin}/dashboard/customer/success?session_id={CHECKOUT_SESSION_ID}`,
    });
    return NextResponse.redirect(session.url as string, 303)
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    return NextResponse.json(
      { error: error.message || 'Payment initiation failed' },
      { status: 500 }
    )
  }
}









// full corrected code
// // Start
// import { NextResponse } from "next/server";
// import { headers } from "next/headers";
// import { stripe } from "@/lib/stripe";
// import { auth } from "@/lib/auth";



// export async function POST(request) {
//   try {
//     const headersList = await headers()
//     const origin = headersList.get('origin')

//      const userSession = await auth.api.getSession({
//       headers: await headers(),
//     });

//     const user = userSession?.user;
//     if (!user) {
//       return NextResponse.json(
//         { error: 'Unauthorized,fm route – Please login' },
//         { status: 401 }
//       );
//     }

//     const formData = await request.formData();

//      const price = formData.get('price')
//       const title = formData.get('title')
//       // const orderId = formData.get('orderId')
//       const equipmentId = formData.get('productId')
//       const ownerId = formData.get('ownerId')
//       const ownerName = formData.get('ownerName')
//       const ownerEmail = formData.get('ownerEmail')
//        const quantity = formData.get('quantity')
//       //  const totalPrice= parseFloat((price * quantity).toFixed(2))
//        const totalPrice= formData.get('totalPrice')
      

//     // Create Checkout Sessions from body params.
//     const session = await stripe.checkout.sessions.create({
//      line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             unit_amount: Number(price) * 100,
//             product_data: {
//                 name: title,
//             }
//           },
//           quantity: Number(quantity),
//         },
//       ],
//       metadata: {
        
//         price: Number(price),
//         totalPrice: Number(totalPrice),
//         customerId: user?.id,
//         customerName: user?.name,
//         customerEmail: user?.email,
//         title,
//         equipmentId,
//         ownerId,
//         ownerName,
//         ownerEmail,
//          quantity: quantity,
//         //  orderId,
//       },
//       mode: 'payment',
//       // success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
//        success_url: `${origin}/dashboard/customer/success?session_id={CHECKOUT_SESSION_ID}`,
//       // Provide a name (for example, hosted_web_0001) to label this Checkout integration and measure its conversion independently
      
//     });
//     return NextResponse.redirect(session.url as string, 303)
//   } catch (err) {
//     const error = err instanceof Error ? err : new Error(String(err))
//     return NextResponse.json(
//       { error: error.message || 'Payment initiation failed' },
//       { status: 500 }
//     )
//   }
// }