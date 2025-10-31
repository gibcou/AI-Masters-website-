"use client";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";

export default function PortfolioPage() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [receipts, setReceipts] = useState([]);
  const [certs, setCerts] = useState([]);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser || null);
      try {
        const email = fbUser?.email || fbUser?.uid;
        if (email) {
          const saved = localStorage.getItem(`aimasters_profile_name:${email}`);
          if (saved) setName(saved);
        }
      } catch {}
      // Load receipts and certificates
      try {
        if (fbUser) {
          const receiptsCol = collection(db, "users", fbUser.uid, "receipts");
          const certsCol = collection(db, "users", fbUser.uid, "certificates");
          const [receiptsSnap, certsSnap] = await Promise.all([
            getDocs(receiptsCol),
            getDocs(certsCol),
          ]);
          const receiptsList = receiptsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
          const certsList = certsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
          setReceipts(receiptsList);
          setCerts(certsList);
        } else {
          setReceipts([]);
          setCerts([]);
        }
      } catch {}
    });
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-brand-border">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-indigo-600 text-2xl font-semibold italic" style={{ fontFamily: '"Brush Script MT","Lucida Handwriting","Segoe Script","Pacifico",cursive' }}>AI Master</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-[var(--brand-primary)]">Home</Link>
            {user ? (
              <>
                <Link href="/courses" className="hover:text-[var(--brand-primary)]">Courses</Link>
                {(() => {
                  try {
                    const done = localStorage.getItem("aimasters_quiz_completed") === "true";
                    return done ? null : (
                      <Link href="/quiz" className="hover:text-[var(--brand-primary)]">Take the quiz</Link>
                    );
                  } catch {
                    return null;
                  }
                })()}
                <Link href="/portfolio" className="hover:text-[var(--brand-primary)]">Profile</Link>
              </>
            ) : (
              <>
                <Link href="/quiz" className="hover:text-[var(--brand-primary)]">Quiz</Link>
                <Link href="/courses" className="hover:text-[var(--brand-primary)]">Courses</Link>
              </>
            )}
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="inline-flex items-center rounded-full border border-neutral-300 bg-white text-neutral-900 px-4 py-2 text-sm">Welcome Back{(() => { try { const email = user?.email || user?.uid; const saved = email ? localStorage.getItem(`aimasters_profile_name:${email}`) : null; return saved ? ", " + saved : (user?.displayName ? ", " + user.displayName : ""); } catch { return ""; } })()}</span>
                <button onClick={() => signOut(auth)} className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-900 px-4 py-2 text-sm font-semibold hover:bg-neutral-50">Logout</button>
              </>
            ) : (
              <a href="/login" className="inline-flex items-center rounded-full border border-neutral-300 bg-white text-neutral-900 px-4 py-2 text-sm hover:text-[var(--brand-primary)]">Login</a>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">My Portfolio</h1>
            <p className="mt-2 text-neutral-700">A snapshot of projects, skills, and accomplishments.</p>
          </div>
          {user && (
            <div className="hidden md:block text-sm text-neutral-600">Welcome Back{(() => { try { const email = user?.email || user?.uid; const saved = name || (email ? localStorage.getItem(`aimasters_profile_name:${email}`) : null); return saved ? ", " + saved : (user?.displayName ? ", " + user.displayName : ""); } catch { return ""; } })()}</div>
          )}
        </div>

        {/* Name field */}
        <section className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Profile</h2>
          <div className="mt-4 grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-800">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => {
                  try {
                    const email = user?.email || user?.uid;
                    if (email) localStorage.setItem(`aimasters_profile_name:${email}`, name.trim());
                  } catch {}
                }}
                placeholder="Your full name"
                className="mt-2 w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
              />
              <p className="mt-2 text-xs text-neutral-600">Your name appears in greetings and certificates.</p>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  try {
                    const email = user?.email || user?.uid;
                    if (email) localStorage.setItem(`aimasters_profile_name:${email}`, name.trim());
                  } catch {}
                }}
                className="inline-flex items-center justify-center rounded-full bg-[var(--brand-primary)] text-white px-4 py-2 text-sm font-semibold hover:bg-[var(--brand-primary-dark)]"
              >
                Save
              </button>
            </div>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* About */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">About</h2>
            <p className="mt-2 text-neutral-700">I build AI-powered experiences, courses, and tools that help creators and businesses scale content, marketing, and productivity.</p>
            <ul className="mt-4 text-sm text-neutral-600 list-disc pl-5">
              <li>Focus: Generative AI, Automation, Content Systems</li>
              <li>Interests: Prompt engineering, education design, growth strategies</li>
            </ul>
            {user && (
              <div className="mt-4">
                <button
                  onClick={async () => {
                    try {
                      await setDoc(doc(db, "users", user.uid), { freeAccess: true }, { merge: true });
                      setStatus({ type: "success", message: "Free access granted." });
                    } catch (e) {
                      setStatus({ type: "error", message: e?.message || "Failed to grant free access." });
                    }
                  }}
                  className="inline-flex items-center justify-center rounded-full bg-[var(--brand-primary)] text-white px-4 py-2 text-sm font-semibold hover:bg-[var(--brand-primary-dark)]"
                  disabled={!((user.email?.toLowerCase() === process.env.NEXT_PUBLIC_OWNER_EMAIL?.toLowerCase()) || (user.uid === process.env.NEXT_PUBLIC_OWNER_UID))}
                  title={!((user.email?.toLowerCase() === process.env.NEXT_PUBLIC_OWNER_EMAIL?.toLowerCase()) || (user.uid === process.env.NEXT_PUBLIC_OWNER_UID)) ? "Only owner can grant free access" : undefined}
                >Owner Tools: Grant Free Access</button>
                {status && (
                  <p className={`mt-2 text-xs ${status.type === "success" ? "text-green-600" : "text-red-600"}`}>{status.message}</p>
                )}
              </div>
            )}
          </div>

          {/* Featured Projects */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Featured Projects</h2>
            <div className="mt-3 space-y-3">
              <Link href="/courses/ai-content-creation" className="block rounded-lg border border-neutral-200 p-4 hover:border-[var(--brand-primary)]">
                <div className="font-medium">AI Content Creation System</div>
                <div className="text-sm text-neutral-600">Framework and tools for multi-format content repurposing.</div>
              </Link>
              <Link href="/quiz" className="block rounded-lg border border-neutral-200 p-4 hover:border-[var(--brand-primary)]">
                <div className="font-medium">AI Readiness Quiz</div>
                <div className="text-sm text-neutral-600">Assess your AI adoption profile with instant feedback.</div>
              </Link>
            </div>
          </div>

          {/* Skills */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Skills</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                "Generative AI",
                "Prompt Engineering",
                "UX for Learning",
                "Content Strategy",
                "Automation",
                "Next.js",
                "Firebase",
              ].map((skill) => (
                <span key={skill} className="inline-flex items-center rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs text-neutral-800">{skill}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Receipts */}
        <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Receipts</h2>
          {user ? (
            receipts.length > 0 ? (
              <div className="mt-4 grid md:grid-cols-2 gap-4">
                {receipts.map((r) => (
                  <div key={r.id} className="rounded-lg border border-neutral-200 p-4">
                    <div className="font-medium">{r.product || "AI Masters Full Access"}</div>
                    <div className="text-sm text-neutral-700">Amount: {r.amount ? `$${(r.amount/100).toFixed(2)}` : "$200.00"} {r.currency?.toUpperCase() || "USD"}</div>
                    <div className="text-sm text-neutral-700">Status: {r.status || "paid"}</div>
                    {r.sessionId && (<div className="text-xs text-neutral-500">Session: {r.sessionId}</div>)}
                    <div className="mt-2 text-xs text-neutral-500">Date: {r.createdAt?.toDate ? r.createdAt.toDate().toLocaleString() : (r.createdAt ? new Date(r.createdAt).toLocaleString() : "-")}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-neutral-700">No receipts found yet.</p>
            )
          ) : (
            <p className="mt-3 text-sm text-neutral-700">Please log in to view your receipts.</p>
          )}
        </section>

        {/* Certificates */}
        <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Certificates</h2>
          {user ? (
            certs.length > 0 ? (
              <div className="mt-4 grid md:grid-cols-2 gap-4">
                {certs.map((c) => (
                  <div key={c.id} className="rounded-lg border border-neutral-200 p-4">
                    <div className="font-medium">{c.courseTitle || c.id}</div>
                    <div className="text-sm text-neutral-700">Awarded to: {c.ownerName || name || (user?.displayName || "You")}</div>
                    <div className="mt-2 text-xs text-neutral-500">Issued: {c.issuedAt?.toDate ? c.issuedAt.toDate().toLocaleString() : (c.issuedAt ? new Date(c.issuedAt).toLocaleString() : "-")}</div>
                    {/* Optionally include a link to download/view */}
                    {/* <a href={`/api/certificates/${c.id}`} className="mt-3 inline-block text-[var(--brand-primary)] text-sm">View Certificate</a> */}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-neutral-700">No certificates yet. Complete a course to earn one.</p>
            )
          ) : (
            <p className="mt-3 text-sm text-neutral-700">Please log in to view your certificates.</p>
          )}
        </section>

        {/* Experience / Timeline */}
        <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Experience</h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-[var(--brand-primary)]" />
              <div>
                <div className="font-medium">AI Educator & Course Designer</div>
                <div className="text-sm text-neutral-600">Created interactive curricula and tools to help non-technical users leverage AI.</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-[var(--brand-primary)]" />
              <div>
                <div className="font-medium">Product & Growth Consultant</div>
                <div className="text-sm text-neutral-600">Built AI-infused content systems and marketing automations for SMBs.</div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact / Links */}
        <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Links</h2>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link href="/courses" className="inline-flex items-center justify-center rounded-full bg-[var(--brand-primary)] text-white px-5 py-3 text-sm font-semibold hover:bg-[var(--brand-primary-dark)]">Explore Courses</Link>
            <Link href="/login" className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-900 px-5 py-3 text-sm font-semibold hover:bg-neutral-50">Update Login</Link>
          </div>
        </section>
      </main>
    </div>
  );
}