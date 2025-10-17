"use client";
import Link from "next/link";
import { getAllCourses } from "@/lib/courses";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function CoursesIndex() {
  const courses = getAllCourses();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [unlockMap, setUnlockMap] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [accessGranted, setAccessGranted] = useState(false);

  // Login-required guard via Firebase + payment gating
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      if (!fbUser) {
        setUser(null);
        setAuthChecked(true); // render immediately
        router.replace("/login");
        return;
      }
      setUser(fbUser);
      setAuthChecked(true); // render immediately
      // Load profile name from localStorage (non-blocking)
      try {
        const email = fbUser?.email || fbUser?.uid;
        if (email) {
          const saved = localStorage.getItem(`aimasters_profile_name:${email}`);
          if (saved) setProfileName(saved);
        }
      } catch {}

      // Payment gating check (run asynchronously, do not block first render)
      (async () => {
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
          setAccessGranted(accessGranted);
          if (!accessGranted) {
            router.replace("/checkout");
          }
        } catch {}
      })();
    });
    return () => unsub();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (e) {
      // no-op
    }
  };

  useEffect(() => {
    try {
      // If access is granted, unlock all courses globally
      if (accessGranted) {
        const mapAll = {};
        courses.forEach((c) => { mapAll[c.slug] = true; });
        setUnlockMap(mapAll);
        return;
      }
      const map = {};
      const quizCompleted = localStorage.getItem("aimasters_quiz_completed") === "true";
      if (courses.length > 0) {
        map[courses[0].slug] = !!quizCompleted;
        for (let i = 1; i < courses.length; i++) {
          const prevSlug = courses[i - 1].slug;
          const prevCompleted = localStorage.getItem(`aimasters_course_completed:${prevSlug}`) === "true";
          map[courses[i].slug] = !!prevCompleted;
        }
      }
      setUnlockMap(map);
    } catch (e) {
      setUnlockMap({});
    }
  }, [courses, accessGranted]);

  if (!authChecked || !user) {
    return null;
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
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-[var(--brand-primary)]">Home</Link>
            {user ? (
              <>
                <Link href="/courses" className="hover:text-[var(--brand-primary)]">Courses</Link>
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
                <span className="inline-flex items-center rounded-full border border-neutral-300 bg-white text-neutral-900 px-4 py-2 text-sm">Welcome Back{profileName ? ', ' + profileName : (user?.displayName ? ', ' + user.displayName : '')}</span>
                <button onClick={handleLogout} className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-900 px-4 py-2 text-sm font-semibold hover:bg-neutral-50">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-900 px-4 py-2 text-sm font-semibold hover:bg-neutral-50">Login</Link>
                <Link href="/quiz" className="inline-flex items-center justify-center rounded-full bg-[var(--brand-primary)] text-white px-4 py-2 text-sm font-semibold hover:bg-[var(--brand-primary-dark)]">Start Now</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Interactive Courses</h1>
        <p className="mt-2 text-neutral-700">Choose a path and start learning. Progress is saved locally and can be synced later.</p>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c, idx) => {
            const locked = unlockMap ? !unlockMap[c.slug] : true;
            const cardInner = (
              <>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-50 text-2xl">{c.icon}</div>
                  <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-[var(--brand-primary)]">{c.title}</h3>
                </div>
                <p className="mt-3 text-neutral-700 text-sm">{c.description}</p>
                <div className="mt-4 inline-flex items-center gap-2 text-[var(--brand-primary)] font-semibold text-sm">
                  {locked ? (
                    <>
                      Locked
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M7 11V7a5 5 0 0110 0v4"/><rect x="5" y="11" width="14" height="10" rx="2"/></svg>
                    </>
                  ) : (
                    <>
                      Start course
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                    </>
                  )}
                </div>
                {locked && (
                  <p className="mt-2 text-xs text-neutral-600">
                    {idx === 0 ? (
                      <>Complete the quiz to unlock this first course.</>
                    ) : (
                      <>Complete the previous course to unlock.</>
                    )}
                  </p>
                )}
              </>
            );

            return locked ? (
              <div key={c.slug} className="group rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm opacity-60 cursor-not-allowed">
                {cardInner}
              </div>
            ) : (
              <Link key={c.slug} href={`/courses/${c.slug}`} className="group rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                {cardInner}
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}