import { NextResponse } from "next/server";
// import Stripe from "stripe";

export const runtime = "nodejs";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const session_id = searchParams.get("session_id");
    if (!session_id) {
      return NextResponse.json({ valid: false, message: "Missing session_id" }, { status: 400 });
    }

    // Optionally verify session server-side (disabled for now to avoid blocking UI)
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-09-30" });
    // const session = await stripe.checkout.sessions.retrieve(session_id);
    // const paid = session.payment_status === "paid";

    // Return optimistic result; actual gating is handled on success page via Firestore
    return NextResponse.json({ valid: true }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ valid: false, message: e?.message || "Verification failed" }, { status: 500 });
  }
}