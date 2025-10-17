import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { uid, email } = await req.json();
    if (!uid || !email) {
      return NextResponse.json({ message: "Missing uid or email" }, { status: 400 });
    }

    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      return NextResponse.json({ message: "Stripe secret key not configured" }, { status: 500 });
    }
    const stripe = new Stripe(secret);

    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "AI Masters Full Access" },
            unit_amount: 20000, // $200.00 in cents
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      success_url: `${baseURL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseURL}/checkout`,
      metadata: { uid },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ message: e?.message || "Failed to create session" }, { status: 500 });
  }
}