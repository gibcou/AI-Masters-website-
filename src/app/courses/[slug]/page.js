"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { getCourseBySlug, getAllCourses } from "@/lib/courses";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export default function CoursePlayer() {
  const { slug } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const course = useMemo(() => getCourseBySlug(slug), [slug]);
  const [current, setCurrent] = useState(0);
  const [notes, setNotes] = useState("");
  const [answers, setAnswers] = useState({});
  const [savedAt, setSavedAt] = useState(null);
  const [lockedCourse, setLockedCourse] = useState(false);
  const [courseCompleted, setCourseCompleted] = useState(false);

  // NEW: test answers/submission state
  const [testAnswers, setTestAnswers] = useState({ midterm: {}, final: {} });
  const [testSubmitted, setTestSubmitted] = useState({ midterm: false, final: false });
  const [testScores, setTestScores] = useState({ midterm: null, final: null });

  const [labStatus, setLabStatus] = useState({}); // lab completion per lab.id
  const [labWorkspace, setLabWorkspace] = useState({}); // per-lab input, feedback, analysis
  const [labOpen, setLabOpen] = useState({}); // UI expand/collapse per lab

  // Interactive learning: Prompt Builder, Outcome capture, Self-assessment, Timer
  const [builder, setBuilder] = useState({ role: "", task: "", context: "", constraints: "", examples: "", tone: "", style: "" });
  const [outcome, setOutcome] = useState("");
  const [checklist, setChecklist] = useState({ clarity: false, audience: false, constraints: false, examples: false, outcome: false });
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerStart, setTimerStart] = useState(null);
  const [timerElapsed, setTimerElapsed] = useState(0);
const [profileName, setProfileName] = useState("");
  const allCourses = useMemo(() => getAllCourses(), []);
  const courseIndex = useMemo(() => allCourses.findIndex((c) => c.slug === slug), [allCourses, slug]);
  const prevCourseSlug = useMemo(() => (courseIndex > 0 ? allCourses[courseIndex - 1]?.slug : null), [allCourses, courseIndex]);
  const nextCourseSlug = useMemo(() => (courseIndex >= 0 && courseIndex < allCourses.length - 1 ? allCourses[courseIndex + 1]?.slug : null), [allCourses, courseIndex]);

  useEffect(() => {
    // Login-required guard via Firebase
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setUser(null);
        router.replace("/login");
      } else {
        setUser(fbUser);
        try {
          const email = fbUser?.email || fbUser?.uid;
          if (email) {
            const saved = localStorage.getItem(`aimasters_profile_name:${email}`);
            if (saved) setProfileName(saved);
          }
        } catch {}
        // Payment gating: redirect unpaid users to checkout (with owner/freeAccess bypass)
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
      }
      setAuthChecked(true);
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

  // Build flow steps (lessons + midterm + final)
  const flowSteps = useMemo(() => {
    if (!course) return [];
    const lessonSteps = course.lessons.map((l) => ({ type: "lesson", data: l }));
    const midIndex = Math.max(1, Math.floor(lessonSteps.length / 2));
    const steps = [...lessonSteps];
    steps.splice(midIndex, 0, { type: "midterm" });
    steps.push({ type: "final" });
    return steps;
  }, [course]);

  useEffect(() => {
    if (!authChecked || !user || !course) return;
    const key = `aimasters_course_${slug}`;
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        setCurrent(parsed.current || 0);
        setNotes(parsed.notes || "");
        setAnswers(parsed.answers || {});
        setSavedAt(parsed.savedAt || null);
      }
    } catch {}
    // Load tests state
    try {
      const midRaw = localStorage.getItem(`aimasters_test_midterm:${slug}`);
      if (midRaw) {
        const parsed = JSON.parse(midRaw);
        setTestAnswers((prev) => ({ ...prev, midterm: parsed.answers || {} }));
        setTestSubmitted((prev) => ({ ...prev, midterm: !!parsed.submitted }));
        setTestScores((prev) => ({ ...prev, midterm: parsed.score ?? null }));
      }
      const finRaw = localStorage.getItem(`aimasters_test_final:${slug}`);
      if (finRaw) {
        const parsed = JSON.parse(finRaw);
        setTestAnswers((prev) => ({ ...prev, final: parsed.answers || {} }));
        setTestSubmitted((prev) => ({ ...prev, final: !!parsed.submitted }));
        setTestScores((prev) => ({ ...prev, final: parsed.score ?? null }));
      }
    } catch {}
    // Load labs status
    try {
      const labRaw = localStorage.getItem(`aimasters_labs:${slug}`);
      if (labRaw) {
        const parsed = JSON.parse(labRaw);
        setLabStatus(parsed || {});
      }
      const wsRaw = localStorage.getItem(`aimasters_lab_workspace:${slug}`);
      if (wsRaw) {
        const parsed = JSON.parse(wsRaw);
        setLabWorkspace(parsed || {});
      }
    } catch {}
  }, [authChecked, user, course, slug]);

  useEffect(() => {
    if (!course) return;
    // compute locked and completion flags
    try {
      let locked = false;
      if (courseIndex === 0) {
        locked = localStorage.getItem("aimasters_quiz_completed") !== "true";
      } else {
        const prevCompleted = localStorage.getItem(`aimasters_course_completed:${prevCourseSlug}`) === "true";
        locked = !prevCompleted;
      }
      setLockedCourse(locked);
      const completed = localStorage.getItem(`aimasters_course_completed:${slug}`) === "true";
      setCourseCompleted(completed);
    } catch {}
  }, [course, slug, courseIndex, prevCourseSlug]);

  useEffect(() => {
    if (!course) return;
    const key = `aimasters_course_${slug}`;
    try {
      const payload = { current, notes, answers, savedAt: Date.now() };
      localStorage.setItem(key, JSON.stringify(payload));
      setSavedAt(payload.savedAt);
    } catch {}
  }, [authChecked, user, course, slug, current, notes, answers]);

  // Persist tests state
  useEffect(() => {
    try {
      const midPayload = { answers: testAnswers.midterm, submitted: testSubmitted.midterm, score: testScores.midterm };
      localStorage.setItem(`aimasters_test_midterm:${slug}`, JSON.stringify(midPayload));
      const finPayload = { answers: testAnswers.final, submitted: testSubmitted.final, score: testScores.final };
      localStorage.setItem(`aimasters_test_final:${slug}`, JSON.stringify(finPayload));
    } catch {}
  }, [slug, testAnswers, testSubmitted, testScores]);

  // Persist labs status
  useEffect(() => {
    try {
      localStorage.setItem(`aimasters_labs:${slug}`, JSON.stringify(labStatus));
      localStorage.setItem(`aimasters_lab_workspace:${slug}`, JSON.stringify(labWorkspace));
    } catch {}
  }, [slug, labStatus, labWorkspace]);

  // Auto-mark course completion when final test is submitted
  useEffect(() => {
    try {
      if (testSubmitted.final) {
        localStorage.setItem(`aimasters_course_completed:${slug}`, "true");
        setCourseCompleted(true);
        // Create/Upsert certificate in Firestore
        (async () => {
          try {
            if (user) {
              const email = user?.email || user?.uid;
              let displayName = "";
              try {
                displayName = email ? (localStorage.getItem(`aimasters_profile_name:${email}`) || user?.displayName || "") : (user?.displayName || "");
              } catch {}
              await setDoc(
                doc(db, "users", user.uid, "certificates", slug),
                {
                  slug,
                  courseTitle: course?.title || slug,
                  ownerName: displayName,
                  issuedAt: serverTimestamp(),
                },
                { merge: true }
              );
            }
          } catch {}
        })();
      }
    } catch {}
  }, [slug, testSubmitted.final]);

  if (!course) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20">
        <h1 className="text-2xl font-bold">Course not found</h1>
        <p className="mt-2">The course you're looking for doesn't exist.</p>
        <Link href="/courses" className="mt-4 inline-block text-[var(--brand-primary)]">Back to courses</Link>
      </div>
    );
  }

  if (lockedCourse) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20">
        <h1 className="text-2xl font-bold">Course locked</h1>
        <p className="mt-2 text-neutral-700">
          {courseIndex === 0 ? "Complete the quiz to unlock this first course." : "Complete the previous course to unlock this one."}
        </p>
        <div className="mt-4 flex items-center gap-3">
          {courseIndex > 0 && prevCourseSlug ? (
            <Link href={`/courses/${prevCourseSlug}`} className="inline-flex items-center rounded-full bg-[var(--brand-primary)] text-white px-4 py-2 text-sm hover:bg-[var(--brand-primary-dark)]">Go to previous course</Link>
          ) : (
            <Link href="/quiz" className="inline-flex items-center rounded-full bg-[var(--brand-primary)] text-white px-4 py-2 text-sm hover:bg-[var(--brand-primary-dark)]">Take the quiz</Link>
          )}
          <Link href="/courses" className="inline-flex items-center rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm hover:bg-neutral-50">Back to all courses</Link>
        </div>
      </div>
    );
  }

  const step = flowSteps[current];
  const isLesson = step?.type === "lesson";
  const isMidterm = step?.type === "midterm";
  const isFinal = step?.type === "final";

  const lesson = isLesson ? step.data : null;
  const currentKey = `${slug}_${current}`;
  const currentQuizCorrect = isLesson && lesson.quiz ? (answers[currentKey] !== undefined && answers[currentKey] === lesson.quiz.answerIndex) : true;

  // Helpers for tests
  const midtermQuestions = course.tests?.midtermQuestions || [];
  const finalQuestions = course.tests?.finalQuestions || [];
  const allAnswered = (type) => {
    const q = type === "midterm" ? midtermQuestions : finalQuestions;
    const a = testAnswers[type];
    return q.length > 0 && q.every((_, i) => a[i] !== undefined);
  };
  const computeScore = (type) => {
    const q = type === "midterm" ? midtermQuestions : finalQuestions;
    const a = testAnswers[type];
    let correct = 0;
    q.forEach((qq, i) => {
      if (a[i] !== undefined && a[i] === qq.answerIndex) correct += 1;
    });
    return { correct, total: q.length };
  };

  // Derived curriculum labs for right panel
  const labs = (course.curriculum || []).flatMap((m) => m.labs || []);

  return (
    <div className="min-h-screen bg-white text-neutral-900">

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

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-50 text-2xl">{course.icon}</div>
          <h1 className="text-2xl md:text-3xl font-bold">{course.title}</h1>
        </div>
        <p className="mt-2 text-neutral-700">{course.description}</p>

        {/* Progress bar */}
        <div className="mt-6 w-full h-2 rounded-full bg-neutral-200">
          <div
            className="h-2 rounded-full bg-[var(--brand-primary)] transition-all"
            style={{ width: `${((current + 1) / flowSteps.length) * 100}%` }}
          />
        </div>
        <div className="mt-2 text-xs text-neutral-600">
          Step {current + 1} of {flowSteps.length}
          {savedAt && <span className="ml-2">• Saved {new Date(savedAt).toLocaleTimeString()}</span>}
          {courseCompleted && <span className="ml-2 text-green-700">• Course completed</span>}
        </div>

        {/* Content */}
        <div className="mt-8 grid md:grid-cols-2 gap-8 items-start">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            {isLesson && (
              <>
                <h2 className="text-xl font-semibold text-neutral-900">{lesson.title}</h2>
                <p className="mt-3 text-neutral-700 whitespace-pre-line">{lesson.content}</p>
                <div className="mt-4 rounded-xl bg-indigo-50 border border-indigo-200 p-4">
                  <div className="font-semibold text-indigo-900">Your task</div>
                  <p className="mt-1 text-sm text-indigo-900/80">{lesson.task}</p>
                </div>
                {/* Practice prompts */}
                {lesson.promptExamples && lesson.promptExamples.length > 0 && (
                  <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-4">
                    <div className="font-semibold">Practice prompts</div>
                    <ul className="mt-2 space-y-2 text-sm text-neutral-700">
                      {lesson.promptExamples.map((p, idx) => (
                        <li key={idx} className="rounded-md border border-neutral-200 p-3">
                          <div className="flex items-center justify-between">
                            <span>{p}</span>
                            <button
                              className="ml-3 inline-flex items-center rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs hover:bg-neutral-50"
                              onClick={() => {
                                navigator.clipboard?.writeText(p).catch(() => {});
                              }}
                            >
                              Copy
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Mini quiz */}
                {lesson.quiz && (
                  <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-4">
                    <div className="font-semibold">Quick check</div>
                    <p className="text-sm text-neutral-700">{lesson.quiz.question}</p>
                    <div className="mt-3 space-y-2">
                      {lesson.quiz.options.map((opt, i) => {
                        const key = `${slug}_${current}`;
                        const selected = answers[key];
                        const isCorrect = selected !== undefined && selected === lesson.quiz.answerIndex;
                        return (
                          <button
                            key={i}
                            onClick={() => setAnswers((prev) => ({ ...prev, [key]: i }))}
                            className={`w-full text-left rounded-lg border px-3 py-2 text-sm transition ${
                              selected === i
                                ? isCorrect
                                  ? "border-green-400 bg-green-50"
                                  : "border-red-400 bg-red-50"
                                : "border-neutral-200 hover:bg-neutral-50"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {(() => {
                      const key = `${slug}_${current}`;
                      const selected = answers[key];
                      if (selected === undefined) return null;
                      const isCorrect = selected === lesson.quiz.answerIndex;
                      return (
                        <div className={`mt-3 rounded-md px-3 py-2 text-sm ${isCorrect ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                          {isCorrect ? "Correct!" : "Not quite — try again."}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </>
            )}

            {(isMidterm || isFinal) && (
              <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                <div className="font-semibold">{isMidterm ? "Midterm Test" : "Final Test"}</div>
                <p className="text-sm text-neutral-700 mt-1">Answer all questions to continue. Your score will be saved.</p>
                <div className="mt-3 space-y-3">
                  {(isMidterm ? midtermQuestions : finalQuestions).map((q, idx) => {
                    const type = isMidterm ? "midterm" : "final";
                    const selected = testAnswers[type][idx];
                    const submitted = testSubmitted[type];
                    const isCorrect = submitted && selected !== undefined && selected === q.answerIndex;
                    return (
                      <div key={idx} className="rounded-lg border border-neutral-200 p-3">
                        <div className="text-sm font-medium">{idx + 1}. {q.question}</div>
                        <div className="mt-2 grid gap-2">
                          {q.options.map((opt, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                const t = type;
                                setTestAnswers((prev) => ({ ...prev, [t]: { ...prev[t], [idx]: i } }));
                              }}
                              className={`text-left rounded-md border px-3 py-2 text-sm transition ${
                                selected === i
                                  ? submitted
                                    ? isCorrect
                                      ? "border-green-400 bg-green-50"
                                      : "border-red-400 bg-red-50"
                                    : "border-indigo-400 bg-indigo-50"
                                  : "border-neutral-200 hover:bg-neutral-50"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                        {submitted && (
                          <div className={`mt-2 text-xs ${isCorrect ? "text-green-700" : "text-red-700"}`}>{isCorrect ? "Correct" : "Incorrect"}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    className="inline-flex items-center rounded-full bg-[var(--brand-primary)] text-white px-4 py-2 text-sm hover:bg-[var(--brand-primary-dark)] disabled:opacity-60"
                    onClick={() => {
                      const type = isMidterm ? "midterm" : "final";
                      if (!allAnswered(type)) return;
                      const { correct, total } = computeScore(type);
                      setTestSubmitted((prev) => ({ ...prev, [type]: true }));
                      setTestScores((prev) => ({ ...prev, [type]: { correct, total } }));
                    }}
                    disabled={!allAnswered(isMidterm ? "midterm" : "final")}
                  >
                    Submit Test
                  </button>
                  {(() => {
                    const type = isMidterm ? "midterm" : "final";
                    const score = testScores[type];
                    if (!score) return null;
                    return (
                      <span className="text-sm text-neutral-700">Score: {score.correct}/{score.total}</span>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-6 flex items-center gap-3">
              <button
                className="inline-flex items-center rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm hover:bg-neutral-50"
                onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                disabled={current === 0}
              >
                Previous
              </button>
              <button
                className="inline-flex items-center rounded-full bg-[var(--brand-primary)] text-white px-4 py-2 text-sm hover:bg-[var(--brand-primary-dark)] disabled:opacity-60"
                onClick={() => setCurrent((c) => Math.min(flowSteps.length - 1, c + 1))}
                disabled={
                  current === flowSteps.length - 1 ||
                  (isLesson ? (lesson.quiz ? !currentQuizCorrect : false) : (!testSubmitted[isMidterm ? "midterm" : "final"]))
                }
              >
                Next
              </button>
              {current === flowSteps.length - 1 && nextCourseSlug && (
                <Link
                  href={`/courses/${nextCourseSlug}`}
                  aria-disabled={!courseCompleted}
                  className={`inline-flex items-center rounded-full bg-[var(--brand-primary)] text-white px-4 py-2 text-sm hover:bg-[var(--brand-primary-dark)] ${!courseCompleted ? "opacity-60 pointer-events-none" : ""}`}
                >
                  Next course
                </Link>
              )}
            </div>
            {isLesson && lesson.quiz && !currentQuizCorrect && (
              <p className="mt-2 text-xs text-neutral-600">Answer the mini-quiz correctly to unlock Next.</p>
            )}
          </div>

          {/* Notes and curriculum labs */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Notes</h3>
              <button
                className="inline-flex items-center rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs hover:bg-neutral-50"
                onClick={() => setNotes("")}
              >
                Clear
              </button>
            </div>
            <textarea
              className="mt-3 w-full h-40 rounded-xl border border-neutral-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="Write what you learned, ideas, and next actions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            {/* Curriculum labs */}
            {labs.length > 0 && (
              <div className="mt-6 rounded-xl bg-neutral-50 border border-neutral-200 p-4">
                <div className="font-semibold text-neutral-900">Curriculum Labs</div>
                <ul className="mt-2 space-y-2 text-sm text-neutral-700">
                  {labs.map((lab) => {
                    const checked = !!labStatus[lab.id];
                    const ws = labWorkspace[lab.id] || {};
                    const open = !!labOpen[lab.id];
                    return (
                      <li key={lab.id} className="rounded-md border border-neutral-200 p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-medium">{lab.title}</div>
                            <div className="text-neutral-700/80 mt-1">{lab.instructions}</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <label className="inline-flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={(e) => {
                                  const v = e.target.checked;
                                  setLabStatus((prev) => ({ ...prev, [lab.id]: v }));
                                }}
                              />
                              <span>{checked ? "Done" : "Mark done"}</span>
                            </label>
                            <button
                              className="inline-flex items-center rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs hover:bg-neutral-50"
                              onClick={() => setLabOpen((prev) => ({ ...prev, [lab.id]: !open }))}
                            >
                              {open ? "Hide" : "Open"}
                            </button>
                          </div>
                        </div>

                        {open && (
                          <div className="mt-3 space-y-3">
                            {/* Your work input */}
                            <div>
                              <div className="text-xs font-medium text-neutral-600">Your work</div>
                              <textarea
                                className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                                rows={5}
                                placeholder="Paste or write your work for this lab here..."
                                value={ws.input || ""}
                                onChange={(e) =>
                                  setLabWorkspace((prev) => ({
                                    ...prev,
                                    [lab.id]: { ...prev[lab.id], input: e.target.value },
                                  }))
                                }
                              />
                            </div>

                            {/* Feedback prompt */}
                            <div>
                              <button
                                className="inline-flex items-center rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs hover:bg-neutral-50"
                                onClick={() => {
                                  const prompt = `You are a professional reviewer. Evaluate the following work for the lab: ${lab.title}.\nLab instructions: ${lab.instructions}.\nWork:\n${ws.input || "(empty)"}\nProvide: 1) strengths, 2) weaknesses, 3) concrete improvements, 4) a revised example or outline. Use bullet points.`;
                                  navigator.clipboard?.writeText(prompt).catch(() => {});
                                }}
                              >
                                Copy feedback prompt
                              </button>
                            </div>

                            {/* Local insights */}
                            <div className="rounded-md border border-neutral-200 p-3 bg-white">
                              <div className="text-xs font-medium text-neutral-600">Insights</div>
                              <div className="mt-2 flex items-center gap-3">
                                <button
                                  className="inline-flex items-center rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs hover:bg-neutral-50"
                                  onClick={() => {
                                    const analysis = computeLabInsights(ws.input || "", lab);
                                    setLabWorkspace((prev) => ({
                                      ...prev,
                                      [lab.id]: { ...prev[lab.id], analysis },
                                    }));
                                  }}
                                >
                                  Analyze locally
                                </button>
                                {ws.analysis?.summary && (
                                  <span className="text-xs text-neutral-700">{ws.analysis.summary}</span>
                                )}
                              </div>
                              {ws.analysis?.suggestions?.length ? (
                                <ul className="mt-2 list-disc pl-5 text-xs text-neutral-700">
                                  {ws.analysis.suggestions.map((s, i) => (
                                    <li key={i}>{s}</li>
                                  ))}
                                </ul>
                              ) : null}
                            </div>

                            {/* Paste AI feedback */}
                            <div>
                              <div className="text-xs font-medium text-neutral-600">Paste AI feedback</div>
                              <textarea
                                className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                                rows={4}
                                placeholder="Paste feedback from your AI reviewer here..."
                                value={ws.feedback || ""}
                                onChange={(e) =>
                                  setLabWorkspace((prev) => ({
                                    ...prev,
                                    [lab.id]: { ...prev[lab.id], feedback: e.target.value },
                                  }))
                                }
                              />
                            </div>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <div className="mt-6">
              <Link href="/courses" className="inline-flex items-center rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm hover:bg-neutral-50">Back to all courses</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


// Simple local analysis for lab input to provide immediate insights
const computeLabInsights = (text, lab) => {
  const t = (text || "").toLowerCase();
  const words = t.trim().split(/\s+/).filter(Boolean);
  const lines = t.split(/\n+/);
  const bulletCount = lines.filter((l) => /^\s*(?:-|\*|\d+\.|\d+\))/.test(l)).length;
  const hasPros = /\bpros\b/.test(t);
  const hasCons = /\bcons\b/.test(t);
  const hasCTA = /(call to action|cta|subscribe|buy|sign up|learn more)/.test(t);
  const metrics = {
    wordCount: words.length,
    bulletCount,
    hasProsCons: hasPros && hasCons,
    hasCTA,
  };
  const suggestions = [];
  if (metrics.wordCount < 150) suggestions.push("Add more detail and examples (aim for 150+ words).");
  if (metrics.bulletCount < 3) suggestions.push("Use structured bullets or numbered steps (min 3). ");
  const title = (lab.title || "").toLowerCase();
  const ins = (lab.instructions || "").toLowerCase();
  const wantsProsCons = title.includes("pros") || title.includes("cons") || ins.includes("pros") || ins.includes("cons");
  if (wantsProsCons && !metrics.hasProsCons) suggestions.push("Include balanced pros and cons.");
  const wantsCTA = title.includes("cta") || ins.includes("cta") || ins.includes("call to action");
  if (wantsCTA && !metrics.hasCTA) suggestions.push("Add a clear call to action (CTA).");
  const summary = `Words: ${metrics.wordCount}, Bullets: ${metrics.bulletCount}, Pros+Cons: ${metrics.hasProsCons ? "yes" : "no"}, CTA: ${metrics.hasCTA ? "yes" : "no"}`;
  return { metrics, suggestions, summary };
};