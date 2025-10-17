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
        title: "Audience & Goals",
        content:
          "Define your audience persona and content goals. Use AI to clarify pains, desired outcomes, and tone preferences.",
        task:
          "Write a 3-line audience brief and a 2-line goal statement for your next content piece.",
        quiz: {
          question: "What context improves AI ideation most?",
          options: ["Random topic", "Audience + pains + desired outcome", "Only length"],
          answerIndex: 1,
        },
        promptExamples: [
          "Act as a strategist. Create a persona for [audience] with pains, outcomes, and tone cues.",
          "Given my goal [goal], propose 5 angles that match the persona's outcomes.",
        ],
      },
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
        promptExamples: [
          "Act as an editorial strategist. Suggest 10 blog titles for [audience] about [topic], each with a distinct angle (how-to, case study, myth-busting).",
          "Given these audience pain points: [list], generate 5 content ideas with clear benefits and target outcomes.",
        ],
      },
      {
        title: "Research & Angle Selection",
        content:
          "Use AI to gather source ideas, outline claims to validate, and pick a clear angle (how-to, case study, myth-busting).",
        task:
          "List 3 sources to check and define your unique angle with a one-sentence thesis.",
        quiz: {
          question: "Which step best reduces weak content?",
          options: ["Skip research", "Verify claims and pick a specific angle", "Write from memory"],
          answerIndex: 1,
        },
        promptExamples: [
          "Suggest 5 credible sources and facts to validate for [topic] aimed at [audience].",
          "Propose 3 distinct angles with thesis statements and key proof points.",
        ],
      },
      {
        title: "Outline Architecture",
        content:
          "Create a structured outline with H2/H3s, summaries, and key points that ladder to your thesis.",
        task:
          "Draft an outline with 5 sections and 2 bullet points per section.",
        quiz: {
          question: "What makes outlines effective?",
          options: ["Random headings", "H2/H3s with summaries and proof points", "Only a conclusion"],
          answerIndex: 1,
        },
        promptExamples: [
          "Generate an outline for [topic] with H2/H3s and 2 key points per section. Include a short summary per H2.",
          "Transform this outline into a logical flow with transitions and hooks.",
        ],
      },
      {
        title: "Source Gathering & Fact-Checking",
        content:
          "Compile quotes, stats, and examples. Use AI to request citations and flag claims for verification.",
        task:
          "Collect 5 facts with source links; mark confidence levels.",
        quiz: {
          question: "Best way to prevent hallucinations?",
          options: ["Trust blindly", "Request citations and verify", "Skip sources"],
          answerIndex: 1,
        },
        promptExamples: [
          "List 5 facts for [topic] with source links and a confidence score.",
          "Compare 3 sources and summarize consensus and disagreements.",
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
      {
        title: "Voice & Tone Calibration",
        content:
          "Establish a tone guide (vocabulary, sentence length, formality). Provide sample paragraphs to mimic.",
        task:
          "Create a 6-point tone guide and rewrite one section to match.",
        quiz: {
          question: "How do you keep content in your voice?",
          options: ["Avoid guidance", "Provide a tone guide and samples", "Use generic phrasing"],
          answerIndex: 1,
        },
        promptExamples: [
          "Mimic this tone: [samples]. Use vocabulary [list] and sentence length [range].",
          "Calibrate tone for [audience] with clarity and credibility cues.",
        ],
      },
      {
        title: "Example Integration",
        content:
          "Add real examples, case studies, and counterexamples to support claims and make ideas tangible.",
        task:
          "Insert 2 examples and 1 counterexample with outcomes and lessons.",
        quiz: {
          question: "What strengthens credibility?",
          options: ["No examples", "Concrete examples with outcomes", "Only quotes"],
          answerIndex: 1,
        },
        promptExamples: [
          "Add 2 real examples from [industry] that illustrate this point. Include outcomes and key lesson.",
          "Provide a counterexample and explain boundary conditions.",
        ],
      },
      {
        title: "SEO Optimization",
        content:
          "Use AI to propose keywords, internal links, and meta descriptions without keyword stuffing.",
        task:
          "Generate a meta description, 5 keywords, and 3 internal link suggestions.",
        quiz: {
          question: "Responsible SEO with AI means?",
          options: ["Stuff keywords", "Balance relevance and readability", "Ignore intent"],
          answerIndex: 1,
        },
        promptExamples: [
          "Suggest 5 intent-aligned keywords and a meta description for [article].",
          "Propose 3 internal links to existing content and explain relevance.",
        ],
      },
      {
        title: "Visuals & Assets Brief",
        content:
          "Create image prompts or asset briefs to support key sections (diagrams, callouts).",
        task:
          "Write 2 image prompts and 1 diagram description aligned to your article.",
        quiz: {
          question: "Best practice for visuals?",
          options: ["Random stock", "Align visuals to core claims and outcomes", "No visuals"],
          answerIndex: 1,
        },
        promptExamples: [
          "Generate an image prompt for [section] emphasizing [concept] and [style].",
          "Describe a simple diagram for [process] with labeled steps.",
        ],
      },
      {
        title: "Long-form Expansion",
        content:
          "Expand sections with deeper proof, examples, and reusable subheadings while keeping clarity.",
        task:
          "Take one section and expand to 400 words with 2 subheadings.",
        quiz: {
          question: "What keeps long-form readable?",
          options: ["No structure", "Clear subheadings and concise paragraphs", "Very long sentences"],
          answerIndex: 1,
        },
        promptExamples: [
          "Expand [section] to long-form with 2 subheads and add 1 proof point per subhead.",
          "Refactor paragraphs to 1 idea each and add transitions.",
        ],
      },
      {
        title: "Internal Links & CTAs",
        content:
          "Add internal links and CTAs that guide readers to next steps or related content.",
        task:
          "Insert 3 internal links and write 1 clear CTA with outcome.",
        quiz: {
          question: "Effective CTAs are?",
          options: ["Vague", "Outcome-driven and transparent", "Only emojis"],
          answerIndex: 1,
        },
        promptExamples: [
          "Suggest 3 internal links with anchor text aligned to [article] claims.",
          "Draft a CTA that sets expectations and outcome for [audience].",
        ],
      },
      {
        title: "Repurposing Across Formats",
        content:
          "Turn the article into a thread, email, and short script while preserving core message.",
        task:
          "Create a 5-tweet thread and a 90-second script based on your article.",
        quiz: {
          question: "Repurposing works when?",
          options: ["Random rewrite", "Message stays consistent across formats", "No CTA"],
          answerIndex: 1,
        },
        promptExamples: [
          "Convert this article into a 5-tweet thread with hooks and outcomes.",
          "Draft a short script with hook, proof, CTA, and tone [style].",
        ],
      },
      {
        title: "Editorial Calendar & Workflow",
        content:
          "Use AI to plan publishing cadence, assign tasks, and track drafts to published.",
        task:
          "Create a 4-week calendar with topics, owners, and due dates.",
        quiz: {
          question: "What improves consistency?",
          options: ["Ad hoc posting", "Calendar and workflow with tracked steps", "Random delays"],
          answerIndex: 1,
        },
        promptExamples: [
          "Generate a 4-week editorial calendar for [audience/topic] with due dates and task checklist.",
          "Produce a workflow checklist: outline, draft, edit, QA, publish.",
        ],
      },
      {
        title: "Publish & Measure",
        content:
          "Publish and measure performance (CTR, time on page). Use AI to summarize learnings and propose improvements.",
        task:
          "Log 3 metrics and write 2 improvement ideas.",
        quiz: {
          question: "Best post-launch practice?",
          options: ["Ignore data", "Review metrics and iterate", "Delete content"],
          answerIndex: 1,
        },
        promptExamples: [
          "Summarize performance for [article] and propose 2 improvements.",
          "Suggest hypotheses for the next iteration based on CTR/time on page.",
        ],
      },
    ],
    tests: {
      midtermQuestions: [
        {
          question: "Which prompt structure reliably produces a solid blog outline?",
          options: [
            "Ask for a draft with no context",
            "Role + task + audience + constraints + examples",
            "One-word prompt",
            "Let AI decide everything",
          ],
          answerIndex: 1,
        },
        {
          question: "What most improves AI-written content quality?",
          options: [
            "Publish immediately",
            "Iterate with feedback and add personal insights",
            "Remove headings",
            "Ignore audience",
          ],
          answerIndex: 1,
        },
        {
          question: "How do you keep content in your voice?",
          options: [
            "Avoid tone guidance",
            "Provide a tone/voice guide and sample paragraphs",
            "Let AI choose a random tone",
            "Use only generic phrasing",
          ],
          answerIndex: 1,
        },
        {
          question: "Best way to reduce AI hallucinations in content?",
          options: [
            "Never check facts",
            "Request sources and verify claims",
            "Delete examples",
            "Hide context",
          ],
          answerIndex: 1,
        },
        {
          question: "How should you ask for headlines that fit your audience?",
          options: [
            "Say ‘Give me ideas’",
            "Use audience-specific prompts with angles and outcomes",
            "Ask for random titles",
            "Skip constraints",
          ],
          answerIndex: 1,
        },
        {
          question: "When should real examples be used?",
          options: [
            "Avoid examples",
            "Use credible real-world examples to support claims",
            "Only add quotes",
            "Never personalize",
          ],
          answerIndex: 1,
        },
        {
          question: "How do you get structured sections from AI?",
          options: [
            "No outline",
            "Request H2s with summaries and key points",
            "Random paragraphs",
            "Only a conclusion",
          ],
          answerIndex: 1,
        },
        {
          question: "Ethical best practice when publishing AI-assisted content?",
          options: [
            "Hide AI usage",
            "Disclose AI assistance when appropriate",
            "Overstate claims",
            "Copy others without attribution",
          ],
          answerIndex: 1,
        },
        {
          question: "Efficient iteration strategy?",
          options: [
            "Change everything at once",
            "Give feedback per section and re-run",
            "Never iterate",
            "Skip editing",
          ],
          answerIndex: 1,
        },
        {
          question: "What context should you include in prompts?",
          options: [
            "No audience or goal",
            "Audience, goal, format, length, examples",
            "Only length",
            "Only emojis",
          ],
          answerIndex: 1,
        },
      ],
      finalQuestions: Array.from({ length: 10 }).map((_, i) => ({
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
        title: "Audience Pain Points Deep Dive",
        content:
          "Use AI to collect pains, objections, and desired outcomes for your chosen audience segment.",
        task:
          "Write 5 pains, 5 objections, and 3 desired outcomes for your segment.",
        quiz: {
          question: "Trustworthy recommendations start with?",
          options: ["Random hype", "Understanding pains and outcomes", "Price only"],
          answerIndex: 1,
        },
        promptExamples: [
          "Extract top pains and desired outcomes for [audience] considering [product category].",
          "List common objections and how to address them ethically.",
        ],
      },
      {
        title: "Offer Mapping & Positioning",
        content:
          "Map audience pains to product benefits and position offers clearly (who, what, why).",
        task:
          "Create a positioning statement and 3 benefit bullets matched to pains.",
        quiz: {
          question: "Strong positioning is?",
          options: ["Vague claims", "Specific benefits tied to pains", "Only features"],
          answerIndex: 1,
        },
        promptExamples: [
          "Write a positioning statement for [product] for [audience] with clear benefits.",
          "Match 3 pains to 3 benefits and propose expected outcomes.",
        ],
      },
      {
        title: "Affiliate Program Vetting",
        content:
          "Evaluate commission, cookie windows, payout reliability, and compliance.",
        task:
          "Vet 2 programs and note pros/cons and compliance requirements.",
        quiz: {
          question: "Ethical affiliate practice includes?",
          options: ["Hide terms", "Understand compliance and disclose", "Ignore reliability"],
          answerIndex: 1,
        },
        promptExamples: [
          "Compare affiliate programs for [niche] across commission, cookie, and reliability.",
          "Summarize compliance guidelines relevant to your audience.",
        ],
      },
      {
        title: "Product Research with AI",
        content:
          "Use AI to gather features, pros/cons, user stories, and fit for segments.",
        task:
          "List 5 features, 3 pros, 3 cons for 2 products, and segment fit.",
        quiz: {
          question: "Balanced product research means?",
          options: ["Only pros", "Pros/cons and real use cases", "Random bullets"],
          answerIndex: 1,
        },
        promptExamples: [
          "Summarize features and pros/cons of [Product A] and [Product B] for [segment].",
          "Provide 2 user stories illustrating fit and limitations.",
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
      {
        title: "Transparent Disclosures & Trust Signals",
        content:
          "Add disclosures, mention limitations, and provide sources to build trust.",
        task:
          "Write a disclosure block and 2 trust signals (sources, screenshots).",
        quiz: {
          question: "Honest recommendations include?",
          options: ["Hide drawbacks", "State limitations and link sources", "Only hype"],
          answerIndex: 1,
        },
        promptExamples: [
          "Draft a disclosure for affiliate content that sets expectations.",
          "Add 2 trust signals to the comparison page that increase credibility.",
        ],
      },
      {
        title: "Comparison Frameworks & Scoring",
        content:
          "Create a scoring rubric (features, price, support, fit) to compare products objectively.",
        task:
          "Build a 4-criteria scorecard and apply it to 2 products.",
        quiz: {
          question: "Objective comparisons use?",
          options: ["Vague claims", "Clear criteria with scores", "Only emojis"],
          answerIndex: 1,
        },
        promptExamples: [
          "Design a comparison rubric and score [Product A] vs [Product B] with justification.",
          "Explain segment-specific fit with pros and cons.",
        ],
      },
      {
        title: "CTA Optimization",
        content:
          "Iterate CTAs based on audience intent; be transparent and outcome-driven.",
        task:
          "Write 3 CTA variants and pick the clearest one.",
        quiz: {
          question: "Effective CTAs are?",
          options: ["Vague", "Clear outcomes and transparency", "Deceptive urgency"],
          answerIndex: 1,
        },
        promptExamples: [
          "Generate 3 CTA variants for [audience intent] with clear outcomes.",
          "Rewrite a CTA to be transparent about affiliate links.",
        ],
      },
      {
        title: "Landing Page Alignment",
        content:
          "Ensure the landing page messaging matches your recommendations and audience intent.",
        task:
          "Write 3 alignment notes and 2 improvements for the landing page.",
        quiz: {
          question: "Alignment reduces?",
          options: ["Confusion", "Clarity", "Conversion"],
          answerIndex: 0,
        },
        promptExamples: [
          "Audit landing page of [Product] for message alignment with [audience] intent.",
          "Suggest 2 copy changes to improve clarity and trust.",
        ],
      },
      {
        title: "Email Sequence with AI",
        content:
          "Draft a 3-email sequence (problem, proof, CTA) tailored to segment pains and outcomes.",
        task:
          "Write emails: problem-aware, solution-aware, and CTA-focused.",
        quiz: {
          question: "A good sequence includes?",
          options: ["Only CTA", "Problem, proof, CTA", "Random topics"],
          answerIndex: 1,
        },
        promptExamples: [
          "Draft 3 emails for [segment] with problem, proof, and CTA.",
          "Add disclosures and avoid misleading claims.",
        ],
      },
      {
        title: "Social Scripts & Short-form",
        content:
          "Create ethical social scripts (hooks, proof, CTA) for reels/shorts targeting segment intent.",
        task:
          "Write 2 short scripts and 1 reel outline.",
        quiz: {
          question: "Responsible social content avoids?",
          options: ["Sensitive attributes targeting", "Clear segments and outcomes", "Compliance"],
          answerIndex: 0,
        },
        promptExamples: [
          "Write a 60-second script with hook, proof, and transparent CTA.",
          "Provide 3 hooks mapped to segment intent.",
        ],
      },
      {
        title: "A/B Test Plan & Hypotheses",
        content:
          "Design a test plan with clear hypotheses, variants, and success metrics (CTR, CPA).",
        task:
          "Write 2 hypotheses and define metrics and sample size estimate.",
        quiz: {
          question: "Best A/B practice?",
          options: ["No metrics", "Track CTR/CPA and state hypotheses", "Guess winners"],
          answerIndex: 1,
        },
        promptExamples: [
          "Generate a simple A/B plan for 2 CTAs with metrics and stopping rules.",
          "Log hypotheses and outcomes for learning.",
        ],
      },
      {
        title: "Analytics & Attribution",
        content:
          "Set up basic tracking for clicks and conversions. Use AI to summarize performance and insights.",
        task:
          "Collect CTR/CPA for 2 variants and write 2 insights.",
        quiz: {
          question: "Learning improves when?",
          options: ["Ignore data", "Log metrics and insights", "Only likes"],
          answerIndex: 1,
        },
        promptExamples: [
          "Summarize analytics for [campaign] and recommend next steps.",
          "Explain attribution caveats ethically.",
        ],
      },
      {
        title: "Scale & Compliance",
        content:
          "Scale winners, retire losers, and maintain compliance (disclosures, claims).",
        task:
          "Write a scaling checklist and a compliance note for your campaign.",
        quiz: {
          question: "Scaling responsibly means?",
          options: ["Overpromise", "Transparent claims and disclosures", "Spam"],
          answerIndex: 1,
        },
        promptExamples: [
          "Create a scaling plan for [channel] with budget and compliance reminders.",
          "Draft a disclosure to include consistently across assets.",
        ],
      },
    ],
    tests: {
      midtermQuestions: [
        {
          question: "Which factor builds trust in AI-assisted affiliate content?",
          options: ["No disclosure", "Transparent disclosure and pros/cons", "Only hype", "Hide pricing"],
          answerIndex: 1,
        },
        {
          question: "Best way to use AI for niche selection?",
          options: ["Guess randomly", "Analyze demand, competition, and audience pains", "Ignore data", "Copy a competitor"],
          answerIndex: 1,
        },
        {
          question: "How should AI compare products for your audience?",
          options: ["One-sided claims", "Balanced pros/cons with real use cases", "No context", "Only price"],
          answerIndex: 1,
        },
        {
          question: "Ethical practice when using AI in affiliate content?",
          options: ["Hide affiliate links", "Include transparent CTAs and disclosures", "Use deceptive claims", "Ignore compliance"],
          answerIndex: 1,
        },
        {
          question: "How can AI improve conversion copy?",
          options: ["Random adjectives", "Audience intent-based messaging with clear outcomes", "Avoid structure", "No CTA"],
          answerIndex: 1,
        },
        {
          question: "What data helps AI recommend better offers?",
          options: ["None", "Audience pain points and desired outcomes", "Only product names", "Anecdotes only"],
          answerIndex: 1,
        },
        {
          question: "How to validate AI-generated copy?",
          options: ["Publish without testing", "A/B test variants and track CTR/CPA", "Only ask friends", "Ignore performance"],
          answerIndex: 1,
        },
        {
          question: "What should an AI-generated comparison include?",
          options: ["Vague claims", "Pros/cons, features, and use cases", "Only pros", "Random bullets"],
          answerIndex: 1,
        },
        {
          question: "How do you ensure recommendations are honest?",
          options: ["Hide drawbacks", "State limitations and link to sources", "Overpromise", "No context"],
          answerIndex: 1,
        },
        {
          question: "What improves AI CTA effectiveness?",
          options: ["No outcome", "Clear outcomes and transparency", "Only emojis", "Deceptive urgency"],
          answerIndex: 1,
        },
      ],
      finalQuestions: Array.from({ length: 10 }).map((_, i) => ({
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
        title: "Market Research & Validation",
        content:
          "Use AI to identify segments, competitor offers, and proof points. Plan small pilots.",
        task:
          "Write a 3-segment table and 2 validation tactics per segment.",
        quiz: {
          question: "Quick validation is?",
          options: ["Big launch", "Small pilots and feedback", "Ignore data"],
          answerIndex: 1,
        },
        promptExamples: [
          "Summarize competitor offers for [service] and gaps you can fill.",
          "Propose 2 pilot tactics for [segment] with expected outcomes.",
        ],
      },
      {
        title: "Offer Design & Packaging",
        content:
          "Craft clear deliverables, timelines, and acceptance criteria tailored to outcomes.",
        task:
          "Write a one-page offer sheet with scope and acceptance criteria.",
        quiz: {
          question: "Strong offers include?",
          options: ["Vague scope", "Clear deliverables and acceptance", "No timeline"],
          answerIndex: 1,
        },
        promptExamples: [
          "Create an offer sheet for [service] including scope, timeline, and acceptance criteria.",
          "Provide 2 examples of outcomes and quality bar.",
        ],
      },
      {
        title: "Pricing Strategy",
        content:
          "Estimate effort and value; use tiered pricing informed by tracked outcomes.",
        task:
          "Create 3 pricing tiers with inclusions and rationale.",
        quiz: {
          question: "Fair pricing is based on?",
          options: ["Gut feel", "Effort and outcomes", "Copy competitors"],
          answerIndex: 1,
        },
        promptExamples: [
          "Design pricing tiers for [service] with inclusions and effort estimates.",
          "Suggest outcome-based add-ons with pricing.",
        ],
      },
      {
        title: "Scope & SOW Creation",
        content:
          "Write a scope of work (SOW) that sets clear boundaries, deliverables, and change process.",
        task:
          "Draft a SOW section: assumptions, deliverables, and change requests.",
        quiz: {
          question: "SOWs reduce?",
          options: ["Scope creep", "Clarity", "Alignment"],
          answerIndex: 0,
        },
        promptExamples: [
          "Create a SOW for [project] with assumptions, deliverables, and acceptance criteria.",
          "Write a change request process in 3 steps.",
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
      {
        title: "Prompt Templates Library",
        content:
          "Build a small library for common deliverables (audit, report, copy).",
        task:
          "Create 3 templates and document when to use each.",
        quiz: {
          question: "Templates enable?",
          options: ["Randomness", "Repeatability", "One-offs"],
          answerIndex: 1,
        },
        promptExamples: [
          "Draft templates for [audit], [report], and [copy] with role, task, context, constraints, examples.",
          "Add variations for segment differences.",
        ],
      },
      {
        title: "Delivery Workflow",
        content:
          "Map steps from intake to delivery; add handoff notes and responsibilities.",
        task:
          "Write a 6-step workflow with inputs/outputs per step.",
        quiz: {
          question: "Clear handoffs reduce?",
          options: ["Failures", "Speed", "Quality"],
          answerIndex: 0,
        },
        promptExamples: [
          "Design a delivery workflow for [service] including inputs/outputs and owner.",
          "Add guardrails for private data handling.",
        ],
      },
      {
        title: "QA & Acceptance Criteria",
        content:
          "Define quality bars and acceptance criteria; use checklists for review.",
        task:
          "Create a 7-point QA checklist and apply to one deliverable.",
        quiz: {
          question: "Quality improves when?",
          options: ["Skip review", "Use checklists and acceptance criteria", "Guess"],
          answerIndex: 1,
        },
        promptExamples: [
          "Create acceptance criteria for [deliverable] and a review checklist.",
          "Evaluate a sample output against the checklist.",
        ],
      },
      {
        title: "Feedback Loop & Iteration",
        content:
          "Collect structured feedback and iterate prompts and templates accordingly.",
        task:
          "Design a feedback form and plan 2 iterations based on input.",
        quiz: {
          question: "Feedback should be?",
          options: ["Ignored", "Synthesized and applied", "Random"],
          answerIndex: 1,
        },
        promptExamples: [
          "Draft a feedback form for [service] and synthesize recurring themes.",
          "Propose prompt/template changes based on feedback.",
        ],
      },
      {
        title: "Case Studies & Proof",
        content:
          "Create short case studies highlighting problem, solution, and outcomes.",
        task:
          "Write a 3-paragraph case study from a pilot.",
        quiz: {
          question: "Proof increases?",
          options: ["Trust", "Skepticism", "Confusion"],
          answerIndex: 0,
        },
        promptExamples: [
          "Draft a case study with problem, approach, and quantified outcomes.",
          "Extract quotes and lessons learned.",
        ],
      },
      {
        title: "Portfolio & Positioning",
        content:
          "Build a simple portfolio and positioning statement tailored to target segments.",
        task:
          "Create a one-page portfolio and a positioning paragraph.",
        quiz: {
          question: "Positioning clarifies?",
          options: ["Who you serve and outcomes", "Only tech", "Random claims"],
          answerIndex: 0,
        },
        promptExamples: [
          "Write a positioning statement for [service] targeting [segment].",
          "Organize portfolio items with outcomes and acceptance criteria.",
        ],
      },
      {
        title: "Lead Gen & Outreach",
        content:
          "Use AI to draft outreach messages tailored to segment pains and desired outcomes.",
        task:
          "Write 3 outreach messages with personalization tokens.",
        quiz: {
          question: "Good outreach is?",
          options: ["Generic", "Segment-specific and outcome-led", "Spam"],
          answerIndex: 1,
        },
        promptExamples: [
          "Draft 3 outreach emails for [segment] referencing pains and outcomes.",
          "Suggest follow-ups with value, not pressure.",
        ],
      },
      {
        title: "Sales Conversation Prompts",
        content:
          "Prepare discovery questions and prompts to clarify scope and fit.",
        task:
          "Write 8 discovery questions and a fit checklist.",
        quiz: {
          question: "Discovery clarifies?",
          options: ["Scope and fit", "Only price", "Random"],
          answerIndex: 0,
        },
        promptExamples: [
          "Generate discovery questions for [service] to assess needs and constraints.",
          "Create a simple fit checklist and next steps.",
        ],
      },
      {
        title: "Onboarding & Retention",
        content:
          "Create onboarding checklist, communication cadence, and upsell opportunities based on outcomes.",
        task:
          "Write an onboarding checklist and 2 retention ideas.",
        quiz: {
          question: "Retention improves with?",
          options: ["No plan", "Clear cadence and outcome reviews", "Silence"],
          answerIndex: 1,
        },
        promptExamples: [
          "Draft onboarding checklist for [service] with timeline and owners.",
          "Propose 2 upsell ideas aligned to achieved outcomes.",
        ],
      },
    ],
    tests: {
      midtermQuestions: [
        {
          question: "How do you quickly validate an AI-enabled offer?",
          options: ["Launch big immediately", "Run a small pilot with 3 prospects and iterate", "Ignore feedback", "Increase price only"],
          answerIndex: 1,
        },
        {
          question: "What should a prompt template include for delivery?",
          options: ["Only task", "Role, task, context, constraints, examples", "Random notes", "No structure"],
          answerIndex: 1,
        },
        {
          question: "How can AI help scope client work?",
          options: ["Skip scoping", "Generate deliverables list and acceptance criteria", "Only chat casually", "Guess timelines"],
          answerIndex: 1,
        },
        {
          question: "Best practice to track outcomes of AI work?",
          options: ["No tracking", "Log time, quality, iterations, and results", "Only screenshots", "Avoid metrics"],
          answerIndex: 1,
        },
        {
          question: "How do you reduce rework with AI?",
          options: ["Random prompts", "Use reusable templates and checklists", "Rewrite from scratch", "Skip reviews"],
          answerIndex: 1,
        },
        {
          question: "What helps estimate pricing fairly?",
          options: ["Gut feel", "Track efforts and outcomes to inform pricing", "Copy competitors", "Ignore scope"],
          answerIndex: 1,
        },
        {
          question: "How should feedback be used with AI deliverables?",
          options: ["Ignore it", "Synthesize feedback and iterate prompts", "Delete notes", "Guess changes"],
          answerIndex: 1,
        },
        {
          question: "Best way to prevent hallucinations in client outputs?",
          options: ["No sources", "Request citations and verify", "Trust blindly", "Skip constraints"],
          answerIndex: 1,
        },
        {
          question: "How do you make AI outcomes repeatable?",
          options: ["Freestyle every time", "Document workflows and templates", "Never reuse", "Only improvise"],
          answerIndex: 1,
        },
        {
          question: "What improves client satisfaction with AI services?",
          options: ["Hide process", "Clear scope, examples, and iteration plan", "No updates", "Ignore outcomes"],
          answerIndex: 1,
        },
      ],
      finalQuestions: Array.from({ length: 10 }).map((_, i) => ({
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
        title: "Workflow Inventory & Value Estimates",
        content:
          "Audit repetitive tasks across marketing, ops, and support. Estimate impact (time saved, error reduction).",
        task: "List 10 tasks and add quick value estimates for each.",
        quiz: {
          question: "Which tasks are best to start automating?",
          options: ["Rare exceptions", "High-frequency, low-complexity tasks", "Unknown processes", "Strategic one-offs"],
          answerIndex: 1,
        },
        promptExamples: [
          "Inventory tasks across teams and score each by frequency, complexity, and potential value.",
          "Suggest 5 high-value automation candidates from this list with rationale.",
        ],
      },
      {
        title: "Candidate Selection & Scoping",
        content:
          "Pick 1–2 candidates. Define inputs, outputs, success criteria, and scope boundaries.",
        task: "Write a 1-page scope including constraints and handoffs.",
        quiz: {
          question: "What makes a good automation scope?",
          options: ["Vague goals", "Clear inputs/outputs and constraints", "Only tools listed", "No boundaries"],
          answerIndex: 1,
        },
        promptExamples: [
          "Turn this candidate into a scope with inputs, outputs, constraints, and test cases.",
          "List edge cases and exclusions for this process.",
        ],
      },
      {
        title: "Current-State Map & Pain Points",
        content:
          "Diagram the as-is workflow. Identify bottlenecks, errors, and manual handoffs.",
        task: "Create a current-state map with 5 pain points annotated.",
        quiz: {
          question: "Why map current-state before automating?",
          options: ["Looks nice", "Reveals bottlenecks and risk areas", "Optional step", "Only for later"],
          answerIndex: 1,
        },
        promptExamples: [
          "Describe the current-state for [process] and list 5 pain points with evidence.",
          "Summarize failure modes and their frequency from recent data.",
        ],
      },
      {
        title: "Future-State Design with AI Step",
        content:
          "Design the to-be workflow with an AI step, integration points, and guardrails.",
        task: "Draft a future-state diagram with inputs/outputs and AI decision criteria.",
        quiz: {
          question: "A strong future-state design includes?",
          options: ["Random tools", "Clear AI step, integrations, and guardrails", "Only goals", "Skip interfaces"],
          answerIndex: 1,
        },
        promptExamples: [
          "Generate a future-state map for [process] including AI inference and validation gates.",
          "List required integrations and responsibilities (RACI).",
        ],
      },
      {
        title: "Data Inputs & Quality Requirements",
        content:
          "Specify data sources, formats, privacy rules, and minimum quality thresholds.",
        task: "Create a data brief with fields, validation rules, and retention policy.",
        quiz: {
          question: "What reduces unreliable AI outputs?",
          options: ["Random inputs", "Structured data and validation rules", "No constraints", "Guessing"],
          answerIndex: 1,
        },
        promptExamples: [
          "Define input schemas and quality checks for this automation.",
          "Draft a privacy and retention policy aligned to company standards.",
        ],
      },
      {
        title: "Tool Evaluation & Integration Plan",
        content:
          "Compare tools by reliability, integration fit, cost, and vendor policies.",
        task: "Score 3 tools and recommend one with integration steps.",
        quiz: {
          question: "How should tools be selected?",
          options: ["Brand only", "Reliability, integration, cost, and compliance", "Random choice", "Ad popularity"],
          answerIndex: 1,
        },
        promptExamples: [
          "Create a scorecard for [tool options] with criteria and weighted scoring.",
          "Outline an integration plan with APIs, triggers, and error handling.",
        ],
      },
      {
        title: "Guardrails, Policies & Risk Controls",
        content:
          "Add constraints, human-in-the-loop steps, and escalation paths for exceptions.",
        task: "Write guardrails and an exception playbook.",
        quiz: {
          question: "Which practice reduces automation risk most?",
          options: ["Automate all at once", "Start small with guardrails and HITL", "Skip testing", "Hide errors"],
          answerIndex: 1,
        },
        promptExamples: [
          "Design guardrails for [process] including approvals and thresholds.",
          "Create an exception escalation path with roles and SLAs.",
        ],
      },
      {
        title: "Pilot Build & Test Cases",
        content:
          "Implement a small pilot. Define test cases, expected outcomes, and acceptance criteria.",
        task: "Run 5 test cases and log results.",
        quiz: {
          question: "Pilot success is best measured by?",
          options: ["Anecdotes", "Acceptance criteria and outcome logs", "Feelings", "Views"],
          answerIndex: 1,
        },
        promptExamples: [
          "Generate test cases for [process] with inputs, expected outputs, and pass/fail.",
          "Summarize pilot results with insights and next steps.",
        ],
      },
      {
        title: "Handoff Notes & Ownership (RACI)",
        content:
          "Clarify inputs/outputs, responsibilities, and communication channels.",
        task: "Write handoff notes and a simple RACI table.",
        quiz: {
          question: "What reduces handoff failures?",
          options: ["No notes", "Clear inputs/outputs and responsibilities", "Only chat", "Ignore interfaces"],
          answerIndex: 1,
        },
        promptExamples: [
          "Draft handoff notes for [process] with validation steps and contact points.",
          "Create a RACI chart for ongoing operation and incident handling.",
        ],
      },
      {
        title: "Metrics & ROI Baseline",
        content:
          "Define KPIs (time saved, error rate, throughput) and collect baseline data.",
        task: "Create a metrics log and baseline chart.",
        quiz: {
          question: "How do you measure ROI?",
          options: ["Guess", "Track time saved, error reduction, throughput", "Likes", "Random"],
          answerIndex: 1,
        },
        promptExamples: [
          "Propose KPI definitions and a tracking template for this automation.",
          "Calculate baseline and target improvements for each KPI.",
        ],
      },
      {
        title: "Monitor & Incident Playbook",
        content:
          "Set up monitoring, alerts, and a response playbook for failures.",
        task: "Write an incident playbook with triggers and actions.",
        quiz: {
          question: "Effective monitoring includes?",
          options: ["No alerts", "Thresholds, alerts, and clear actions", "Only logs", "Random checks"],
          answerIndex: 1,
        },
        promptExamples: [
          "Design alert thresholds and response steps for [failure mode].",
          "Outline on-call rotation and communication guidelines.",
        ],
      },
      {
        title: "Iteration Loop & Feedback Routing",
        content:
          "Create a cadence for reviewing outputs, routing feedback, and improving prompts/workflows.",
        task: "Set a weekly review agenda and change log.",
        quiz: {
          question: "What improves recommendations over time?",
          options: ["Ignore feedback", "Structured reviews and change logs", "Only long prompts", "Random tweaks"],
          answerIndex: 1,
        },
        promptExamples: [
          "Draft a review cadence with agenda, metrics, and decision notes.",
          "Turn findings into prompt/workflow changes and track diffs.",
        ],
      },
      {
        title: "Scale, Queues & Retries",
        content:
          "Plan for scaling: batching, queuing, retries, and backoff for reliability.",
        task: "Write a scale plan covering queues and retry policies.",
        quiz: {
          question: "Reliability at scale needs?",
          options: ["One shot", "Queues, retries, and backoff", "Random waits", "No monitoring"],
          answerIndex: 1,
        },
        promptExamples: [
          "Propose queuing and retry strategies for high-volume [process].",
          "Identify bottlenecks and mitigation tactics.",
        ],
      },
      {
        title: "Documentation & Training",
        content:
          "Document SOPs and train stakeholders on usage, exceptions, and updates.",
        task: "Create a 2-page SOP and a training checklist.",
        quiz: {
          question: "Stakeholder trust increases when?",
          options: ["Hide process", "Explain constraints and show examples", "Skip training", "No context"],
          answerIndex: 1,
        },
        promptExamples: [
          "Draft a simple SOP for operating and updating this automation.",
          "Create a training checklist with scenarios and outcomes.",
        ],
      },
      {
        title: "Executive Summary & Next Automations",
        content:
          "Summarize results, ROI, and propose 2 additional automation opportunities.",
        task: "Write a 1-page exec summary with recommendations.",
        quiz: {
          question: "A strong exec summary includes?",
          options: ["Vague goals", "Metrics, outcomes, and clear next steps", "Tool list only", "No recommendations"],
          answerIndex: 1,
        },
        promptExamples: [
          "Create an executive summary highlighting ROI and next candidates.",
          "Recommend 2 automations with scope and expected impact.",
        ],
      },
    ],
    tests: {
      midtermQuestions: [
        {
          question: "Which task is the best first candidate for AI automation?",
          options: ["Rare exceptions", "High-frequency, low-complexity task", "Unknown process", "Strategic one-offs"],
          answerIndex: 1,
        },
        {
          question: "How should you map a workflow for AI integration?",
          options: ["Skip steps", "Document current vs. future state with AI step", "Only draw boxes", "Ignore handoffs"],
          answerIndex: 1,
        },
        {
          question: "What improves decision-support recommendations?",
          options: ["Random data", "Structured inputs and constraints", "No context", "Hide feedback"],
          answerIndex: 1,
        },
        {
          question: "How do you measure ROI of an automation?",
          options: ["Guess", "Track time saved, error reduction, and throughput", "Only anecdotes", "Ignore metrics"],
          answerIndex: 1,
        },
        {
          question: "Which practice reduces risk when automating?",
          options: ["Automate everything at once", "Start small and add guardrails", "Skip testing", "Ignore exceptions"],
          answerIndex: 1,
        },
        {
          question: "Best way to handle private data with AI tools?",
          options: ["Upload everything", "Apply privacy policies and minimize data", "Share widely", "No review"],
          answerIndex: 1,
        },
        {
          question: "What helps stakeholders trust AI outputs?",
          options: ["Hide process", "Explain constraints and show examples", "No context", "Only promises"],
          answerIndex: 1,
        },
        {
          question: "How do you select tools for an automation?",
          options: ["Random choice", "Evaluate reliability, integration, cost", "Only brand", "Ignore compatibility"],
          answerIndex: 1,
        },
        {
          question: "What reduces failure in handoffs?",
          options: ["No handoff notes", "Clear inputs/outputs and responsibilities", "Only chat", "Ignore interfaces"],
          answerIndex: 1,
        },
        {
          question: "How to keep AI recommendations actionable?",
          options: ["Vague suggestions", "Tie to measurable actions with owners", "Only ideas", "Ignore constraints"],
          answerIndex: 1,
        },
      ],
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
        title: "Audience Segments & ICP",
        content:
          "Segment audiences by intent and value, and define your Ideal Customer Profile (ICP) with pains and desired outcomes.",
        task: "Create 3 segments with ICP notes: pains, outcomes, and buying triggers.",
        quiz: {
          question: "What improves ad relevance most?",
          options: ["Generic copy", "Intent-based messaging mapped to ICP", "No targeting"],
          answerIndex: 1,
        },
        promptExamples: [
          "Segment my audience for [product] into 3 intent tiers. Provide pains, desired outcomes, and buying triggers.",
          "Describe the ICP for [segment] including jobs-to-be-done and decision criteria.",
        ],
      },
      {
        title: "Message Pillars & Value Props",
        content:
          "Develop message pillars that address pains and outcomes. Craft value props with proof elements.",
        task: "Write 3 message pillars and 3 value props aligned to segments.",
        quiz: {
          question: "Credible messaging includes?",
          options: ["Overpromises", "Clear value props with evidence", "Vague benefits"],
          answerIndex: 1,
        },
        promptExamples: [
          "Create 3 message pillars for [segment] and tie each to outcomes with proof points.",
          "Draft value propositions for [product] with social proof and constraints.",
        ],
      },
      {
        title: "Offer Positioning & Proof",
        content:
          "Position your offer against alternatives. Use AI to gather proof (case studies, testimonials) and align claims.",
        task: "Write a positioning statement and list 3 proof elements.",
        quiz: {
          question: "Responsible positioning requires?",
          options: ["Inflated claims", "Accurate claims supported by evidence", "No comparisons"],
          answerIndex: 1,
        },
        promptExamples: [
          "Position [product] against [alternative] with clarity on differentiators and trade-offs.",
          "Summarize 3 proof elements and link to sources or examples.",
        ],
      },
      {
        title: "Hook Library & Angles",
        content:
          "Generate hooks across angles (benefit, proof, curiosity, objection). Organize into a library.",
        task: "Create 10 hooks and categorize by angle.",
        quiz: {
          question: "Effective hook libraries are?",
          options: ["One-off", "Organized by angle and segment", "Random notes"],
          answerIndex: 1,
        },
        promptExamples: [
          "Produce 10 hooks for [segment] across 4 angles: benefit, proof, curiosity, objection.",
          "Tag hooks by segment and intended outcome (awareness/consideration).",
        ],
      },
      {
        title: "Short Scripts & Storyboards",
        content:
          "Turn hooks into short scripts and storyboards for video or carousel ads with CTAs.",
        task: "Draft 2 short scripts and storyboard frames.",
        quiz: {
          question: "Strong scripts include?",
          options: ["No CTA", "Hook, proof, CTA, length and tone guidance", "Only hook"],
          answerIndex: 1,
        },
        promptExamples: [
          "Write 2 20–30s ad scripts for [segment] using hook→proof→CTA structure.",
          "Generate storyboard frames with captions and timing.",
        ],
      },
      {
        title: "Creative Variations & Iteration",
        content:
          "Produce copy and visual variants. Establish constraints (length, tone, format) and iterate based on metrics.",
        task: "Create 3 copy variants and 3 image/video concepts per hook.",
        quiz: {
          question: "Iteration speed improves with?",
          options: ["One shot", "Batching variants and rapid testing", "Random waits"],
          answerIndex: 1,
        },
        promptExamples: [
          "Generate 3 copy variants per hook with tone and length constraints.",
          "Propose 3 visual concepts aligned to the copy and brand cues.",
        ],
      },
      {
        title: "Targeting Strategy & Budgets",
        content:
          "Define audience targeting (interests, lookalikes, intent signals) and map budgets to test phases.",
        task: "Draft a targeting plan and budget split across tests.",
        quiz: {
          question: "Budgeting for tests should?",
          options: ["Be random", "Allocate by test phase and KPI", "Ignore KPIs"],
          answerIndex: 1,
        },
        promptExamples: [
          "Propose targeting options for [platform] based on ICP and intent signals.",
          "Create a budget split (explore vs. exploit) tied to KPIs.",
        ],
      },
      {
        title: "Landing Page Alignment",
        content:
          "Ensure landing pages align to messaging, proof, and CTA. Reduce friction and add trust signals.",
        task: "Write a landing page brief with sections and trust elements.",
        quiz: {
          question: "Conversion improves when?",
          options: ["Mismatch messaging", "LP matches ad promise with proof and simple CTA", "Hide trust signals"],
          answerIndex: 1,
        },
        promptExamples: [
          "Create a landing page outline that mirrors the ad promise and includes proof.",
          "Suggest 5 trust signals for [offer] and place them logically.",
        ],
      },
      {
        title: "Email Nurture & Drip",
        content:
          "Design a 3–5 email sequence that nurtures segments with value, proof, and offers.",
        task: "Draft subject lines and bodies for 3 emails.",
        quiz: {
          question: "Effective nurture focuses on?",
          options: ["Spam", "Value, relevance, and clear CTAs", "Random sends"],
          answerIndex: 1,
        },
        promptExamples: [
          "Create a 3-email sequence for [segment] with value and proof.",
          "Write subject lines and preview text optimizing for opens.",
        ],
      },
      {
        title: "Social Distribution & Short-form",
        content:
          "Adapt creatives to short-form content (reels, shorts, carousels) and schedule distribution.",
        task: "Produce 3 short-form posts with captions and hooks.",
        quiz: {
          question: "Short-form success comes from?",
          options: ["Long intros", "Strong hooks, pacing, and clear CTA", "No CTA"],
          answerIndex: 1,
        },
        promptExamples: [
          "Transform this hook into a 20s short with captions and CTA.",
          "Create 3 carousel frames for [topic] with benefits and proof.",
        ],
      },
      {
        title: "A/B Test Plan & KPIs",
        content:
          "Define hypotheses, variants, sample sizes, and KPIs (CTR, CPA, ROAS).",
        task: "Write an A/B test plan for 2 variants with hypotheses.",
        quiz: {
          question: "Good tests include?",
          options: ["No metrics", "Hypotheses, KPIs, and significance thresholds", "Only likes"],
          answerIndex: 1,
        },
        promptExamples: [
          "Draft an A/B plan with hypotheses, KPIs, and sample size estimates.",
          "List decision rules for stopping or scaling based on results.",
        ],
      },
      {
        title: "Analytics & Attribution",
        content:
          "Set up tracking, UTM conventions, and basic attribution (last-click vs. modeled).",
        task: "Create a tracking plan and UTM builder template.",
        quiz: {
          question: "Learning improves when?",
          options: ["Delete data", "Track consistently and review cohorts", "Guess winners"],
          answerIndex: 1,
        },
        promptExamples: [
          "Propose an analytics plan with UTMs and event tracking for [campaign].",
          "Summarize cohort performance and insights from attribution models.",
        ],
      },
      {
        title: "Personalization Guardrails",
        content:
          "Personalize responsibly: avoid sensitive attributes, minimize data, and ensure relevance.",
        task: "Write guardrails and examples of acceptable personalization.",
        quiz: {
          question: "Responsible personalization avoids?",
          options: ["Sensitive attributes", "Intent cues and non-sensitive context", "Guardrails"],
          answerIndex: 0,
        },
        promptExamples: [
          "Define personalization rules for [channel] using intent signals only.",
          "Rewrite ad copy to be relevant without using sensitive attributes.",
        ],
      },
      {
        title: "Compliance & Disclosures",
        content:
          "Ensure claims, disclosures, and affiliate rules are followed for each channel.",
        task: "Create a compliance checklist for 2 channels.",
        quiz: {
          question: "Compliance requires?",
          options: ["Hide drawbacks", "Evidence-backed claims and clear disclosures", "Only emojis"],
          answerIndex: 1,
        },
        promptExamples: [
          "Draft compliant copy for [channel] including disclosures and fair comparison.",
          "List disallowed claims and rewrite risky lines.",
        ],
      },

      {
        title: "Optimization Loop & Exec Summary",
        content:
          "Summarize results, lessons, and next test ideas. Propose optimization and budget shifts.",
        task: "Write an exec summary with recommendations and next steps.",
        quiz: {
          question: "Strong summaries include?",
          options: ["Vague ideas", "KPIs, outcomes, lessons, and clear next steps", "Tool list only"],
          answerIndex: 1,
        },
        promptExamples: [
          "Create an exec summary with results, lessons, and next experiments.",
          "Recommend budget reallocations based on performance.",
        ],
      },
    ],
    tests: {
      midtermQuestions: [
        {
          question: "What improves ad relevance when using AI?",
          options: ["Generic copy", "Intent-based messaging and audience context", "No targeting", "Only vanity metrics"],
          answerIndex: 1,
        },
        {
          question: "How should hooks be generated with AI?",
          options: ["Write one version", "Generate multiple angles and iterate", "Ignore outcomes", "Avoid testing"],
          answerIndex: 1,
        },
        {
          question: "Best metric practice for A/B tests?",
          options: ["No metrics", "Track CTR, CPA, and significance", "Only likes", "Guess winners"],
          answerIndex: 1,
        },
        {
          question: "How do you personalize creatives responsibly?",
          options: ["Use random data", "Segment by intent and avoid sensitive attributes", "No segmentation", "Spam audiences"],
          answerIndex: 1,
        },
        {
          question: "What should you provide AI to write better ad copy?",
          options: ["No brief", "Audience pains, desired outcomes, product positioning", "Only product name", "Emojis only"],
          answerIndex: 1,
        },
        {
          question: "How to avoid misleading claims?",
          options: ["Overpromise", "Use evidence and clear disclosures", "Hide drawbacks", "Ignore compliance"],
          answerIndex: 1,
        },
        {
          question: "What improves iteration speed?",
          options: ["One shot", "Batch variants and test quickly", "Random waits", "Only long-form"],
          answerIndex: 1,
        },
        {
          question: "How should you brief AI for scripts?",
          options: ["No structure", "Provide hook, proof, CTA, length, and tone", "Only CTA", "Only hook"],
          answerIndex: 1,
        },
        {
          question: "Which practice enhances learning from tests?",
          options: ["Ignore results", "Log hypotheses and outcomes", "No notes", "Delete data"],
          answerIndex: 1,
        },
        {
          question: "How do you ensure relevance across segments?",
          options: ["One message", "Map hooks to segments and measure", "Only broad targeting", "Avoid testing"],
          answerIndex: 1,
        },
      ],
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
        title: "Template Library & Variable Slots",
        content:
          "Create reusable templates with variable slots for audience, tone, and outputs.",
        task: "Document 5 templates with variables and use cases.",
        quiz: {
          question: "Libraries are effective when?",
          options: ["Only in memory", "Documented with variations and use cases", "Never reused", "Screenshots only"],
          answerIndex: 1,
        },
        promptExamples: [
          "Build a template library with variables and examples.",
          "List use cases and constraints for each template.",
        ],
      },
      {
        title: "Constraint Design & Output Formats",
        content:
          "Specify format, length, style, and exclusions to improve reliability.",
        task: "Design constraints for 3 tasks and show improved outputs.",
        quiz: {
          question: "Effective constraints include?",
          options: ["None", "Format, length, style, exclusions", "Only emojis", "Random limits"],
          answerIndex: 1,
        },
        promptExamples: [
          "Add constraints to this prompt to produce structured outputs.",
          "Create output format examples (tables, lists, sections).",
        ],
      },
      {
        title: "Feedback-Driven Iteration Loop",
        content:
          "Provide structured feedback and re-run with changes. Track diffs and improvements.",
        task: "Run 3 iterations on one task and log changes.",
        quiz: {
          question: "What improves iteration quality?",
          options: ["Never iterate", "Structured feedback and re-run", "Only rewrite", "Random changes"],
          answerIndex: 1,
        },
        promptExamples: [
          "Create an iteration plan with feedback comments and re-run prompts.",
          "Summarize improvements across iterations.",
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
      {
        title: "Retrieval Cues & Tag Taxonomy",
        content:
          "Create consistent tags and retrieval cues for fast lookup.",
        task: "Design a tag taxonomy and apply to 10 notes.",
        quiz: {
          question: "Knowledge stays retrievable when?",
          options: ["No tags", "Consistent tagging and short abstracts", "Full text only", "Random labels"],
          answerIndex: 1,
        },
        promptExamples: [
          "Propose a tag taxonomy and retrieval cues for my notes.",
          "Rewrite abstracts to include cues and outcomes.",
        ],
      },
      {
        title: "Summarization & Comparison Modes",
        content:
          "Summarize sources, compare consensus and disagreements, and request citations.",
        task: "Summarize 3 sources and write a comparison table.",
        quiz: {
          question: "Avoid hallucinations by?",
          options: ["Trust blindly", "Request sources and compare across items", "No review", "Skip citations"],
          answerIndex: 1,
        },
        promptExamples: [
          "Summarize and compare these sources with citations and confidence.",
          "List agreements and disagreements with references.",
        ],
      },
      {
        title: "Weekly Review Ritual",
        content:
          "Create a review cadence to surface takeaways and action items.",
        task: "Write a weekly review prompt and schedule.",
        quiz: {
          question: "AI can help weekly reviews by?",
          options: ["Ignoring insights", "Surfacing takeaways and actions", "Only listing links", "Deleting notes"],
          answerIndex: 1,
        },
        promptExamples: [
          "Design a weekly review prompt that outputs insights and action items.",
          "Create a schedule and checklist for review.",
        ],
      },
      {
        title: "Meeting Notes & Action Extractor",
        content:
          "Capture meetings and extract decisions, owners, and deadlines.",
        task: "Process one meeting and produce an action list.",
        quiz: {
          question: "Useful meeting outputs include?",
          options: ["Long transcript only", "Decisions, owners, deadlines", "Emojis", "Random notes"],
          answerIndex: 1,
        },
        promptExamples: [
          "Extract actions from this meeting and assign owners and deadlines.",
          "Summarize decisions with context and next steps.",
        ],
      },
      {
        title: "Email & Writing Assistant Workflows",
        content:
          "Design prompts for emails, outlines, and drafts with tone and structure.",
        task: "Draft 3 emails and one outline using templates.",
        quiz: {
          question: "Better writing with AI requires?",
          options: ["No context", "Audience, tone, structure, constraints", "Only length", "Random asks"],
          answerIndex: 1,
        },
        promptExamples: [
          "Create email prompts with audience, tone, and constraints.",
          "Generate an outline template for recurring documents.",
        ],
      },
      {
        title: "Document Generation Pipelines",
        content:
          "Chain prompts to produce structured documents (reports, SOPs, proposals).",
        task: "Build a pipeline that outputs a 2-page report.",
        quiz: {
          question: "Pipelines are reliable when?",
          options: ["One step", "Defined stages with constraints and checks", "Random chain", "No formats"],
          answerIndex: 1,
        },
        promptExamples: [
          "Design a multi-stage prompt pipeline for [document].",
          "Add validation checks between stages.",
        ],
      },
      {
        title: "Automation Starters (Shortcuts/CLI)",
        content:
          "Identify simple automation starters (templates, scripts, shortcuts) to reduce manual work.",
        task: "Automate one recurring task with a shortcut or script.",
        quiz: {
          question: "Good starter automations are?",
          options: ["Complex systems", "Small recurring tasks with clear inputs", "Unknown processes", "Rare events"],
          answerIndex: 1,
        },
        promptExamples: [
          "Suggest a simple automation for this recurring task.",
          "Outline inputs, outputs, and triggers for the shortcut.",
        ],
      },
      {
        title: "Personal SOPs & Checklists",
        content:
          "Document steps for common tasks to ensure repeatability and quality.",
        task: "Write SOPs for 2 tasks with checklists.",
        quiz: {
          question: "Repeatability increases when?",
          options: ["No documentation", "Clear SOPs and checklists", "Random order", "Only memory"],
          answerIndex: 1,
        },
        promptExamples: [
          "Draft SOPs for [task] including checks and exceptions.",
          "Create checklists that enforce constraints and outcomes.",
        ],
      },
      {
        title: "Quality Assurance & Traps",
        content:
          "Design QA checks to avoid hallucinations and low-quality outputs.",
        task: "Create a QA checklist for 3 tasks.",
        quiz: {
          question: "Avoid poor outputs by?",
          options: ["Trust blindly", "Request examples/citations and verify", "Only long prompts", "Skip constraints"],
          answerIndex: 1,
        },
        promptExamples: [
          "Write QA checks for [task] including citations and exclusions.",
          "Add review prompts that flag low-confidence outputs.",
        ],
      },
      {
        title: "Reusable Prompt Portfolio",
        content:
          "Curate a portfolio of tested prompts with examples and performance notes.",
        task: "Publish a portfolio with 10 prompts and outcomes.",
        quiz: {
          question: "A strong portfolio includes?",
          options: ["Vague ideas", "Examples, constraints, outcomes, and notes", "Hidden prompts", "Only screenshots"],
          answerIndex: 1,
        },
        promptExamples: [
          "Compile your best prompts with examples and performance notes.",
          "Summarize when to use each prompt and expected results.",
        ],
      },
    ],
    tests: {
      midtermQuestions: [
        {
          question: "Which elements make a strong prompt?",
          options: ["Random ask", "Role, task, context, constraints, examples", "No constraints", "Only role"],
          answerIndex: 1,
        },
        {
          question: "What increases output reliability?",
          options: ["No review", "Add constraints and request examples/citations", "Only long prompts", "Guess"],
          answerIndex: 1,
        },
        {
          question: "Best practice for building a prompt library?",
          options: ["Keep in mind only", "Document templates with variations and use cases", "Never reuse", "Only screenshots"],
          answerIndex: 1,
        },
        {
          question: "How should you capture learnings from sources?",
          options: ["Only skim", "Summarize, tag, and review weekly", "No tags", "Forget quickly"],
          answerIndex: 1,
        },
        {
          question: "What helps personalize outputs?",
          options: ["Avoid context", "Provide audience, tone, and examples", "Use generic defaults", "Skip constraints"],
          answerIndex: 1,
        },
        {
          question: "How do you design effective constraints?",
          options: ["No constraints", "Specify format, length, style, and exclusions", "Only emojis", "Random limits"],
          answerIndex: 1,
        },
        {
          question: "What improves iteration quality?",
          options: ["Never iterate", "Give structured feedback and re-run", "Only rewrite", "Random changes"],
          answerIndex: 1,
        },
        {
          question: "How can AI help weekly reviews?",
          options: ["Ignore insights", "Surface key takeaways and action items", "Only list links", "Delete notes"],
          answerIndex: 1,
        },
        {
          question: "Best way to avoid hallucinations in summaries?",
          options: ["No citations", "Request sources and compare across items", "Trust blindly", "Skip review"],
          answerIndex: 1,
        },
        {
          question: "What keeps knowledge retrievable?",
          options: ["No tags", "Consistent tagging and short abstracts", "Only full text", "Random labels"],
          answerIndex: 1,
        },
      ],
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