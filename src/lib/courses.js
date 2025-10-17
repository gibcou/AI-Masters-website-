// Centralized course metadata for AI Masters
// Each course has a slug, title, description, icon, and a small set of lessons
// Lessons include a task and an optional mini-quiz

export const courses = [
  {
    slug: "ai-content-creation",
    title: "AI Content Creation",
    icon: "✍️",
    description:
      "Produce high-quality content for blogs, websites, and social media with AI.",
    lessons: [
      {
        title: "Brainstorm Topics",
        content:
          "Use AI to ideate content topics tailored to your audience. Define your niche and goals, then ask AI for 10 headline ideas.",
        task:
          "Write 3 headlines for your next blog post using an AI prompt. Refine them for clarity and benefit-driven messaging.",
        quiz: {
          question: "Which prompt is best for audience-specific ideation?",
          options: [
            "Give me ideas",
            "Generate 10 blog titles for beginners interested in AI productivity",
            "Write something viral",
          ],
          answerIndex: 1,
        },
        // Practice prompts to learn by doing
        promptExamples: [
          "Act as an editorial strategist. Suggest 10 blog titles for [audience] about [topic], each with a distinct angle (how-to, case study, myth-busting).",
          "Given these audience pain points: [list], generate 5 content ideas with clear benefits and target outcomes.",
        ],
      },
      {
        title: "Draft and Polish",
        content:
          "Draft content using AI, then iterate. Focus on structure (intro, sections, summary) and tone. Always add personal insights.",
        task:
          "Draft a 300-word post using AI. Edit for voice consistency and add 2 real examples from your experience.",
        quiz: {
          question: "What's the fastest way to improve AI drafts?",
          options: [
            "Publish immediately",
            "Iterate with structured prompts and add personal context",
            "Skip editing",
          ],
          answerIndex: 1,
        },
        promptExamples: [
          "Rewrite the following draft in my voice: [paste text]. Keep the structure: intro, 3 sections with subheadings, conclusion.",
          "Add two examples from [industry/experience] that illustrate the core idea. Maintain a credible, practical tone.",
        ],
      },
    ],
    tests: {
      midtermQuestions: Array.from({ length: 20 }).map((_, i) => ({
        question: `Midterm Q${i + 1}: Choose the best practice for AI content creation`,
        options: [
          "No structure",
          "Audience-specific prompts",
          "Ignore examples",
          "Random tone",
        ],
        answerIndex: 1,
      })),
      finalQuestions: Array.from({ length: 20 }).map((_, i) => ({
        question: `Final Q${i + 1}: Select the optimal step for refining AI writing`,
        options: [
          "Skip editing",
          "Iterate with feedback",
          "Avoid context",
          "No outline",
        ],
        answerIndex: 1,
      })),
    },
    // NEW: Deeper curriculum with outcomes and hands-on labs
    curriculum: [
      {
        title: "Prompting Fundamentals",
        outcome: "Master audience-aware prompts and structured outputs (outlines, lists, drafts).",
        labs: [
          { id: "ai-content-creation:m1l1", title: "Audience persona prompt", instructions: "Create a persona for your audience and generate 10 topic ideas with angles." },
          { id: "ai-content-creation:m1l2", title: "Outline-to-draft workflow", instructions: "Generate an outline and convert it to a draft in your voice." },
        ],
      },
      {
        title: "Editing and Personalization",
        outcome: "Polish AI drafts with your voice and add credible examples.",
        labs: [
          { id: "ai-content-creation:m2l1", title: "Voice polish pass", instructions: "Rewrite a draft with tone, vocabulary, and structure that fit your style." },
          { id: "ai-content-creation:m2l2", title: "Examples integration", instructions: "Add 2 real examples and ensure claims are supported." },
        ],
      },
    ],
  },
  {
    slug: "ai-affiliate-marketing",
    title: "AI Affiliate Marketing",
    icon: "🏷️",
    description:
      "Find products, automate promotions, and increase affiliate earnings with AI.",
    lessons: [
      {
        title: "Select Profitable Niches",
        content:
          "Use AI to analyze niche demand, competition, and content angles. Ask for audience pain points and product categories.",
        task:
          "Create a mini niche brief: audience, key problems, 3 product angles.",
        quiz: {
          question: "Which input helps AI generate better niche ideas?",
          options: ["No context", "Audience and problem statements", "Random keywords"],
          answerIndex: 1,
        },
        promptExamples: [
          "Act as a market analyst. Evaluate the niche [niche] for beginners: demand, competition, price points, and content angles.",
          "List top audience pain points for [niche] and 3 product categories that solve them.",
        ],
      },
      {
        title: "Create Conversion Content",
        content:
          "Generate comparison posts and scripts, then optimize for trust with transparency, pros/cons, and user stories.",
        task:
          "Write a 2-product comparison with a clear CTA and disclosure.",
        quiz: {
          question: "What's essential for trustworthy affiliate content?",
          options: ["Hype only", "Balanced pros/cons and disclosure", "No examples"],
          answerIndex: 1,
        },
        promptExamples: [
          "Create a detailed comparison between [Product A] and [Product B] for [audience]. Include pros/cons and real-use cases.",
          "Draft a CTA that is transparent about affiliate links and focuses on outcomes.",
        ],
      },
    ],
    tests: {
      midtermQuestions: Array.from({ length: 20 }).map((_, i) => ({
        question: `Midterm Q${i + 1}: Identify a key factor for affiliate trust`,
        options: ["No disclosure", "Balanced pros/cons", "Only hype", "Hide pricing"],
        answerIndex: 1,
      })),
      finalQuestions: Array.from({ length: 20 }).map((_, i) => ({
        question: `Final Q${i + 1}: Best practice for conversion content`,
        options: ["No CTA", "Transparent comparison", "Random claims", "Ignore audience"],
        answerIndex: 1,
      })),
    },
    curriculum: [
      {
        title: "Niche and Offer Strategy",
        outcome: "Define audience, pain points, and offer positioning.",
        labs: [
          { id: "ai-affiliate-marketing:m1l1", title: "Pain points discovery with AI", instructions: "Use AI to extract 5 pains and map to offers." },
          { id: "ai-affiliate-marketing:m1l2", title: "Comparison post generator", instructions: "Generate a comparison outline and fill with transparent pros/cons." },
        ],
      },
      {
        title: "Trust and Conversion",
        outcome: "Use transparent CTAs and user stories to drive conversions.",
        labs: [
          { id: "ai-affiliate-marketing:m2l1", title: "Pros/cons with disclosure", instructions: "Write balanced pros/cons with a clear disclosure block." },
          { id: "ai-affiliate-marketing:m2l2", title: "CTA optimization", instructions: "Iterate 5 CTA variations and select the best based on clarity." },
        ],
      },
    ],
  },
  {
    slug: "ai-income",
    title: "AI Income",
    icon: "💸",
    description:
      "Create new income streams with AI tools and frameworks.",
    lessons: [
      {
        title: "Identify Opportunities",
        content:
          "Map skills to monetizable services (copywriting, automation, research). Use AI to outline 3 offers.",
        task: "Draft 3 service offers with scope, deliverables, and pricing.",
        quiz: {
          question: "Which approach validates an offer quickly?",
          options: ["Hope for the best", "Pilot with 3 prospects and gather feedback", "Ignore feedback"],
          answerIndex: 1,
        },
        promptExamples: [
          "Given my skills: [list], propose 3 service offers with scope and pricing tiers.",
          "Create a pilot plan to validate [offer] with 3 prospects and gather structured feedback.",
        ],
      },
      {
        title: "Build Repeatable Systems",
        content:
          "Create templates and prompts for consistent delivery. Track effort and outcomes.",
        task: "Create a reusable prompt template for a client deliverable.",
        quiz: {
          question: "Why systematize delivery?",
          options: ["Randomness", "Consistency and scalability", "One-off only"],
          answerIndex: 1,
        },
        promptExamples: [
          "Design a reusable prompt template for [deliverable] with role, task, context, constraints, and examples.",
          "Create a tracking sheet structure to log time, outcome quality, and iteration count.",
        ],
      },
    ],
    tests: {
      midtermQuestions: Array.from({ length: 20 }).map((_, i) => ({
        question: `Midterm Q${i + 1}: Validate an offer effectively`,
        options: ["Skip feedback", "Pilot and iterate", "Random pricing", "No prospects"],
        answerIndex: 1,
      })),
      finalQuestions: Array.from({ length: 20 }).map((_, i) => ({
        question: `Final Q${i + 1}: Systemize for scale`,
        options: ["Avoid templates", "Use repeatable prompts", "One-off work", "Ignore outcomes"],
        answerIndex: 1,
      })),
    },
    curriculum: [
      {
        title: "Offer Design and Validation",
        outcome: "Craft offers and validate with quick pilots.",
        labs: [
          { id: "ai-income:m1l1", title: "Offer triad", instructions: "Produce 3 offers with scope and deliverables, then score for demand." },
          { id: "ai-income:m1l2", title: "Pilot feedback loop", instructions: "Design a feedback form and synthesize learnings with AI." },
        ],
      },
      {
        title: "Systemization",
        outcome: "Build templates and metrics for consistent delivery.",
        labs: [
          { id: "ai-income:m2l1", title: "Prompt template library", instructions: "Create and document 3 prompt templates." },
          { id: "ai-income:m2l2", title: "Outcome tracking", instructions: "Set up a simple metric log and analyze trends with AI." },
        ],
      },
    ],
  },
  {
    slug: "ai-powered-business",
    title: "AI-powered Business",
    icon: "🏢",
    description:
      "Automate workflows, analyze data, and make smarter decisions with AI.",
    lessons: [
      {
        title: "Workflow Mapping",
        content:
          "List repetitive tasks across marketing, ops, support. Identify 3 automation candidates.",
        task: "Document a before/after workflow with the AI step included.",
        quiz: {
          question: "Best first step to automate?",
          options: ["Unknown tasks", "High-frequency, low-complexity tasks", "Rare exceptions"],
          answerIndex: 1,
        },
        promptExamples: [
          "Map my business workflows across marketing, ops, and support. Identify 3 automation candidates with value estimates.",
          "Generate a before/after flow for [process], including an AI step and integration points.",
        ],
      },
      {
        title: "Decision Support",
        content:
          "Use AI to summarize customer feedback and suggest actions. Add confidence scores.",
        task: "Analyze 10 support tickets and propose 2 improvements.",
        quiz: {
          question: "What enhances AI recommendations?",
          options: ["No context", "Structured inputs and constraints", "Random data"],
          answerIndex: 1,
        },
        promptExamples: [
          "Summarize these 10 tickets and categorize by issue type. Propose 3 actions with confidence scores.",
          "Design a weekly decision support digest that highlights trends and recommended changes.",
        ],
      },
    ],
    tests: {
      midtermQuestions: Array.from({ length: 20 }).map((_, i) => ({
        question: `Midterm Q${i + 1}: Choose the best automation candidate`,
        options: ["Rare task", "Complex edge cases", "High-frequency simple task", "Unknown process"],
        answerIndex: 2,
      })),
      finalQuestions: Array.from({ length: 20 }).map((_, i) => ({
        question: `Final Q${i + 1}: Improve recommendation quality`,
        options: ["No constraints", "Structured inputs", "Random data", "Ignore feedback"],
        answerIndex: 1,
      })),
    },
    curriculum: [
      {
        title: "Automation Opportunities",
        outcome: "Identify and design high-value AI automations.",
        labs: [
          { id: "ai-powered-business:m1l1", title: "Automation candidate list", instructions: "List 5 tasks suitable for automation with value estimates." },
          { id: "ai-powered-business:m1l2", title: "Workflow redesign", instructions: "Draft a future-state workflow diagram and handoff notes." },
        ],
      },
      {
        title: "AI Decision Support",
        outcome: "Create summaries and action plans from feedback.",
        labs: [
          { id: "ai-powered-business:m2l1", title: "Feedback synthesizer", instructions: "Summarize tickets and propose actions with confidence." },
          { id: "ai-powered-business:m2l2", title: "Weekly digest", instructions: "Generate a weekly decision digest with trends." },
        ],
      },
    ],
  },
  {
    slug: "ai-marketing",
    title: "AI Marketing",
    icon: "📈",
    description:
      "Increase sales with AI-driven targeting, creatives, and analysis.",
    lessons: [
      {
        title: "Audience Research",
        content:
          "Use AI to segment audiences by intent and value. Create message pillars.",
        task: "Draft 3 audience segments with key pains and messages.",
        quiz: {
          question: "What improves ad relevance?",
          options: ["Generic copy", "Intent-based messaging", "No targeting"],
          answerIndex: 1,
        },
        promptExamples: [
          "Segment my audience for [product] into 3 intent tiers. Provide pains, desired outcomes, and key messages.",
          "Create message pillars and 5 hooks tailored to [segment].",
        ],
      },
      {
        title: "Creative Iteration",
        content:
          "Generate hooks and variations, then A/B test. Track CTR and CPA.",
        task: "Write 5 hooks and turn 2 into short scripts.",
        quiz: {
          question: "Key to creative testing?",
          options: ["One version only", "Iterate and measure", "Ignore metrics"],
          answerIndex: 1,
        },
        promptExamples: [
          "Produce 10 ad hooks for [audience]. Suggest 3 variants per hook (benefit, proof, curiosity).",
          "Draft 2 short ad scripts and propose an A/B test plan with metrics.",
        ],
      },
    ],
    tests: {
      midtermQuestions: Array.from({ length: 20 }).map((_, i) => ({
        question: `Midterm Q${i + 1}: Boost ad relevance`,
        options: ["Generic copy", "Intent-based messaging", "No targeting", "Random audience"],
        answerIndex: 1,
      })),
      finalQuestions: Array.from({ length: 20 }).map((_, i) => ({
        question: `Final Q${i + 1}: Effective creative testing`,
        options: ["Ignore metrics", "Iterate and measure", "One version only", "No tracking"],
        answerIndex: 1,
      })),
    },
    curriculum: [
      {
        title: "Audience and Messaging",
        outcome: "Build segments and message pillars for relevance.",
        labs: [
          { id: "ai-marketing:m1l1", title: "Segmentation workshop", instructions: "Create 3 segments with pains, outcomes, and messages." },
          { id: "ai-marketing:m1l2", title: "Pillar crafting", instructions: "Draft message pillars and map hooks to segments." },
        ],
      },
      {
        title: "Creative Testing",
        outcome: "Generate variations and design a simple A/B plan.",
        labs: [
          { id: "ai-marketing:m2l1", title: "Hook library", instructions: "Generate 10 hooks with variants and categorize by angle." },
          { id: "ai-marketing:m2l2", title: "A/B test plan", instructions: "Design an A/B test for 2 scripts with KPI definitions." },
        ],
      },
    ],
  },
  {
    slug: "ai-learning-productivity",
    title: "AI Learning & Productivity",
    icon: "⚙️",
    description:
      "Master prompts and tools that save time and improve quality.",
    lessons: [
      {
        title: "Prompt Patterns",
        content:
          "Use role, task, context, constraints, and examples. Build a prompt library.",
        task: "Create a 5-part prompt template for your daily task.",
        quiz: {
          question: "Which element increases prompt quality?",
          options: ["No constraints", "Clear context and examples", "Random ask"],
          answerIndex: 1,
        },
        promptExamples: [
          "Create a 5-part template for [task]: role, task, context, constraints, examples.",
          "Given [task], propose 3 variations with different constraints and examples.",
        ],
      },
      {
        title: "Personal Knowledge Base",
        content:
          "Organize notes and snippets. Use AI to summarize and tag.",
        task: "Summarize 3 articles and add tags for quick retrieval.",
        quiz: {
          question: "Best way to retain learnings?",
          options: ["Never review", "Capture, summarize, and revisit", "Only skim"],
          answerIndex: 1,
        },
        promptExamples: [
          "Summarize these 3 articles into 150-word abstracts and propose 5 tags each.",
          "Design a weekly review prompt that surfaces key insights and action items.",
        ],
      },
    ],
    tests: {
      midtermQuestions: Array.from({ length: 20 }).map((_, i) => ({
        question: `Midterm Q${i + 1}: Improve prompt quality`,
        options: ["No context", "Add constraints and examples", "Random ask", "Avoid role"],
        answerIndex: 1,
      })),
      finalQuestions: Array.from({ length: 20 }).map((_, i) => ({
        question: `Final Q${i + 1}: Retain learnings effectively`,
        options: ["Never review", "Capture and revisit", "Ignore summaries", "Only skim"],
        answerIndex: 1,
      })),
    },
    curriculum: [
      {
        title: "Prompt Mastery",
        outcome: "Build and refine prompt templates for daily tasks.",
        labs: [
          { id: "ai-learning-productivity:m1l1", title: "Template design", instructions: "Create a 5-part prompt template for a key task." },
          { id: "ai-learning-productivity:m1l2", title: "Variation testing", instructions: "Generate 3 variations and compare outcomes." },
        ],
      },
      {
        title: "Knowledge Capture",
        outcome: "Summarize, tag, and review information effectively.",
        labs: [
          { id: "ai-learning-productivity:m2l1", title: "Summarize & tag", instructions: "Summarize 3 sources and tag consistently." },
          { id: "ai-learning-productivity:m2l2", title: "Weekly review routine", instructions: "Create a review prompt and schedule." },
        ],
      },
    ],
  },
];

export function getCourseBySlug(slug) {
  return courses.find((c) => c.slug === slug);
}

export function getAllCourses() {
  return courses;
}