"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mode, setMode] = useState("signin"); // 'signin' | 'signup'

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setUser(fbUser);
        try {
          localStorage.setItem("quiz_user_email", fbUser.email || fbUser.uid);
        } catch {}
        // Access check with owner/freeAccess bypass
        try {
          const uref = doc(db, "users", fbUser.uid);
          const snap = await getDoc(uref);
          const data = snap.exists() ? snap.data() : {};
          const hasPaid = !!data.hasPaid;
          const freeAccess = !!data.freeAccess;
          const OWNER_EMAIL = process.env.NEXT_PUBLIC_OWNER_EMAIL?.toLowerCase();
          const OWNER_UID = process.env.NEXT_PUBLIC_OWNER_UID;
          const isOwner = (fbUser.email?.toLowerCase() === OWNER_EMAIL) || (fbUser.uid === OWNER_UID);
          if (isOwner && !freeAccess) {
            await setDoc(uref, { freeAccess: true }, { merge: true });
          }
          const accessGranted = hasPaid || freeAccess || isOwner;
          if (!accessGranted) {
            router.replace("/checkout");
          }
        } catch {}
      } else {
        setUser(null);
        try {
          localStorage.removeItem("quiz_user_email");
        } catch {}
      }
    });
    return () => unsub();
  }, [router]);

  const handleLogin = async () => {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      setStatus({ type: "error", message: "Please enter a valid email address." });
      return;
    }
    if (!password || password.length < 6) {
      setStatus({ type: "error", message: "Password must be at least 6 characters." });
      return;
    }
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      setStatus({ type: "success", message: "Signed in successfully." });
      // Access check after login
      try {
        const uref = doc(db, "users", cred.user.uid);
        const snap = await getDoc(uref);
        const data = snap.exists() ? snap.data() : {};
        const hasPaid = !!data.hasPaid;
        const freeAccess = !!data.freeAccess;
        const OWNER_EMAIL = process.env.NEXT_PUBLIC_OWNER_EMAIL?.toLowerCase();
        const OWNER_UID = process.env.NEXT_PUBLIC_OWNER_UID;
        const isOwner = (cred.user.email?.toLowerCase() === OWNER_EMAIL) || (cred.user.uid === OWNER_UID);
        if (isOwner && !freeAccess) {
          await setDoc(uref, { freeAccess: true }, { merge: true });
        }
        const accessGranted = hasPaid || freeAccess || isOwner;
        router.replace(accessGranted ? "/courses" : "/checkout");
      } catch {
        router.replace("/checkout");
      }
    } catch (e) {
      setStatus({ type: "error", message: e?.message || "Login failed." });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setStatus({ type: "success", message: "Signed out." });
    } catch (e) {
      setStatus({ type: "error", message: e?.message || "Logout failed." });
    }
  };

  const handleSignup = async () => {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      setStatus({ type: "error", message: "Please enter a valid email address." });
      return;
    }
    if (!password || password.length < 6) {
      setStatus({ type: "error", message: "Password must be at least 6 characters." });
      return;
    }
    if (password !== confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match." });
      return;
    }
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      setStatus({ type: "success", message: "Account created and signed in." });
      // Ensure a user doc exists
      try {
        const uref = doc(db, "users", cred.user.uid);
        await setDoc(uref, { email: cred.user.email || "", hasPaid: false }, { merge: true });
        // Owner auto free access
        const OWNER_EMAIL = process.env.NEXT_PUBLIC_OWNER_EMAIL?.toLowerCase();
        const OWNER_UID = process.env.NEXT_PUBLIC_OWNER_UID;
        const isOwner = (cred.user.email?.toLowerCase() === OWNER_EMAIL) || (cred.user.uid === OWNER_UID);
        if (isOwner) {
          await setDoc(uref, { freeAccess: true }, { merge: true });
          router.replace("/courses");
          return;
        }
      } catch {}
      router.replace("/checkout");
    } catch (e) {
      setStatus({ type: "error", message: e?.message || "Account creation failed." });
    }
  };

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
              <button onClick={handleLogout} className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-900 px-4 py-2 text-sm font-semibold hover:bg-neutral-50">Logout</button>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="mt-2 text-neutral-700">Sign in with your email and password to access courses.</p>

        {status && (
          <div className={`mt-3 rounded-md px-3 py-2 text-sm ${status.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>{status.message}</div>
        )}

        {user ? (
          <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="font-semibold">Signed in</div>
            <p className="text-sm text-neutral-700 mt-1">{user.email || `UID: ${user.uid}`}</p>
            <div className="mt-4 flex items-center gap-3">
              <button onClick={() => router.replace("/courses")} className="inline-flex items-center rounded-full bg-[var(--brand-primary)] text-white px-4 py-2 text-sm hover:bg-[var(--brand-primary-dark)]">Go to Courses</button>
              <button onClick={handleLogout} className="inline-flex items-center rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm hover:bg-neutral-50">Logout</button>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{mode === "signin" ? "Sign in" : "Create account"}</div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { setMode("signin"); setStatus(null); }}
                  className={`px-3 py-1 text-xs rounded-full border ${mode === "signin" ? "bg-neutral-900 text-white border-neutral-900" : "bg-white text-neutral-800 border-neutral-300"}`}
                >Sign in</button>
                <button
                  onClick={() => { setMode("signup"); setStatus(null); }}
                  className={`px-3 py-1 text-xs rounded-full border ${mode === "signup" ? "bg-neutral-900 text-white border-neutral-900" : "bg-white text-neutral-800 border-neutral-300"}`}
                >Create account</button>
              </div>
            </div>
            <p className="text-sm text-neutral-700 mt-1">Enter your {mode === "signin" ? "credentials" : "email and a secure password"} below.</p>
            <label htmlFor="email" className="mt-3 block text-sm font-medium text-neutral-800">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900 outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
            />
            <label htmlFor="password" className="mt-4 block text-sm font-medium text-neutral-800">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900 outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
            />
            {mode === "signup" && (
              <>
                <label htmlFor="confirmPassword" className="mt-4 block text-sm font-medium text-neutral-800">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900 outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                />
              </>
            )}
            {mode === "signin" ? (
              <button onClick={handleLogin} className="mt-4 inline-flex items-center rounded-full bg-[var(--brand-primary)] text-white px-4 py-2 text-sm hover:bg-[var(--brand-primary-dark)]">Sign in</button>
            ) : (
              <button onClick={handleSignup} className="mt-4 inline-flex items-center rounded-full bg-[var(--brand-primary)] text-white px-4 py-2 text-sm hover:bg-[var(--brand-primary-dark)]">Create account</button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}