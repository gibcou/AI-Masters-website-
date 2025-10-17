import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const session_id = searchParams.get("session_id");
    if (!session_id) {
      return NextResponse.json({ message: "Missing session_id" }, { status: 400 });
    }
    // TODO: Use Stripe to verify the session payment status server-side.
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    // const session = await stripe.checkout.sessions.retrieve(session_id);
    // return NextResponse.json({ paid: session.payment_status === "paid" });

    // Temporary: assume paid for demo purposes
    return NextResponse.json({ paid: true }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ message: e?.message || "Failed to verify session" }, { status: 500 });
  }
}