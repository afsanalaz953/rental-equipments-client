
// Start
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";



export async function POST(request) {
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

     const price = formData.get('price')
      const title = formData.get('title')
      // const orderId = formData.get('orderId')
      const equipmentId = formData.get('productId')
      const ownerId = formData.get('sellerId')
      const ownerName = formData.get('sellerName')
      const ownerEmail = formData.get('sellerEmail')
       const quantity = formData.get('quantity')
      //  const totalPrice= parseFloat((price * quantity).toFixed(2))
       const totalPrice= formData.get('totalPrice')
      

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
     line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Number(price) * 100,
            product_data: {
                name: title,
            }
          },
          quantity: Number(quantity),
        },
      ],
      metadata: {
        
        price: Number(price),
        totalPrice: Number(totalPrice),
        customerId: user?.id,
        customerName: user?.name,
        customerEmail: user?.email,
        title,
        equipmentId,
        ownerId,
        ownerName,
        ownerEmail,
         quantity: quantity,
        //  orderId,
      },
      mode: 'payment',
      // success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
       success_url: `${origin}/dashboard/customer/success?session_id={CHECKOUT_SESSION_ID}`,
      // Provide a name (for example, hosted_web_0001) to label this Checkout integration and measure its conversion independently
      
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