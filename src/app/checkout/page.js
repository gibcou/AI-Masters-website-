"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function CheckoutPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setUser(null);
        router.replace("/login");
      } else {
        setUser(fbUser);
        // compute owner early for UI
        const OWNER_EMAIL = process.env.NEXT_PUBLIC_OWNER_EMAIL?.toLowerCase();
        const OWNER_UID = process.env.NEXT_PUBLIC_OWNER_UID;
        const ownerFlag = (fbUser.email?.toLowerCase() === OWNER_EMAIL) || (fbUser.uid === OWNER_UID);
        setIsOwner(!!ownerFlag);
        // If already paid or has freeAccess (or is owner), skip checkout
        try {
          const uref = doc(db, "users", fbUser.uid);
          const snap = await getDoc(uref);
          const data = snap.exists() ? snap.data() : {};
          const hasPaid = !!data.hasPaid;
          const freeAccess = !!data.freeAccess;
          if (ownerFlag && !freeAccess) {
            await setDoc(uref, { freeAccess: true }, { merge: true });
          }
          const accessGranted = hasPaid || freeAccess || ownerFlag;
          if (accessGranted) {
            router.replace("/courses");
            return;
          }
        } catch {}
      }
      setAuthChecked(true);
    });
    return () => unsub();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch {}
  };

  const handleCreateCheckout = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user?.uid, email: user?.email }),
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        setStatus({ type: "error", message: data?.message || "Unable to start checkout. Please try again." });
      }
    } catch (e) {
      setStatus({ type: "error", message: e?.message || "Failed to create checkout session." });
    } finally {
      setLoading(false);
    }
  };

  const handleDevMarkPaid = async () => {
    if (!user) return;
    setLoading(true);
    setStatus(null);
    try {
      await setDoc(doc(db, "users", user.uid), { hasPaid: true }, { merge: true });
      setStatus({ type: "success", message: "Payment recorded. Redirecting to courses..." });
      setTimeout(() => router.replace("/courses"), 600);
    } catch (e) {
      setStatus({ type: "error", message: e?.message || "Failed to mark as paid." });
    } finally {
      setLoading(false);
    }
  };

  const handleGrantFreeAccess = async () => {
    if (!user) return;
    setLoading(true);
    setStatus(null);
    try {
      await setDoc(doc(db, "users", user.uid), { freeAccess: true }, { merge: true });
      setStatus({ type: "success", message: "Free access granted. Redirecting..." });
      setTimeout(() => router.replace("/courses"), 600);
    } catch (e) {
      setStatus({ type: "error", message: e?.message || "Failed to grant free access." });
    } finally {
      setLoading(false);
    }
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-white text-neutral-900 flex items-center justify-center">
        <div className="animate-pulse text-neutral-600">Preparing checkout…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-brand-border">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" aria-label="Go to Home">
              <span className="text-indigo-600 text-2xl font-semibold italic" style={{ fontFamily: '"Brush Script MT","Lucida Handwriting","Segoe Script","Pacifico",cursive' }}>AI Master</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="inline-flex items-center rounded-full border border-neutral-300 bg-white text-neutral-900 px-4 py-2 text-sm">{user.email || `UID: ${user.uid}`}</span>
                <button onClick={handleLogout} className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-900 px-4 py-2 text-sm font-semibold hover:bg-neutral-50">Logout</button>
              </>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-2xl md:text-3xl font-bold">Course Access Checkout</h1>
        <p className="mt-2 text-neutral-700">Make a one-time payment to unlock access to all AI Masters courses.</p>

        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold">AI Masters Full Access</div>
              <p className="text-sm text-neutral-700">Lifetime access to current and future course content.</p>
            </div>
            <div className="text-2xl font-bold">$200</div>
          </div>
          <ul className="mt-4 list-disc list-inside text-sm text-neutral-700">
            <li>Immediate access after payment</li>
            <li>No recurring charges</li>
            <li>Progress sync across devices</li>
          </ul>

          {status && (
            <div className={`mt-4 rounded-md px-3 py-2 text-sm ${status.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>{status.message}</div>
          )}

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={handleCreateCheckout}
              disabled={loading}
              className="inline-flex items-center rounded-full bg-[var(--brand-primary)] text-white px-5 py-2 text-sm font-semibold hover:bg-[var(--brand-primary-dark)] disabled:opacity-60"
            >{loading ? "Starting checkout..." : "Pay $200"}</button>
            {isOwner && (
              <>
                <button
                  onClick={handleDevMarkPaid}
                  disabled={loading}
                  className="inline-flex items-center rounded-full border border-neutral-300 bg-white text-neutral-900 px-5 py-2 text-sm font-semibold hover:bg-neutral-50"
                >Dev: Mark Paid</button>
                <button
                  onClick={handleGrantFreeAccess}
                  disabled={loading}
                  className="inline-flex items-center rounded-full border border-neutral-300 bg-white text-neutral-900 px-5 py-2 text-sm font-semibold hover:bg-neutral-50"
                >Grant Free Access</button>
              </>
            )}
          </div>

          <p className="mt-3 text-xs text-neutral-600">Note: The Pay button uses server-side checkout integration when configured. The Dev button is available for testing without a payment gateway.</p>
        </div>

        <div className="mt-6">
          <Link href="/courses" className="inline-flex items-center rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm hover:bg-neutral-50">Back to Courses</Link>
        </div>
      </main>
    </div>
  );
}