"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { app, analytics, auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getAllCourses } from "@/lib/courses";

export default function Home() {
  const [activeStep, setActiveStep] = useState(0);
  const [user, setUser] = useState(null);
  // Dashboard data
  const courses = getAllCourses();
  const [dashboard, setDashboard] = useState({ latestQuiz: null, progresses: [] });
  // Quotes carousel data
  const quotes = [
    "Using AI doesn't make you the best... You have to learn to take the best out of it. AI Master helps you do that, perfectly!",
    "The interactive nature of the courses kept me engaged, making learning less like a chore and more like an enjoyable journey",
    "Whether you're a beginner or an expert, AI Master provides excellent resources to help you achieve your goals",
    "Using AI doesn't make you the best... You have to learn to take the best out of it. AI Master helps you do that, perfectly!",
    "The interactive nature of the courses kept me engaged, making learning less like a chore and more like an enjoyable journey",
    "Whether you're a beginner or an expert, AI Master provides excellent resources to help you achieve your goals",
  ];
  // Paths section data for 'Choose your path'
  const paths = [
    {
      title: "AI Content Creation",
      description: "Quickly produce high-quality content for blogs, websites, and social media with AI",
      icon: "✍️",
    },
    {
      title: "AI affiliate marketing",
      description: "Use AI to find products, automate promotions, and increase affiliate earnings easily",
      icon: "🏷️",
    },
    {
      title: "AI income",
      description: "Learn to use AI tools to create new income streams and grow your earnings online",
      icon: "💸",
    },
    {
      title: "AI-powered business",
      description: "Use tools to automate workflows, analyze data, and make smarter decisions that save time and money",
      icon: "🏢",
    },
    {
      title: "AI marketing",
      description: "Learn how to increase sales with AI-driven tools for ads, social media, and more...",
      icon: "📈",
    },
    {
      title: "AI learning & productivity",
      description: "Master prompts and tools that save time, improve quality, and boost everyday productivity",
      icon: "⚙️",
    },
  ];
  const [quoteIdx, setQuoteIdx] = useState(0);
  // Add carousel index for paths section
  const [pathIdx, setPathIdx] = useState(0);
  // Carousel track ref and scrolling helpers
  const pathTrackRef = useRef(null);
  const [pathStep, setPathStep] = useState(0);
  useEffect(() => {
    const measure = () => {
      if (!pathTrackRef.current || !pathTrackRef.current.children.length) return;
      const first = pathTrackRef.current.children[0];
      const gap = parseFloat(getComputedStyle(pathTrackRef.current).gap) || 24;
      setPathStep(first.getBoundingClientRect().width + gap);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  useEffect(() => {
    const el = pathTrackRef.current;
    if (!el || !pathStep) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / pathStep);
      setPathIdx(idx);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [pathStep]);
  const scrollToIndex = (next) => {
    const el = pathTrackRef.current;
    if (!el || !pathStep) return;
    const maxIndex = paths.length - 1;
    const clamped = Math.max(0, Math.min(next, maxIndex));
    el.scrollTo({ left: clamped * pathStep, behavior: "smooth" });
    setPathIdx(clamped);
  };
  const stepRefs = [useRef(null), useRef(null), useRef(null)];
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      setUser(fbUser || null);
    });
    return () => unsub();
  }, []);

  // Aggregate dashboard data from localStorage
  useEffect(() => {
    if (!user) {
      setDashboard({ latestQuiz: null, progresses: [] });
      return;
    }
    try {
      const email = user?.email || localStorage.getItem("quiz_user_email") || user?.uid;
      let latestQuiz = null;
      if (email) {
        const key = `quiz_results_by_email:${email}`;
        const raw = localStorage.getItem(key);
        const list = raw ? JSON.parse(raw) : [];
        if (list.length > 0) latestQuiz = list[list.length - 1];
      }
      const progresses = courses.map((c, idx) => {
        const total = c.lessons.length;
        let current = 0;
        try {
          const raw = localStorage.getItem(`aimasters_course_${c.slug}`);
          if (raw) {
            const parsed = JSON.parse(raw);
            current = Math.min(parsed.current || 0, total - 1);
          }
        } catch {}
        const completed = localStorage.getItem(`aimasters_course_completed:${c.slug}`) === "true";
        let locked = false;
        try {
          if (idx === 0) {
            locked = localStorage.getItem("aimasters_quiz_completed") !== "true";
          } else {
            const prevSlug = courses[idx - 1].slug;
            locked = localStorage.getItem(`aimasters_course_completed:${prevSlug}`) !== "true";
          }
        } catch {}
        const pct = completed ? 100 : Math.round(((current + 1) / total) * 100);
        const status = locked ? "Locked" : completed ? "Completed" : current > 0 ? "In Progress" : "Ready";
        return { slug: c.slug, title: c.title, description: c.description, icon: c.icon, total, current, completed, locked, pct, status };
      });
      setDashboard({ latestQuiz, progresses });
    } catch {
      setDashboard({ latestQuiz: null, progresses: [] });
    }
  }, [user, courses]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-stepindex") || "0");
            setActiveStep(idx);
          }
        });
      },
      { threshold: 0.5, rootMargin: "0px 0px -20% 0px" }
    );
    stepRefs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });
    return () => observer.disconnect();
  }, []);
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-brand-border">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 text-3xl md:text-4xl font-black italic tracking-tight drop-shadow-sm" style={{ fontFamily: '"Brush Script MT","Lucida Handwriting","Segoe Script","Pacifico",cursive' }}>AI Master</Link>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="/" className="hover:text-[var(--brand-primary)]">Home</a>
            {user ? (
              <>
                <a href="/courses" className="hover:text-[var(--brand-primary)]">Courses</a>
                <a href="/portfolio" className="hover:text-[var(--brand-primary)]">Profile</a>
              </>
            ) : (
              <>
                <Link href="/quiz" className="hover:text-[var(--brand-primary)]">Quiz</Link>
                <a href="/courses" className="hover:text-[var(--brand-primary)]">Courses</a>
              </>
            )}
            {!user && <a href="#blog" className="hover:text-[var(--brand-primary)]">Blog</a>}
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="inline-flex items-center rounded-full border border-neutral-300 bg-white text-neutral-900 px-4 py-2 text-sm">Welcome Back{(() => { try { const email = user?.email || user?.uid; const name = email ? localStorage.getItem(`aimasters_profile_name:${email}`) : null; return name ? ", " + name : (user?.displayName ? ", " + user.displayName : ""); } catch { return ""; } })()}</span>
                <button onClick={() => signOut(auth)} className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-900 px-4 py-2 text-sm font-semibold hover:bg-neutral-50">Logout</button>
              </>
            ) : (
              <>
                <a href="/login" className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-900 px-4 py-2 text-sm font-semibold hover:bg-neutral-50">Login</a>
                <Link href="/quiz" className="inline-flex items-center justify-center rounded-full bg-[var(--brand-primary)] text-white px-4 py-2 text-sm font-semibold hover:bg-[var(--brand-primary-dark)]">Start Now</Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      {!user && (
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="h-full w-full bg-gradient-to-b from-white via-neutral-50 to-neutral-100" />
        </div>
        <div className="mx-auto max-w-7xl px-6 pt-16 pb-12 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              Become the Master of AI
            </h1>
            <p className="mt-4 text-lg text-neutral-700">
              Learn how AI can increase your income and improve your life
            </p>
            {/* Quotes carousel moved to above How AI Master works */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/quiz" className="inline-flex items-center justify-center rounded-full bg-[var(--brand-primary)] text-white px-5 py-3 text-sm font-semibold hover:bg-[var(--brand-primary-dark)]">Start Now</Link>
            </div>
            <div className="mt-6 text-sm text-neutral-600">
              More than <span className="font-semibold">1,210,540+</span> people joined
            </div>
          </div>
          <div className="relative">
            <div className="w-full rounded-2xl border border-neutral-200 bg-white shadow-sm">
              <div className="h-8 w-full rounded-t-2xl bg-indigo-600" />
              <div className="p-6">
                <div className="rounded-xl border border-neutral-200 bg-white h-[220px] md:h-[280px] shadow-sm" />
                <div className="mt-6 flex items-center rounded-full border border-neutral-300 bg-white shadow-sm pl-4 pr-2 py-2">
                  <input type="text" defaultValue="Draft a follow-up email to a client" className="flex-1 bg-transparent outline-none text-sm" />
                  <button aria-label="Submit" className="ml-2 inline-flex items-center justify-center rounded-full bg-indigo-600 text-white p-2 shadow-sm">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {user && (
        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Your Dashboard</h2>
            {(() => {
              try {
                const email = user?.email || user?.uid;
                const name = email ? localStorage.getItem(`aimasters_profile_name:${email}`) : null;
                return <div className="hidden md:block text-sm text-neutral-600">Welcome Back{name ? ", " + name : (user?.displayName ? ", " + user.displayName : "")}</div>;
              } catch {
                return null;
              }
            })()}
          </div>

          {/* Latest quiz score */}
          {dashboard.latestQuiz && (
            <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-neutral-600">Latest Quiz</div>
                  <div className="mt-1 text-lg font-semibold">{Math.round(dashboard.latestQuiz.score.percent)}% • Level: {dashboard.latestQuiz.score.level}</div>
                  <div className="mt-1 text-xs text-neutral-600">Saved {new Date(dashboard.latestQuiz.timestamp).toLocaleString()}</div>
                </div>
                <Link href="/quiz" className="inline-flex items-center rounded-full bg-[var(--brand-primary)] text-white px-4 py-2 text-sm font-semibold hover:bg-[var(--brand-primary-dark)]">Retake Quiz</Link>
              </div>
              <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {dashboard.latestQuiz.score.perCategory?.map((c, i) => (
                  <div key={i} className="rounded-lg border border-neutral-200 bg-white p-3">
                    <div className="text-sm font-medium">{c.category}</div>
                    <div className="mt-2 w-full h-2 rounded-full bg-neutral-200">
                      <div className="h-2 rounded-full bg-[var(--brand-primary)]" style={{ width: `${c.pct}%` }} />
                    </div>
                    <div className="mt-1 text-xs text-neutral-600">{c.correct}/{c.total} • {Math.round(c.pct)}%</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Course progress */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold">Your Courses</h3>
            <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboard.progresses.map((p) => (
                <div key={p.slug} className={`rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm ${p.locked ? "opacity-60" : ""}`}>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-50 text-2xl">{p.icon}</div>
                    <div>
                      <div className="text-lg font-semibold">{p.title}</div>
                      <div className="text-sm text-neutral-600">{p.status}</div>
                    </div>
                  </div>
                  <p className="mt-3 text-neutral-700 text-sm">{p.description}</p>
                  <div className="mt-4 w-full h-2 rounded-full bg-neutral-200">
                    <div className={`h-2 rounded-full ${p.completed ? "bg-green-600" : "bg-[var(--brand-primary)]"}`} style={{ width: `${p.pct}%` }} />
                  </div>
                  <div className="mt-1 text-xs text-neutral-600">Lesson {Math.min(p.current + 1, p.total)} of {p.total}</div>
                  <div className="mt-4">
                    {p.locked ? (
                      <a href={p.slug === courses[0]?.slug ? "/quiz" : "/courses"} className="inline-flex items-center rounded-full bg-neutral-200 text-neutral-700 px-4 py-2 text-sm font-semibold cursor-not-allowed">Locked</a>
                    ) : p.completed ? (
                      <a href={`/courses/${p.slug}`} className="inline-flex items-center rounded-full border border-neutral-300 bg-white text-neutral-900 px-4 py-2 text-sm font-semibold hover:bg-neutral-50">Review Course</a>
                    ) : (
                      <a href={`/courses/${p.slug}`} className="inline-flex items-center rounded-full bg-[var(--brand-primary)] text-white px-4 py-2 text-sm font-semibold hover:bg-[var(--brand-primary-dark)]">Continue</a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}


      {!user && (<>

      {/* Stats (hidden legacy) */}

      <section id="stats-legacy" className="hidden mx-auto max-w-7xl px-6 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">AI Master in action</h2>
        <p className="mt-2 text-neutral-600">See how Coursiv empowers learners: our success in numbers</p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-10">
          <Stat value="1,212k+" exact="1,212,594" label="Users learned new skills" />
          <Stat value="10,317k+" exact="10,317,216" label="Minutes of content consumed" />
          <Stat value="124k+" exact="124,912" label="AI prompts written" />
        </div>
        <div className="mt-12 relative overflow-hidden rounded-2xl border border-neutral-200">
          <img
            src="https://coursiv.io/_next/static/media/metrics-map.839602af.png"
            alt="AI Master learners across the world"
            className="w-full h-auto"
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
        </div>
      </section>

      {/* Certificate (hidden legacy) */}
      <section id="certificate-legacy" aria-hidden="true" data-legacy="true" className="hidden mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-3xl border border-neutral-200 bg-gradient-to-br from-white via-[var(--brand-tint)]/60 to-white p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="order-last md:order-first">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Earn a certificate that proves your AI skills</h2>
              <p className="mt-3 text-neutral-700">
                Complete your AI course and receive a certificate to highlight your expertise. It’s proof of the valuable skills you’ve gained to tackle challenges, achieve your goals, and move forward in your career or personal projects.
              </p>
              <div className="mt-6">
                <Link href="/quiz" className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand-primary)] text-white px-5 py-3 text-sm font-semibold hover:bg-[var(--brand-primary-dark)]">
                  Get Certificate Today
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                </Link>
              </div>
            </div>
            <div className="order-first md:order-last">
              <div className="relative w-full rounded-2xl border border-neutral-200 bg-white shadow-sm p-3">
                <img
                  src="https://coursiv.io/_next/static/media/certificate.9be88eb8.png"
                  alt="AI Masters certificate preview"
                  className="w-full h-auto rounded-xl"
                  loading="lazy"
                />
                {/* Overlay brand update to replace Coursiv with AI Masters */}
                <div className="pointer-events-none absolute bottom-6 left-6">
                  <span className="rounded-md bg-white/70 backdrop-blur-sm px-2.5 py-1 text-[var(--brand-primary)] text-sm md:text-base font-semibold italic tracking-tight">
                    AI Masters
                  </span>
                </div>
                {/* Signature overlay */}
                <div className="pointer-events-none absolute bottom-8 right-8 text-right z-10">
                  <div className="rounded-md bg-white/90 backdrop-blur-md px-4 py-3 w-[240px] min-h-[64px] shadow-sm">
                    <div
                      className="relative text-[26px] md:text-[30px] leading-none font-semibold text-[var(--brand-primary)] italic tracking-tight"
                      style={{ fontFamily: '"Brush Script MT","Lucida Handwriting","Segoe Script","Pacifico",cursive' }}
                    >
                      Gibson Coutley
                      <span className="absolute left-0 right-0 -bottom-1 h-[2px] bg-gradient-to-r from-transparent via-[var(--brand-primary)] to-transparent opacity-60" aria-hidden="true"></span>
                    </div>
                    <div className="mt-1 text-[11px] md:text-xs text-neutral-700 italic">Founder, AI Master</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quotes carousel positioned above How AI Master works */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="mt-6 md:mt-10 border-t border-neutral-200 pt-10 pb-12 border-b">
          <div className="relative mx-auto max-w-4xl text-center min-h-[120px]">
            {quotes.map((q, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-opacity duration-700 ${i === quoteIdx ? 'opacity-100' : 'opacity-0'} `}
                aria-hidden={i !== quoteIdx}
              >
                <blockquote className="text-2xl md:text-3xl font-semibold italic text-indigo-900">
                  “{q}”
                </blockquote>
                <div className="mt-6 flex items-center justify-center gap-1">
                  {quotes.map((_, di) => (
                    <span
                      key={di}
                      className={`h-1 w-6 rounded-full ${di === quoteIdx ? 'bg-[var(--brand-primary)]' : 'bg-neutral-300'}`}
                    />
                  ))}
                </div>
              </div>
            ))}
            {/* Container height spacer */}
            <div className="opacity-0 select-none">
              <blockquote className="text-2xl md:text-3xl font-semibold italic">placeholder</blockquote>
            </div>
          </div>
        </div>
      </section>



      {/* Why people love AI Master (placed above Choose your path) */}
      <section id="why-love" className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-[28px] border border-neutral-200 bg-white/80 backdrop-blur-sm p-8 md:p-12 shadow-sm">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Text column */}
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Why people love AI Master</h2>
              <p className="mt-2 text-neutral-600 max-w-2xl">Thousands of users trust AI Master to learn AI. Get the tools, skills, and confidence to grow in your career.</p>

              <div className="mt-8 space-y-5">
                {/* Item 1 */}
                <div className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center text-indigo-600">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                      <path d="M12 3l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5 1.5-4z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6.5 6l.8 2M17.5 6l-.8 2" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </span>
                  <div>
                    <div className="font-semibold text-neutral-900">Quick and easy to follow:</div>
                    <p className="text-neutral-700">Learn AI in just 15 minutes a day—perfect for any age or experience level.</p>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center text-indigo-600">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                      <path d="M12 4l8 4-8 4-8-4 8-4z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M4 12l8 4 8-4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M4 16l8 4 8-4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <div>
                    <div className="font-semibold text-neutral-900">Multiple learning formats:</div>
                    <p className="text-neutral-700">Choose from audio lessons, step-by-step guides, and interactive courses to suit your style.</p>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center text-indigo-600">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                      <path d="M12 21s6-4.5 6-9a6 6 0 0 0-12 0c0 4.5 6 9 6 9z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="2.5" strokeWidth="1.5" />
                    </svg>
                  </span>
                  <div>
                    <div className="font-semibold text-neutral-900">Accessible anytime, anywhere:</div>
                    <p className="text-neutral-700">Our app is available on both the App Store and Play Market for learning on the go.</p>
                  </div>
                </div>

                {/* Item 4 */}
                <div className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center text-indigo-600">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                      <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="1.5" strokeLinecap="round"/>
                      <circle cx="8" cy="6" r="2" strokeWidth="1.5"/>
                      <circle cx="16" cy="12" r="2" strokeWidth="1.5"/>
                      <circle cx="10" cy="18" r="2" strokeWidth="1.5"/>
                    </svg>
                  </span>
                  <div>
                    <div className="font-semibold text-neutral-900">Practical and actionable:</div>
                    <p className="text-neutral-700">Gain hands-on experience with our AI tools which you can apply immediately to increase income-potential.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Image column */}
            <div>
              <div className="mx-auto max-w-md md:max-w-none">
                <div className="relative">
                  <img
                    src="https://coursiv.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fphone.45cc869c.png&w=640&q=75"
                    alt="AI Masters mobile app preview"
                    className="w-full h-auto object-contain"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* Choose your path */}
        <section id="choose-your-path" className="mx-auto max-w-7xl px-6 py-20">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-indigo-900">Choose your path</h2>
            <p className="mt-3 max-w-2xl mx-auto text-neutral-600">Explore different paths where you could apply AI that will help you succeed in today’s digital world</p>
          </div>

          <div className="mt-12 relative">
            {/* Left chevron */}
            <button
              aria-label="Previous"
              onClick={() => scrollToIndex(pathIdx - 1)}
              className="absolute left-6 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 shadow-sm hidden sm:inline-flex items-center justify-center"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
            </button>

            {/* Cards track */}
            <div className="mt-6 overflow-hidden">
              <div ref={pathTrackRef} className="flex gap-6 snap-x snap-mandatory overflow-x-auto scroll-smooth pb-2">
                {paths.map((item, idx) => (
                  <div key={idx} className="snap-start flex-none w-[85%] sm:w-[55%] md:w-[32%] group relative rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md transition min-h-[180px]">
                    <div className="flex items-center">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-b from-indigo-50 to-white text-indigo-600 ring-1 ring-neutral-200">
                        <span aria-hidden>{item.icon}</span>
                      </div>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-neutral-900">{item.title}</h3>
                    <p className="mt-2 text-sm text-neutral-700">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile back/next */}
            <div className="mt-4 sm:hidden">
              <button
                aria-label="Back"
                onClick={() => scrollToIndex(pathIdx - 1)}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
                <span>Back</span>
              </button>
            </div>

            {/* Right chevron */}
          </div>
        </section>

        {/* Income CTA */}
      <section id="income-cta" className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-[28px] border border-neutral-200 bg-gradient-to-br from-white via-[var(--brand-tint)]/10 to-white p-8 md:p-12 shadow-sm">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-first">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Increase your income potential with AI Master</h2>
              <p className="mt-3 text-neutral-600 max-w-md">Learn new digital skills and AI tools to improve your work and boost your income</p>
              <div className="mt-6">
                <Link href="/quiz" className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand-primary)] text-white px-5 py-3 text-sm font-semibold hover:bg-[var(--brand-primary-dark)]">
                  Start Now
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                </Link>
              </div>
            </div>
            <div className="order-last">
              <div className="relative ml-auto max-w-[380px] rounded-2xl overflow-hidden aspect-square md:aspect-[5/4] bg-white">
                
                <img
                  src="https://coursiv.io/_next/static/media/cta-image.c8e4d71f.png"
                  alt="Learners avatars CTA graphic"
                  className="h-full w-full object-contain object-center"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* How AI Master works (visible modernized) */}
      <section id="how-ai-master-works" className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-[28px] bg-gradient-to-br from-neutral-50 via-white to-neutral-100 p-8 md:p-12 shadow-md">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-center">How AI Master works</h2>
          <p className="mt-2 text-neutral-600 text-center">Learn at your own pace and discover how AI and digital tools can help you grow</p>

          <div className="mt-10 space-y-12">
            {/* Step 1 */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-first">
                <div
                  ref={stepRefs[0]}
                  data-stepindex="0"
                  className={`rounded-2xl border border-neutral-200 bg-white shadow-sm p-6 transition-colors duration-500 ${activeStep === 0 ? "ring-2 ring-[var(--brand-primary)] bg-[var(--brand-tint)]/5" : ""}`}
                >
                  <span className="inline-flex items-center rounded-full bg-indigo-600 text-white text-xs font-semibold px-2.5 py-1">Step 1</span>
                  <h3 className="mt-3 text-xl font-semibold text-neutral-900">Get your personal learning plan</h3>
                  <p className="mt-2 text-neutral-700">You begin by defining your unique goals and needs. From there, a personalized learning plan is created to help you focus on the most relevant skills and tools, ensuring you stay on track and motivated.</p>
                </div>
              </div>
              <div className="order-last">
                <div className="rounded-2xl overflow-hidden aspect-[4/3] md:aspect-[5/3]">
                  <img
                    src="https://coursiv.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F1.5d09050c.png&w=750&q=75"
                    alt="Your Plan is Ready UI"
                    className={`${activeStep === 0 ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-[0.98] translate-y-4"} h-full w-full object-contain object-center transition-all duration-700`}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-first">
                <div
                  ref={stepRefs[1]}
                  data-stepindex="1"
                  className={`rounded-2xl border border-neutral-200 bg-white shadow-sm p-6 transition-colors duration-500 ${activeStep === 1 ? "ring-2 ring-[var(--brand-primary)] bg-[var(--brand-tint)]/5" : ""}`}
                >
                  <span className="inline-flex items-center rounded-full bg-indigo-600 text-white text-xs font-semibold px-2.5 py-1">Step 2</span>
                  <h3 className="mt-3 text-xl font-semibold text-neutral-900">Learn the skills you need</h3>
                  <p className="mt-2 text-neutral-700">Our easy-to-follow lessons will guide you through practical, hands-on learning. You’ll master the AI tools and other skills that fit your goals, making learning simple and efficient—without overwhelming you.</p>
                </div>
              </div>
              <div className="order-last">
                <div className="rounded-2xl overflow-hidden aspect-[4/3] md:aspect-[5/3]">
                  <img
                    src="https://coursiv.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F2.b8d02630.png&w=750&q=75"
                    alt="Skills flow UI"
                    className={`${activeStep === 1 ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-[0.98] translate-y-4"} h-full w-full object-contain object-center transition-all duration-700`}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-first">
                <div
                  ref={stepRefs[2]}
                  data-stepindex="2"
                  className={`rounded-2xl border border-neutral-200 bg-white shadow-sm p-6 transition-colors duration-500 ${activeStep === 2 ? "ring-2 ring-[var(--brand-primary)] bg-[var(--brand-tint)]/5" : ""}`}
                >
                  <span className="inline-flex items-center rounded-full bg-indigo-600 text-white text-xs font-semibold px-2.5 py-1">Step 3</span>
                  <h3 className="mt-3 text-xl font-semibold text-neutral-900">Master AI for your goals</h3>
                  <p className="mt-2 text-neutral-700">Once you’ve learned the basics, you’ll dive deeper into applying AI to achieve your personal and professional objectives. With each skill mastered, you’ll gain the confidence to use AI to boost your productivity, income, and success.</p>
                </div>
              </div>
              <div className="order-last">
                <div className="rounded-2xl overflow-hidden aspect-[4/3] md:aspect-[5/3]">
                  <img
                    src="https://coursiv.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F3.1755dcc3.png&w=750&q=75"
                    alt="Amazing feedback UI"
                    className={`${activeStep === 2 ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-[0.98] translate-y-4"} h-full w-full object-contain object-center transition-all duration-700`}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="mx-auto max-w-7xl px-6 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">AI Master in action</h2>
        <p className="mt-2 text-neutral-600">See how Coursiv empowers learners: our success in numbers</p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-10">
          <Stat value="1,212k+" exact="1,212,594" label="Users learned new skills" />
          <Stat value="10,317k+" exact="10,317,216" label="Minutes of content consumed" />
          <Stat value="124k+" exact="124,912" label="AI prompts written" />
        </div>
        <div className="mt-12 relative overflow-hidden rounded-2xl border border-neutral-200">
          <img
            src="https://coursiv.io/_next/static/media/metrics-map.839602af.png"
            alt="AI Masters learners across the world"
            className="w-full h-auto"
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
        </div>
      </section>

      {/* Certificate */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-3xl border border-neutral-200 bg-gradient-to-br from-white via-[var(--brand-tint)]/60 to-white p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="order-last md:order-first">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Earn a certificate that proves your AI skills</h2>
              <p className="mt-3 text-neutral-700">
                Complete your AI course and receive a certificate to highlight your expertise. It’s proof of the valuable skills you’ve gained to tackle challenges, achieve your goals, and move forward in your career or personal projects.
              </p>
              <div className="mt-6">
                <Link href="/quiz" className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand-primary)] text-white px-5 py-3 text-sm font-semibold shadow-sm hover:shadow-md hover:bg-[var(--brand-primary-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--brand-primary)] transition">
                  Get Certificate Today
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                </Link>
              </div>
            </div>
            <div className="order-first md:order-last">
              <div className="relative w-full rounded-2xl border border-neutral-200 bg-white shadow-sm p-3">
                <img
                  src="https://coursiv.io/_next/static/media/certificate.9be88eb8.png"
                  alt="AI Masters certificate preview"
                  className="w-full h-auto rounded-xl"
                  loading="lazy"
                />
                {/* Overlay brand update to replace Coursiv with AI Masters */}
                <div className="pointer-events-none absolute bottom-6 left-6">
                  <span className="rounded-md bg-white/70 backdrop-blur-sm px-2.5 py-1 text-[var(--brand-primary)] text-sm md:text-base font-semibold italic tracking-tight">
                    AI Masters
                  </span>
                </div>
                {/* Signature overlay */}
                <div className="pointer-events-none absolute bottom-8 right-8 text-right z-10">
                  <div className="rounded-md bg-white/90 backdrop-blur-md px-4 py-3 w-[240px] min-h-[64px] shadow-sm">
                    <div
                      className="text-[24px] md:text-[28px] leading-none font-semibold text-[var(--brand-primary)] italic tracking-tight"
                      style={{ fontFamily: '"Brush Script MT","Lucida Handwriting","Segoe Script","Pacifico",cursive' }}
                    >
                      Gibson Coutley
                    </div>
                    <div className="mt-1 text-[11px] md:text-xs text-neutral-600/95 italic">Founder, AI Master</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* See how AI Master changes lives */}
      <section id="see-how" className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-[28px] border border-neutral-200 bg-white p-8 md:p-12 shadow-sm">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">See how AI Master changes lives</h2>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <img
                  src="https://coursiv.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F1.4e7ecbed.png&w=64&q=75"
                  alt="Avatar of Shahe K."
                  className="h-10 w-10 rounded-full object-cover"
                  loading="lazy"
                />
                <div className="font-semibold text-neutral-900">Shahe K.</div>
              </div>
              <p className="mt-4 text-neutral-700">
                I have been searching for AI lessons to help me reach my career objectives. I decided to invest in Coursiv, and I have no regrets about that choice. Coursiv offers prompts and a step-by-step teaching approach that motivates and rewards the learning experience.
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <img
                  src="https://coursiv.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F2.812d6860.png&w=64&q=75"
                  alt="Avatar of Regina Brown"
                  className="h-10 w-10 rounded-full object-cover"
                  loading="lazy"
                />
                <div className="font-semibold text-neutral-900">Regina Brown</div>
              </div>
              <p className="mt-4 text-neutral-700">
                As someone knowledgeable in AI, I sought to enhance my understanding of using AI for income sources. Coursiv simplified this journey with its clear and easy follow courses. I gained a lot of knowledge, and Coursiv brought attention to several key points that I had previously missed.
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <img
                  src="https://coursiv.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F3.a98faf95.png&w=64&q=75"
                  alt="Avatar of Corey Rein"
                  className="h-10 w-10 rounded-full object-cover"
                  loading="lazy"
                />
                <div className="font-semibold text-neutral-900">Corey Rein</div>
              </div>
              <p className="mt-4 text-neutral-700">
                I gained valuable insights and practical skills that I can apply in my own work. The course promotes interactive learning, enabling you to practice what you've learned through hands-on activities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How Coursiv works */}
      <section id="how-it-works" className="hidden mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-center">How Coursiv works</h2>
        <p className="mt-2 text-neutral-600 text-center">Learn at your own pace and discover how AI and digital tools can help you grow</p>

        {/* Step 1 */}
        <div className="mt-10 grid md:grid-cols-2 gap-8 items-center">
          <div className="order-first">
            <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm p-6">
              <h3 className="text-xl font-semibold text-neutral-900">Step 1: Get your personal learning plan</h3>
              <p className="mt-2 text-neutral-700">You begin by defining your unique goals and needs. From there, a personalized learning plan is created to help you focus on the most relevant skills and tools, ensuring you stay on track and motivated.</p>
            </div>
          </div>
          <div className="order-last">
            <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm p-4">
              <img
                src="https://coursiv.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F1.5d09050c.png&w=750&q=75"
                alt="Your Plan is Ready UI"
                className="w-full h-auto rounded-xl"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="mt-16 grid md:grid-cols-2 gap-8 items-center">
          <div className="order-first">
            <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm p-6">
              <h3 className="text-xl font-semibold text-neutral-900">Step 2: Learn the skills you need</h3>
              <p className="mt-2 text-neutral-700">Our easy-to-follow lessons will guide you through practical, hands-on learning. You’ll master the AI tools and other skills that fit your goals, making learning simple and efficient—without overwhelming you.</p>
            </div>
          </div>
          <div className="order-last">
            <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm p-4">
              <img
                src="https://coursiv.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F2.b8d02630.png&w=750&q=75"
                alt="Skills flow UI"
                className="w-full h-auto rounded-xl"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="mt-16 grid md:grid-cols-2 gap-8 items-center">
          <div className="order-first">
            <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm p-6">
              <h3 className="text-xl font-semibold text-neutral-900">Step 3: Master AI for your goals</h3>
              <p className="mt-2 text-neutral-700">Once you’ve learned the basics, you’ll dive deeper into applying AI to achieve your personal and professional objectives. With each skill mastered, you’ll gain the confidence to use AI to boost your productivity, income, and success.</p>
            </div>
          </div>
          <div className="order-last">
            <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm p-4">
              <img
                src="https://coursiv.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F3.1755dcc3.png&w=750&q=75"
                alt="Amazing feedback UI"
                className="w-full h-auto rounded-xl"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>


      {/* Why people love AI Master moved above How AI Master works */}

      {/* Choose your path moved above How AI Master works */}

      {/* 28-day challenge */}
      <section id="challenge" className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-[28px] border border-neutral-200 bg-gradient-to-br from-orange-50 via-white to-indigo-50 p-8 md:p-12 shadow-md">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">Learn new AI every day in our 28‑day Challenge</h2>
            <p className="mt-3 text-neutral-700">Don’t let your goals overwhelm you. Learn AI skills tailored to your needs and everyday tasks.</p>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <h3 className="text-sm font-semibold text-neutral-900">AI Mastery</h3>
            <div className="h-px flex-1 bg-neutral-200"></div>
          </div>

          {(() => {
            const challengeIcons = [
              "https://coursiv.io/_next/image?url=%2Fassets%2Fhome%2Ficons%2Fchallenges%2F1.png&w=96&q=100",
              "https://coursiv.io/_next/image?url=%2Fassets%2Fhome%2Ficons%2Fchallenges%2F2.png&w=96&q=100",
              "https://coursiv.io/_next/image?url=%2Fassets%2Fhome%2Ficons%2Fchallenges%2F3.png&w=96&q=100",
              "https://coursiv.io/_next/image?url=%2Fassets%2Fhome%2Ficons%2Fchallenges%2F4.png&w=96&q=100",
              "https://coursiv.io/_next/image?url=%2Fassets%2Fhome%2Ficons%2Fchallenges%2F5.png&w=96&q=100",
              "https://coursiv.io/_next/image?url=%2Fassets%2Fhome%2Ficons%2Fchallenges%2F6.png&w=96&q=100",
              "https://coursiv.io/_next/image?url=%2Fassets%2Fhome%2Ficons%2Fchallenges%2F7.png&w=96&q=100",
              "https://coursiv.io/_next/image?url=%2Fassets%2Fhome%2Ficons%2Fchallenges%2F8.png&w=96&q=100",
            ];
            const chips = [
              "AI Skills",
              "Business Growth",
              "Boost Productivity",
              "Save Time",
              "Advance Career",
            ];
            return (
              <>
                {/* Icons row */}
                <div className="mt-6 flex flex-wrap justify-center gap-6">
                  {challengeIcons.map((src, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="h-20 w-20 rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
                        <img
                          src={src}
                          alt={`Day ${i + 1} icon`}
                          className="h-full w-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      <div className="mt-2 text-xs text-neutral-600">Day {i + 1}</div>
                    </div>
                  ))}
                </div>

                {/* Chips */}
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  {chips.map((txt) => (
                    <span
                      key={txt}
                      className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-sm text-neutral-800 shadow-sm"
                    >
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        className="h-4 w-4 text-indigo-600"
                      >
                        <path d="M16.704 5.296a1 1 0 0 1 0 1.414l-7.25 7.25a1 1 0 0 1-1.414 0L3.296 9.216a1 1 0 1 1 1.414-1.414l3.04 3.04 6.536-6.536a1 1 0 0 1 1.414 0z" />
                      </svg>
                      {txt}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-8 flex justify-center">
                  <Link
                    href="/quiz"
                    className="inline-flex items-center rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 text-white font-semibold shadow-md hover:from-indigo-600 hover:to-violet-600 transition"
                  >
                    Join Our Challenge
                  </Link>
                </div>
              </>
            );
          })()}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Left: Heading and description */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Frequently asked questions</h2>
            <p className="mt-2 text-neutral-600">Find answers to common questions about AI Master</p>
          </div>

          {/* Right: Accordion list */}
          <div className="space-y-3">
            <details className="group rounded-xl border border-neutral-200 bg-white shadow-sm">
              <summary className="flex items-center justify-between cursor-pointer list-none px-4 py-4 text-base font-semibold">
                <span>What is AI Master?</span>
                <span className="ml-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="px-4 pb-4 text-neutral-700">
                AI Master helps you learn AI tools and skills to improve your work and boost your income through short, practical lessons.
              </div>
            </details>

            <details className="group rounded-xl border border-neutral-200 bg-white shadow-sm">
              <summary className="flex items-center justify-between cursor-pointer list-none px-4 py-4 text-base font-semibold">
                <span>How to download and use AI Master?</span>
                <span className="ml-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="px-4 pb-4 text-neutral-700">
                Access lessons on the web and learn on the go with our mobile app. Sign up and start learning in minutes.
              </div>
            </details>

            <details className="group rounded-xl border border-neutral-200 bg-white shadow-sm">
              <summary className="flex items-center justify-between cursor-pointer list-none px-4 py-4 text-base font-semibold">
                <span>How to log in into AI Master?</span>
                <span className="ml-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="px-4 pb-4 text-neutral-700">
                Use your email to create an account. You’ll be able to log in securely from any device.
              </div>
            </details>

            <details className="group rounded-xl border border-neutral-200 bg-white shadow-sm">
              <summary className="flex items-center justify-between cursor-pointer list-none px-4 py-4 text-base font-semibold">
                <span>How to cancel AI Master subscription?</span>
                <span className="ml-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="px-4 pb-4 text-neutral-700">
                You can manage or cancel your subscription anytime in your account settings.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* Reviews (moved below FAQ) */}
      <section id="reviews" className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Join 300,000+ learners around the world</h2>
            <div className="mt-3 text-sm text-neutral-600">
              More than 16,000+
              <span className="ml-2 inline-flex items-center rounded-md bg-green-600 text-white px-2 py-0.5 font-semibold">5★</span>
              <span className="ml-2">on Trustpilot</span>
            </div>
          </div>
          <div className="hidden md:block relative md:justify-self-end w-[460px]">
            <img
              src="https://coursiv.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fbanner.87d432ec.png&w=640&q=75"
              alt="AI Master learners banner"
              className="h-48 w-auto object-contain ml-4"
              loading="lazy"
            />
          </div>
        </div>

        {/* Carousel of 3 reviews with arrows */}
        <div className="mt-10 relative">
          <button
            type="button"
            aria-label="Previous reviews"
            onClick={() => {
              const el = document.getElementById('reviews-track');
              if (el) el.scrollBy({ left: -400, behavior: 'smooth' });
            }}
            className="absolute -left-4 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 bg-white shadow hover:bg-neutral-50"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-neutral-700" aria-hidden="true">
              <path d="M12.293 15.707a1 1 0 0 1-1.414 0l-5-5a1 1 0 0 1 0-1.414l5-5a1 1 0 1 1 1.414 1.414L8.414 10l3.879 3.879a1 1 0 0 1 0 1.828z" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next reviews"
            onClick={() => {
              const el = document.getElementById('reviews-track');
              if (el) el.scrollBy({ left: 400, behavior: 'smooth' });
            }}
            className="absolute -right-4 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 bg-white shadow hover:bg-neutral-50"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-neutral-700" aria-hidden="true">
              <path d="M7.707 4.293a1 1 0 0 1 1.414 0l5 5a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414-1.414L11.586 10 7.707 6.121a1 1 0 0 1 0-1.828z" />
            </svg>
          </button>

          <div id="reviews-track" className="flex gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2">
            {/* Card 1 */}
            <div className="snap-start min-w-[320px] md:min-w-[360px] rounded-2xl border border-neutral-200 bg-white shadow-sm p-6">
              <div className="flex items-center text-orange-500">
                {/* 5 stars */}
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M12 17.3l-6.18 3.25 1.18-6.88L1 8.9l6.91-1 3.09-6.27 3.09 6.27 6.91 1-5 4.77 1.18 6.88z"/></svg>
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M12 17.3l-6.18 3.25 1.18-6.88L1 8.9l6.91-1 3.09-6.27 3.09 6.27 6.91 1-5 4.77 1.18 6.88z"/></svg>
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M12 17.3l-6.18 3.25 1.18-6.88L1 8.9l6.91-1 3.09-6.27 3.09 6.27 6.91 1-5 4.77 1.18 6.88z"/></svg>
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M12 17.3l-6.18 3.25 1.18-6.88L1 8.9l6.91-1 3.09-6.27 3.09 6.27 6.91 1-5 4.77 1.18 6.88z"/></svg>
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M12 17.3l-6.18 3.25 1.18-6.88L1 8.9l6.91-1 3.09-6.27 3.09 6.27 6.91 1-5 4.77 1.18 6.88z"/></svg>
              </div>
              <p className="mt-4 text-neutral-700">I needed assistance from my 15-year-old son to navigate the initial set of questions, as I wasn't sure how to begin. However, once I passed that first hurdle, I was eager to continue! Everything related to AI, chatbots, and LLMs is quite new to me, but after completing the first exercise and module, I'm very motivated to explore further and see how it can help me achieve my personal success goals.</p>
              <div className="mt-4 font-semibold text-neutral-900">@Madison.m</div>
            </div>

            {/* Card 2 */}
            <div className="snap-start min-w-[320px] md:min-w-[360px] rounded-2xl border border-neutral-200 bg-white shadow-sm p-6">
              <div className="flex items-center text-orange-500">
                {/* 5 stars */}
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M12 17.3l-6.18 3.25 1.18-6.88L1 8.9l6.91-1 3.09-6.27 3.09 6.27 6.91 1-5 4.77 1.18 6.88z"/></svg>
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M12 17.3l-6.18 3.25 1.18-6.88L1 8.9l6.91-1 3.09-6.27 3.09 6.27 6.91 1-5 4.77 1.18 6.88z"/></svg>
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M12 17.3l-6.18 3.25 1.18-6.88L1 8.9l6.91-1 3.09-6.27 3.09 6.27 6.91 1-5 4.77 1.18 6.88z"/></svg>
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M12 17.3l-6.18 3.25 1.18-6.88L1 8.9l6.91-1 3.09-6.27 3.09 6.27 6.91 1-5 4.77 1.18 6.88z"/></svg>
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M12 17.3l-6.18 3.25 1.18-6.88L1 8.9l6.91-1 3.09-6.27 3.09 6.27 6.91 1-5 4.77 1.18 6.88z"/></svg>
              </div>
              <p className="mt-4 text-neutral-700">AI Master is an excellent platform for learning AI. It provides clear instructions that greatly assist students in understanding the topic. So far, it’s the best course I’ve enrolled in.</p>
              <div className="mt-4 font-semibold text-neutral-900">@orange_s</div>
            </div>

            {/* Card 3 */}
            <div className="snap-start min-w-[320px] md:min-w-[360px] rounded-2xl border border-neutral-200 bg-white shadow-sm p-6">
              <div className="flex items-center text-orange-500">
                {/* 5 stars */}
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M12 17.3l-6.18 3.25 1.18-6.88L1 8.9l6.91-1 3.09-6.27 3.09 6.27 6.91 1-5 4.77 1.18 6.88z"/></svg>
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M12 17.3l-6.18 3.25 1.18-6.88L1 8.9l6.91-1 3.09-6.27 3.09 6.27 6.91 1-5 4.77 1.18 6.88z"/></svg>
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M12 17.3l-6.18 3.25 1.18-6.88L1 8.9l6.91-1 3.09-6.27 3.09 6.27 6.91 1-5 4.77 1.18 6.88z"/></svg>
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M12 17.3l-6.18 3.25 1.18-6.88L1 8.9l6.91-1 3.09-6.27 3.09 6.27 6.91 1-5 4.77 1.18 6.88z"/></svg>
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M12 17.3l-6.18 3.25 1.18-6.88L1 8.9l6.91-1 3.09-6.27 3.09 6.27 6.91 1-5 4.77 1.18 6.88z"/></svg>
              </div>
              <p className="mt-4 text-neutral-700">Currently going through the AI courses and feeling much more confident catching up to the advancements in AI over the past few years. The material is engaging, easy to grasp, and practical. I wish this learning approach was applied to other subjects as well.</p>
              <div className="mt-4 font-semibold text-neutral-900">@drkchau</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA: Start your AI journey with Coursiv today */}
       <section id="cta-start" className="mx-auto max-w-7xl px-2 py-6">
         <div
           className="rounded-[16px] border border-[#D3D3D3]"
           style={{
             backgroundImage: 'url("/_next/static/media/bg.c50e9da8.png")',
             backgroundSize: 'cover',
             backgroundPosition: 'center center',
           }}
         >
           <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-y-[24px] gap-x-10 px-2 lg:flex-row">
             <div className="order-2 flex w-full flex-col items-center px-10 pt-10 pb-8 lg:order-1 lg:block lg:py-[70px] lg:px-0">
               <h2 className="text-center text-[28px] font-medium leading-[32px] tracking-[-1px] lg:text-left lg:text-[48px] lg:leading-[56px]">Start your AI journey with Coursiv today!</h2>
               <p className="mt-2 max-w-[638px] text-center text-[16px] leading-[24px] tracking-[-0.2px] opacity-80 lg:mt-6 lg:text-left lg:text-[20px] lg:leading-[28px]">Learn today, take control of your future, and grow your income with new digital skills and AI</p>
               <Link href="/quiz" className="flex cursor-pointer items-center justify-center rounded-[24px] bg-[#5653FE] px-[69px] py-[12px] text-base font-semibold leading-[24px] text-white mt-10 lg:px-6">
                 <span className="ml-1 text-base font-medium">Start Now</span>
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" className="hidden h-6 w-6 lg:block">
                   <path fill="#fff" d="M16.375 12.065c0 .232-.082.43-.267.608l-5.332 5.216a.753.753 0 0 1-.553.225.786.786 0 0 1-.8-.793c0-.219.096-.417.24-.567l4.812-4.69-4.813-4.689a.824.824 0 0 1-.24-.574c0-.445.356-.786.8-.786.22 0 .404.075.554.225l5.332 5.216a.83.83 0 0 1 .267.609Z" />
                 </svg>
               </Link>
             </div>
             <div className="order-1 mt-4 flex w-full justify-center lg:order-2 lg:mt-0 lg:mr-24 lg:justify-end">
               <img src="https://coursiv.io/_next/static/media/phone.6b1bd676.png" alt="Sample Coursiv learning path in-app screenshot" className="h-auto w-full max-w-[313px]" />
             </div>
           </div>
         </div>
       </section>

      </>)}

      {/* Footer */}
      <footer className="border-t border-brand-border">
        <div className="mx-auto max-w-7xl px-6 py-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <div className="text-xl font-extrabold">AI Masters</div>
            <p className="mt-2 text-sm text-neutral-700">Learn today, take control of your future, and grow your income with new digital skills and AI.</p>
          </div>
          <div>
            <div className="font-semibold">Company</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="#features" className="hover:text-[var(--brand-primary)]">Features</a></li>
              <li><a href="#faq" className="hover:text-[var(--brand-primary)]">Help & Support</a></li>
              <li><a href="#start" className="hover:text-[var(--brand-primary)]">Start Learning</a></li>
            </ul>
          </div>
          {/* App download column removed */}
        </div>
        <div className="mx-auto max-w-7xl px-6 pb-10 text-xs text-neutral-500">© {new Date().getFullYear()} AI Masters. All rights reserved.</div>
      </footer>
    </div>
  );
}

function Card({ title, description }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-black" />
        <div className="font-semibold">{title}</div>
      </div>
      <p className="mt-2 text-sm text-neutral-700">{description}</p>
    </div>
  );
}

function Stat({ value, exact, label }) {
  return (
    <div>
      <div className="text-4xl md:text-5xl font-normal tracking-tight text-black">{value}</div>
      {exact && (
        <div className="mt-1 text-sm text-neutral-500">{exact}</div>
      )}
      <div className="mt-2 text-base font-semibold text-neutral-800">{label}</div>
    </div>
  );
}
