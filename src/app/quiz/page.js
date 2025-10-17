"use client";
import React, { useEffect, useMemo, useState } from "react";
import { app, analytics, auth } from "@/lib/firebase";
import Link from "next/link";
import { getAllCourses } from "@/lib/courses";
import { onAuthStateChanged, signOut } from "firebase/auth";

// AI Learning Assessment: 20 questions across categories
const QUESTIONS = [
  { id: 1, category: "Core Concepts", text: "What is the Turing Test?", options: ["Evaluates whether a machine's behavior is indistinguishable from a human during conversation", "Measures the model's training accuracy", "Checks if an algorithm is deterministic", "Benchmarks GPU performance"], correctIndex: 0 },
  { id: 2, category: "Core Concepts", text: "Explain the difference between parametric and non-parametric models in machine learning.", options: ["Parametric: fixed number of parameters; Non-parametric: capacity grows with data", "Parametric models require no data", "Non-parametric models are always linear", "They are identical"], correctIndex: 0 },
  { id: 3, category: "Core Concepts", text: "What is the difference between model parameters and hyperparameters?", options: ["Parameters are learned from data; hyperparameters are set before training and control the learning process", "Hyperparameters are weights learned inside the model", "Parameters are set manually by the user", "Both are learned automatically during training"], correctIndex: 0 },
  { id: 4, category: "Core Concepts", text: "How is data overfitting defined, and what are some ways to prevent it?", options: ["Model fits noise/memorizes training data; prevent with regularization, dropout, early stopping, and more data", "Model performs poorly on both train and test; fix by increasing learning rate", "Model underfits; fix with fewer features", "Model generalizes perfectly; no prevention needed"], correctIndex: 0 },
  { id: 5, category: "Core Concepts", text: "How can knowledge in AI be represented?", options: ["Logical rules, semantic networks, frames, ontologies, and probabilistic models", "Only raw text with no structure", "Only images and audio files", "GPU memory layouts"], correctIndex: 0 },

  { id: 6, category: "ML/NN", text: "Name some common types of artificial neural networks.", options: ["Feedforward (MLP), Convolutional (CNN), Recurrent (RNN)", "Decision Trees, KNN, Naive Bayes", "SVM, PCA, K-Means", "Minimax, A*"], correctIndex: 0 },
  { id: 7, category: "ML/NN", text: "What is a Bayesian network, and what does it represent?", options: ["A directed acyclic graph representing probabilistic dependencies among variables", "A neural network with only Bayesian layers", "An undirected graph trained with backprop", "A database schema for relational data"], correctIndex: 0 },
  { id: 8, category: "ML/NN", text: "How does an AI agent interact with its environment?", options: ["Perceives via sensors, acts via actuators, and uses policy/learning to maximize reward", "Ignores input and runs a fixed script", "Only trains on static datasets", "Compiles code faster to interact"], correctIndex: 0 },
  { id: 9, category: "ML/NN", text: "What are some common algorithms used for hyperparameter optimization?", options: ["Grid search, random search, Bayesian optimization", "Gradient descent and backprop only", "K-Means and PCA", "Minimax and alpha-beta"], correctIndex: 0 },
  { id: 10, category: "ML/NN", text: "What algorithm is used for decision-making in game trees?", options: ["Minimax with alpha-beta pruning", "Gradient descent", "KNN", "Apriori"], correctIndex: 0 },

  { id: 11, category: "Applications", text: "Name some core branches of artificial intelligence.", options: ["Machine Learning, Natural Language Processing, Computer Vision, Robotics", "Web development, DevOps, UX design", "Chemistry, Biology, Geology", "Blockchain, AR/VR, IoT only"], correctIndex: 0 },
  { id: 12, category: "Applications", text: "What is the difference between a decision tree and a neural network?", options: ["Decision trees split features using rules and are interpretable; neural networks learn weights across layers and are often less interpretable", "Neural networks are always linear while trees are nonlinear", "Decision trees require GPUs; neural networks do not", "They are identical in structure"], correctIndex: 0 },
  { id: 13, category: "Applications", text: "How can a machine be considered intelligent if it can change its course of action based on external input?", options: ["It operates in a feedback loop: perceiving state and updating actions/policy based on input and outcomes", "It runs with maximum CPU usage", "It ignores sensor data", "It hardcodes outputs regardless of input"], correctIndex: 0 },
  { id: 14, category: "Applications", text: "What is the function of an inference engine in an expert system?", options: ["Applies rules to the knowledge base to derive conclusions and explanations", "Stores data only", "Displays UI elements", "Compiles source code"], correctIndex: 0 },
  { id: 15, category: "Applications", text: "How is Robotic Process Automation (RPA) used in real-world applications?", options: ["Automating repetitive, rule-based business tasks (e.g., data entry, invoice processing)", "Training deep neural networks", "Designing new hardware chips", "Real-time 3D graphics rendering"], correctIndex: 0 },

  { id: 16, category: "Ethics/Practical", text: "How are AI tools used in your daily life?", options: ["Recommendations, voice assistants, spam filters, navigation and route planning", "Only bioinformatics tools", "GPU overclocking utilities", "Text editors"], correctIndex: 0 },
  { id: 17, category: "Ethics/Practical", text: "What are some ethical implications of using AI in decision-making processes?", options: ["Bias and fairness, transparency/explainability, privacy, accountability", "Only computational complexity concerns", "GPU temperature control", "Software licensing versions"], correctIndex: 0 },
  { id: 18, category: "Ethics/Practical", text: "How can we ensure AI promotes human creativity and critical thinking rather than replacing it?", options: ["Use AI as augmentation (co-pilot), keep human-in-the-loop, encourage critique and project-based learning", "Replace all human tasks with AI", "Avoid reviewing outputs", "Eliminate domain expertise"], correctIndex: 0 },
  { id: 19, category: "Ethics/Practical", text: "How do you handle AI results that seem incorrect or biased?", options: ["Validate with ground truth, review data/prompt/process, adjust or retrain, add guardrails, and maintain human oversight", "Ignore and ship", "Increase temperature always", "Delete the test set"], correctIndex: 0 },
  { id: 20, category: "Ethics/Practical", text: "What are some challenges in creating AI that understands ambiguous or vague language?", options: ["Ambiguity, context dependence, pragmatics and world knowledge; sarcasm/idioms are hard", "Only sentence length matters", "GPU speed determines understanding", "Sorting algorithms solve ambiguity"], correctIndex: 0 },
];

const buildQuestions = () => QUESTIONS;

export default function QuizPage() {
  const questions = useMemo(buildQuestions, []);
  const total = questions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(total).fill(null));
  const [submitted, setSubmitted] = useState(false);
  // Account + saving state
  const [userEmail, setUserEmail] = useState(null);
  const [signupEmail, setSignupEmail] = useState("");
  const [saveStatus, setSaveStatus] = useState(null); // 'saved' | 'error' | null
  const [showSignup, setShowSignup] = useState(false);
  const [user, setUser] = useState(null);
// Determine first course to start based on course ordering
const allCourses = useMemo(() => getAllCourses(), []);
const firstCourseSlug = allCourses[0]?.slug;

  // Persist answers in localStorage so progress isn't lost on refresh
  useEffect(() => {
    try {
      const saved = localStorage.getItem("coursiv_quiz_answers");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === total) {
          setAnswers(parsed);
        }
      }
      const email = localStorage.getItem("quiz_user_email");
      if (email) setUserEmail(email);
    } catch (e) {
      // ignore
    }
  }, [total]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      setUser(fbUser || null);
    });
    return () => unsub();
  }, []);

  const handleSubmit = async () => {
    setSubmitted(true);
    try {
      localStorage.setItem("aimasters_quiz_completed", "true");
      if (firstCourseSlug) {
        localStorage.setItem("aimasters_first_course_slug", firstCourseSlug);
      }
    } catch {}

    // Post-quiz: if signed-in non-owner without payment/freeAccess, go to checkout
    try {
      const fbUser = auth.currentUser;
      if (fbUser) {
        const OWNER_EMAIL = process.env.NEXT_PUBLIC_OWNER_EMAIL?.toLowerCase();
        const OWNER_UID = process.env.NEXT_PUBLIC_OWNER_UID;
        const isOwner = (fbUser.email?.toLowerCase() === OWNER_EMAIL) || (fbUser.uid === OWNER_UID);
        const uref = doc(db, "users", fbUser.uid);
        const snap = await getDoc(uref);
        const data = snap.exists() ? snap.data() : {};
        const hasPaid = !!data.hasPaid;
        const freeAccess = !!data.freeAccess;
        const accessGranted = hasPaid || freeAccess || isOwner;
        if (!accessGranted) {
          router.replace("/checkout");
          return; // avoid showing recommendations on this page
        }
      }
    } catch {}

    if (!userEmail) {
      setShowSignup(true);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setAnswers(Array(total).fill(null));
    setCurrentIndex(0);
    try {
      localStorage.removeItem("coursiv_quiz_answers");
      localStorage.removeItem("aimasters_quiz_completed");
      localStorage.removeItem("aimasters_first_course_slug");
    } catch (e) {
      // ignore
    }
  };

  const score = useMemo(() => {
    if (!submitted) return null;
    let correct = 0;
    const perCategory = new Map();
    answers.forEach((ans, idx) => {
      const q = questions[idx];
      const cat = q.category;
      const entry = perCategory.get(cat) || { correct: 0, total: 0 };
      entry.total += 1;
      if (ans !== null && ans === q.correctIndex) {
        entry.correct += 1;
        correct += 1;
      }
      perCategory.set(cat, entry);
    });
    const percent = Math.round((correct / total) * 100);
    // Determine level recommendation
    let level = "Beginner";
    let recommendation = "Start with AI Foundations: Python basics, data handling with Pandas/NumPy, and core ML concepts (supervised vs unsupervised, overfitting, scaling).";
    const courses = [];
    if (percent >= 40 && percent < 70) {
      level = "Intermediate";
      recommendation = "Proceed to Applied ML: model training, evaluation (F1/RMSE), validation strategies, regularization, and pipelines.";
      courses.push(
        { title: "Applied ML & Model Evaluation", description: "Cross-validation, metrics (Accuracy/F1/RMSE), regularization, and model selection." },
        { title: "Neural Networks with PyTorch (Basics)", description: "Build MLPs, understand backpropagation, activations, and training loops." }
      );
    } else if (percent >= 70) {
      level = "Advanced";
      recommendation = "Focus on LLM Essentials and Production: embeddings, vector databases, prompt engineering, fine-tuning, and deployment considerations.";
      courses.push(
        { title: "Deep Learning: CNNs & RNNs", description: "Architectures, training tricks, and hands-on projects in vision and sequence modeling." },
        { title: "LLMs & Prompt Engineering", description: "Embeddings, vector databases, prompting strategies, and fine-tuning workflows." },
        { title: "MLOps & Deployment", description: "Experiment tracking, model serving, monitoring, and CI/CD for ML systems." }
      );
    } else {
      // Beginner
      courses.push(
        { title: "AI Foundations: Python + Math Basics", description: "Python, NumPy, Pandas, linear algebra/calculus essentials, and ML terminology." },
        { title: "Intro to Machine Learning (scikit-learn)", description: "Train/test splits, supervised vs. unsupervised, overfitting and regularization." }
      );
    }

    // Category-aware targeted recommendations (add up to two based on weakest areas)
    const perCategoryList = Array.from(perCategory.entries()).map(([cat, v]) => ({ category: cat, ...v }));
    const withPct = perCategoryList
      .map(c => ({ ...c, pct: c.total ? Math.round((c.correct / c.total) * 100) : 0 }))
      .sort((a, b) => a.pct - b.pct);

    const added = new Set(courses.map(c => c.title));
    const addCourse = (c) => { if (!added.has(c.title)) { courses.push(c); added.add(c.title); } };

    for (const c of withPct) {
      if (c.pct >= 60) continue; // focus on weaker categories
      switch (c.category) {
        case "Core Concepts":
          addCourse({ title: "Core AI Concepts Bootcamp", description: "Hyperparameters vs parameters, parametric vs non-parametric, bias/variance, knowledge representation." });
          break;
        case "ML/NN":
          addCourse({ title: "Neural Networks from Scratch", description: "Forward/backprop, activations, loss functions, regularization and early stopping." });
          break;
        case "Applications":
          addCourse({ title: "Applied AI Projects", description: "End-to-end pipelines, feature engineering, case studies in NLP/CV/Robotics." });
          break;
        case "Ethics/Practical":
          addCourse({ title: "Responsible AI", description: "Bias/fairness, privacy, transparency, human-in-the-loop, and governance." });
          break;
        default:
          break;
      }
      if (courses.length >= 5) break; // limit total recommendations
    }

    return { correct, total, percent, perCategory: withPct.map(({ category, correct, total, pct }) => ({ category, correct, total, pct })), level, recommendation, courses };
  }, [submitted, answers, questions, total]);

  // Utility: validate email format
  const isValidEmail = (email) => /.+@.+\..+/.test(email);

  // Save results to localStorage keyed by email
  const saveResults = (email, scoreObj) => {
    if (!email || !scoreObj) return;
    try {
      const key = `quiz_results_by_email:${email}`;
      const prev = localStorage.getItem(key);
      const list = prev ? JSON.parse(prev) : [];
      list.push({ timestamp: new Date().toISOString(), score: scoreObj, answers });
      localStorage.setItem(key, JSON.stringify(list));
      setSaveStatus("saved");
    } catch (e) {
      setSaveStatus("error");
    }
  };

  // When user is already signed in, auto-save on submit
  useEffect(() => {
    if (submitted && userEmail && score) {
      saveResults(userEmail, score);
    }
  }, [submitted, userEmail, score]);

  const handleSignupAndSave = () => {
    if (!isValidEmail(signupEmail)) {
      setSaveStatus("error");
      return;
    }
    try {
      localStorage.setItem("quiz_user_email", signupEmail);
      setUserEmail(signupEmail);
      saveResults(signupEmail, score);
      setShowSignup(false);
    } catch (e) {
      setSaveStatus("error");
    }
  };


  return (
    <div className="min-h-screen bg-white text-black">
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
                <span className="inline-flex items-center rounded-full border border-neutral-300 bg-white text-neutral-900 px-4 py-2 text-sm">Welcome Back{(() => { try { const email = user?.email || user?.uid; const name = email ? localStorage.getItem(`aimasters_profile_name:${email}`) : null; return name ? ", " + name : (user?.displayName ? ", " + user.displayName : ""); } catch { return ""; } })()}</span>
                <button onClick={() => signOut(auth)} className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-900 px-4 py-2 text-sm font-semibold hover:bg-neutral-50">Logout</button>
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

      <main className="mx-auto max-w-7xl px-6 py-10 bg-white text-black">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-black">AI Master Quiz</h1>
          <div className="text-sm">
            {user ? (
              <span className="text-black">Welcome Back{(() => { try { const email = user?.email || user?.uid; const name = email ? localStorage.getItem(`aimasters_profile_name:${email}`) : null; return name ? ", " + name : (user?.displayName ? ", " + user.displayName : ""); } catch { return ""; } })()}</span>
            ) : (
              <button onClick={() => setShowSignup(true)} className="text-[var(--brand-primary)] hover:underline">Sign up to save</button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-black">Progress: {progressPercent}%</p>
            <p className="text-sm text-black">Question {currentIndex + 1} / {total}</p>
          </div>
          <div className="h-2 w-full rounded bg-neutral-200">
            <div
              className="h-2 rounded bg-[var(--brand-primary)] transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Quiz card */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 md:p-8 shadow">
          {submitted ? (
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-semibold text-black">Results</h2>
              {score && (
                <>
                  <p className="mt-3 text-black">
                    You answered <span className="font-semibold">{score.correct}</span> out of {score.total} correctly ({score.percent}%).
                  </p>
                  <p className="mt-2 text-black"><span className="font-semibold">Level:</span> {score.level}</p>
                  <p className="mt-2 text-black max-w-2xl mx-auto">{score.recommendation}</p>

                  {/* Save results prompt */}
                  {userEmail ? (
                    <div className="mt-4 rounded-lg border border-neutral-200 p-4 bg-white text-left">
                      <p className="text-sm text-black">
                        Results have been saved to your account: <span className="font-semibold">{userEmail}</span>
                      </p>
                      {saveStatus === "saved" && (
                        <p className="mt-1 text-xs text-black">Saved at {new Date().toLocaleString()}.</p>
                      )}
                    </div>
                  ) : (
                    showSignup && (
                      <div className="mt-4 rounded-lg border border-neutral-200 p-4 bg-white text-left">
                        <p className="text-sm font-semibold text-black">Create an account to save your results</p>
                        <div className="mt-3 flex flex-col sm:flex-row gap-3">
                          <input
                            type="email"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-black bg-white"
                          />
                          <button
                            onClick={handleSignupAndSave}
                            className="rounded-lg bg-[var(--brand-primary)] px-4 py-2 text-sm font-semibold text-black"
                          >
                            Create account & save
                          </button>
                        </div>
                        {saveStatus === "error" && (
                          <p className="mt-2 text-xs text-black">Please enter a valid email to sign up and save.</p>
                        )}
                      </div>
                    )
                  )}

                  {/* Category breakdown */}
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-left">
                    {score.perCategory.map(({ category, correct, total, pct }, i) => (
                      <div key={i} className="rounded-xl border border-neutral-200 p-4 bg-white">
                        <p className="text-sm font-semibold text-black">{category}</p>
                        <p className="mt-1 text-sm text-black">{correct} / {total} correct</p>
                        <div className="mt-2 h-2 w-full rounded bg-neutral-200">
                          <div
                            className="h-2 rounded bg-[var(--brand-primary)]"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {score.courses && score.courses.length > 0 && (
                    <div className="mt-6 text-left">
                      <h3 className="text-xl font-semibold text-black">Recommended courses to start</h3>
                      <ul className="mt-3 space-y-3">
                        {score.courses.map((c, i) => (
                          <li key={i} className="rounded-lg border border-neutral-200 bg-white p-4">
                            <p className="font-semibold text-black">{c.title}</p>
                            <p className="text-sm text-black">{c.description}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* CTA to start learning */}
                  <div className="mt-8 flex items-center justify-center gap-3">
                    <Link
                      href="/courses"
                      className="inline-flex items-center justify-center rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold hover:bg-neutral-50 text-black"
                    >
                      Go to courses
                    </Link>
                    {firstCourseSlug && (
                      <Link
                        href={`/courses/${firstCourseSlug}`}
                        className="inline-flex items-center justify-center rounded-lg bg-[var(--brand-primary)] px-4 py-2 text-sm font-semibold text-black hover:brightness-110"
                      >
                        Start first course
                      </Link>
                    )}
                    <button
                      onClick={handleReset}
                      className="inline-flex items-center justify-center rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold hover:bg-neutral-50 text-black"
                    >
                      Retake quiz
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-black">{questions[currentIndex].text}</h2>
              <div className="mt-4 grid grid-cols-1 gap-3">
                {questions[currentIndex].options.map((opt, idx) => {
                  const selected = answers[currentIndex] === idx;
                  return (
                    <label
                      key={idx}
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition ${selected ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/5" : "border-neutral-200 hover:border-neutral-300"}`}
                    >
                      <input
                        type="radio"
                        name={`q-${currentIndex}`}
                        checked={selected}
                        onChange={() => handleSelect(idx)}
                        className="h-4 w-4 accent-[var(--brand-primary)]"
                      />
                      <span className="text-sm md:text-base text-black">{opt}</span>
                    </label>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={prevQuestion}
                  disabled={currentIndex === 0}
                  className="inline-flex items-center justify-center rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold disabled:opacity-50 hover:bg-neutral-50 text-black"
                >
                  Previous
                </button>
                <div className="flex items-center gap-3">
                  {currentIndex < total - 1 ? (
                    <button
                      onClick={nextQuestion}
                      className="inline-flex items-center justify-center rounded-lg bg-[var(--brand-primary)] px-4 py-2 text-sm font-semibold text-black hover:brightness-110"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={answers.some(a => a === null)}
                      className="inline-flex items-center justify-center rounded-lg bg-[var(--brand-primary)] px-4 py-2 text-sm font-semibold text-black disabled:opacity-60 hover:brightness-110"
                    >
                      Submit
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>


    </main>
    </div>
  );
}