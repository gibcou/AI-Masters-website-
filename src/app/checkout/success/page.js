"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";

function SuccessContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        router.replace("/login");
      } else {
        setUser(fbUser);
        try {
          const sessionId = params.get("session_id");
          let paid = false;
          if (sessionId) {
            const res = await fetch(`/api/verify-session?session_id=${encodeURIComponent(sessionId)}`);
            const data = await res.json();
            paid = !!data?.paid;
          }
          if (paid) {
            await setDoc(doc(db, "users", fbUser.uid), { hasPaid: true }, { merge: true });
            try {
              await addDoc(collection(db, "users", fbUser.uid, "receipts"), {
                sessionId: sessionId || "unknown",
                product: "AI Masters Full Access",
                amount: 20000,
                amount_display: "$200.00",
                currency: "USD",
                status: "paid",
                createdAt: serverTimestamp(),
              });
            } catch (e) {
              console.error("Failed to create receipt:", e);
            }
            setStatus({ type: "success", message: "Payment confirmed. Access granted!" });
            setTimeout(() => router.replace("/courses"), 800);
          } else {
            setStatus({ type: "error", message: "We couldn't verify your payment. Please contact support or try again." });
          }
        } catch (e) {
          setStatus({ type: "error", message: e?.message || "Failed to finalize payment." });
        }
      }
    });
    return () => unsub();
  }, [router, params]);

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-brand-border">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" aria-label="Go to Home">
              <span className="text-indigo-600 text-2xl font-semibold italic" style={{ fontFamily: '"Brush Script MT","Lucida Handwriting","Segoe Script","Pacifico",cursive' }}>AI Master</span>
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-2xl md:text-3xl font-bold">Thank you!</h1>
        <p className="mt-2 text-neutral-700">Your payment was successful. We're updating your account access...</p>
        {status && (
          <div className={`mt-4 rounded-md px-3 py-2 text-sm ${status.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>{status.message}</div>
        )}
      </main>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white text-neutral-900">
        <main className="mx-auto max-w-2xl px-6 py-10">
          <p className="text-neutral-700">Processing your payment...</p>
        </main>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}