/* Safi — portfolio knowledge base. Plain JS, attaches to window. */
(function () {
  // Each entry is something the visitor can "ask" or click into.
  // kind: "question" (shows in quick-links) or "section" (shows in Categories)
  // keywords drive the fuzzy search.
  const ENTRIES = [
    {
      id: "trajectory",
      kind: "question",
      q: "Tell me about your trajectory",
      teaser: "Economist who fell for product.",
      keywords: "trajectory career path story background journey history economics economist how got here resume cv overview",
      body: [
        { p: "Honestly? I started as an economist and never planned on this. A bachelor's at the Toulouse School of Economics, then a master's split between Pompeu Fabra and Toulouse. I thought I was headed for policy or research." },
        { p: "Instead I fell hard for the messy, human side of building things. Oxfam handed me a digital innovation program across Latin America, and watching real people use something we'd built — and change because of it — flipped a switch. From there: helped launch a fintech startup, spent six years at Glovo turning support into an actual product, and now I lead AI and operations products at Deel." },
        { p: "The throughline across all of it: give me something ambiguous and let me turn it into a system that ships." },
        { steps: ["Oxfam Intermón — digital innovation", "Brickbro — fintech 0→1", "Glovo — support as a product", "Deel — AI & operations"] }
      ],
      related: ["start-with-product", "proudest", "leading-eng-ds"]
    },
    {
      id: "start-with-product",
      kind: "question",
      q: "How did you start with product?",
      teaser: "Sideways — through Oxfam's Eureka project.",
      keywords: "start begin product management first job entry pivot transition economics oxfam eureka human centered design how did you get into",
      body: [
        { p: "Sideways, honestly. I was trained as an economist, but at Oxfam Intermón I led the Eureka project — building real digital tools with human-centered design. A personal-safety app in Nicaragua, a civic-reporting website in Bolivia." },
        { p: "Seeing people actually use those tools, and make different decisions because they existed, was the moment product clicked for me. The economics gave me the rigor; product gave me the people. I never looked back." }
      ],
      related: ["trajectory", "what-built", "how-i-think"]
    },
    {
      id: "proudest",
      kind: "question",
      q: "What work are you most proud of?",
      teaser: "An eval framework you can trust — and a €1.57M launch.",
      keywords: "proud proudest best work achievement accomplishment highlight favorite impact deel eval evaluation brickbro crowdfunding revenue",
      body: [
        { p: "Two things, and I love that they're opposite ends of the spectrum." },
        { p: "First — building Deel AI's production evaluation framework. We evolved it from CSAT plus human QA into a multi-layered system combining LLM-as-Judge with Human-in-the-Loop, so we could genuinely trust what our agents were shipping. That's the unglamorous work that makes AI products real." },
        { p: "Second — launching Brickbro's proptech crowdfunding platform, which generated €1.57M in its first six months. One is deeply technical, one is pure go-to-market. Being fluent in both is the whole point of me." }
      ],
      related: ["future-of-ai", "what-built", "ai-expertise"]
    },
    {
      id: "cross-functional",
      kind: "question",
      q: "How do you lead cross-functional teams?",
      teaser: "Clarity, shared vision, then get out of the way.",
      keywords: "lead leadership cross functional teams collaboration manage stakeholders alignment vision languages communication",
      body: [
        { p: "I unite people around a shared vision and then get out of the way. I'm obsessive about three questions: what are we building, why now, and how will we know it worked. Answer those well and most coordination problems dissolve." },
        { p: "I speak four languages fluently — English, Spanish, Portuguese, French — and I think that's quietly shaped how I lead. I'm comfortable translating between worlds: engineering and design, data science and support, the boardroom and the front line." }
      ],
      related: ["leading-eng-ds", "leadership", "how-i-think"]
    },
    {
      id: "leading-eng-ds",
      kind: "question",
      q: "How was the shift to leading software & data science teams?",
      teaser: "It stretched me — in the best way.",
      keywords: "software engineering data science teams technical shift change manage engineers scientists deel opsconnect eval handle rates systems",
      body: [
        { p: "It stretched me, in the best way. At Deel I lead the OpsConnect and Deel AI teams, which means partnering deeply with engineers and data scientists — not just handing them specs." },
        { p: "I had to get genuinely fluent in eval stacks, handle rates, and the systems behind agentic products. The lesson was humility: ask better questions, respect the craft, and make decisions with the team rather than for them. My job is to remove ambiguity, not to pretend I'm the smartest person in the room." }
      ],
      related: ["ai-expertise", "leadership", "future-of-ai"]
    },
    {
      id: "future-of-ai",
      kind: "question",
      q: "What future of AI are you betting on?",
      teaser: "Agentic systems that actually ship.",
      keywords: "future ai bet betting agentic agents systems ship production eval evaluation trust handle rates llm guardrails vision",
      body: [
        { p: "Agentic systems that actually ship. There's a lot of demo-ware out there — I'm betting on the unglamorous layer underneath: evaluation, handle rates, guardrails, and the production systems that make agents trustworthy enough to put in front of real users." },
        { p: "The teams that win won't have the flashiest model. They'll have the tightest feedback loop between what their agents do in the wild and how fast they improve." }
      ],
      related: ["whats-next-ai", "challenge-excited", "ai-expertise"]
    },
    {
      id: "challenge-excited",
      kind: "question",
      q: "What challenge are you excited to tackle?",
      teaser: "Closing the trust gap in AI products.",
      keywords: "challenge excited next problem solve future ambition goal trust gap reliability scale ai products",
      body: [
        { p: "Closing the trust gap in AI. We can already build agents that look brilliant in a demo. The hard, genuinely interesting problem is making them reliable, measurable, and actually helpful at scale." },
        { p: "I want to keep building the eval and system layers that let a team ship AI they'd stake their name on. That's the work I'd happily do for the next ten years." }
      ],
      related: ["future-of-ai", "whats-next-ai", "proudest"]
    },

    /* ---------- Sections / Categories ---------- */
    {
      id: "decisions-incomplete",
      kind: "question",
      q: "How do you make decisions with incomplete information?",
      teaser: "Size the bet, then act.",
      keywords: "decisions incomplete information uncertainty ambiguity judgment risk reversible bets data gut prioritize how do you decide",
      body: [
        { p: "First I ask how reversible the decision is. If it's a one-way door — something expensive to undo — I slow down and gather more signal. If it's reversible, I'd rather ship a thin version this week and learn from reality than spend a month theorizing. Most decisions are more reversible than they feel." },
        { p: "When the data isn't there, I make my assumptions explicit and design the smallest test that would prove me wrong. I'd rather be clearly wrong fast than vaguely right slowly. And I say the uncertainty out loud — a team that knows what we don't know makes far better calls than one pretending to certainty." }
      ],
      related: ["how-i-think", "cross-functional", "proudest"]
    },
    {
      id: "ai-build-approach",
      kind: "question",
      q: "How do you approach building AI-powered products?",
      teaser: "Start from the eval, not the demo.",
      keywords: "approach building ai powered products method process eval evaluation demo handle rate human in the loop ship slice agents how do you build",
      body: [
        { p: "I start from the evaluation, not the demo. Before we build much, I want to know how we'll measure whether the thing is actually good — golden sets, LLM-as-Judge, a human review loop. If you can't define success, you're not building a product, you're building a slot machine." },
        { p: "Then I ship the thinnest slice that touches a real user, keep a human in the loop while the system earns trust, and watch the handle rate climb as we tighten the feedback loop. The magic isn't the model — it's how fast you can see what it did in the wild and improve it." }
      ],
      related: ["ai-expertise", "future-of-ai", "proudest"]
    },
    {
      id: "about",
      kind: "section",
      q: "About me",
      teaser: "Tech, people, purpose — in four languages.",
      keywords: "about me who are you bio personal intro languages curiosity purpose values",
      body: [
        { p: "I'm motivated by the intersection of technology, people, and purpose. I'm at my best uniting teams around a shared vision, driving innovation, and delivering measurable impact — guided by curiosity and a stubborn commitment to making a positive difference." },
        { p: "Right now that looks like building AI agents that actually ship: handle rates, eval stacks, and the systems behind them. Off the clock — four fluent languages, teams across three continents, and one very full passport." },
        { tags: ["English", "Spanish", "Portuguese", "Français"] }
      ],
      related: ["how-i-think", "trajectory", "leadership"]
    },
    {
      id: "how-i-think",
      kind: "section",
      q: "How I think",
      teaser: "Five principles I keep coming back to.",
      keywords: "how i think principles philosophy approach mindset beliefs values method",
      body: [
        { p: "A handful of principles I keep coming back to:" },
        { steps: [
          "Start from the human, not the feature.",
          "Ambiguity is just a system that hasn't been designed yet.",
          "If you can't measure it, you can't trust it — doubly true for AI.",
          "Clarity is a kindness. Say the hard thing early.",
          "The feedback loop is the product. Ship, learn, repeat."
        ] }
      ],
      related: ["about", "cross-functional", "future-of-ai"]
    },
    {
      id: "what-built",
      kind: "section",
      q: "What I've built",
      teaser: "From €1.57M launches to production eval stacks.",
      keywords: "what built products projects shipped portfolio work opsconnect deel inbox glovo brickbro oxfam eureka",
      body: [
        { p: "A spread of products across support, fintech, and AI:" },
        { projects: [
          { name: "OpsConnect", org: "Deel", note: "Built from scratch — proactive issue tracking, AI-powered support, and client-insights dashboards that cut manual work and sped up response times." },
          { name: "Deel Inbox", org: "Deel", note: "Launched Deel's first Inbox experience." },
          { name: "Deel AI eval framework", org: "Deel", note: "Production evaluation system combining LLM-as-Judge with Human-in-the-Loop." },
          { name: "Glovo support platform", org: "Glovo", note: "AI chatbots, predictive analytics, and 10+ automated features — plus tools for refunds, cancellations, and hyper-personalized support." },
          { name: "Brickbro crowdfunding", org: "Brickbro", note: "Proptech crowdfunding platform — €1.57M raised within 6 months of launch." },
          { name: "Eureka", org: "Oxfam Intermón", note: "Human-centered digital tools — a safety app in Nicaragua and a civic-reporting site in Bolivia." }
        ] }
      ],
      related: ["proudest", "product-expertise", "ai-expertise"]
    },
    {
      id: "product-expertise",
      kind: "section",
      q: "Product expertise",
      teaser: "Strategy, 0→1, and support-as-a-product.",
      keywords: "product expertise skills strategy discovery experimentation growth 0 to 1 marketplace fintech",
      body: [
        { p: "Where I'm strongest as a product leader:" },
        { tags: ["Product Strategy", "0→1 & Discovery", "Experimentation", "Support-as-a-product", "Fintech & Marketplace", "Cross-functional Leadership"] },
        { p: "I've spent most of my career taking a fuzzy mandate — \"make support better,\" \"launch this market\" — and turning it into a roadmap, a team, and a shipped product with numbers behind it." }
      ],
      related: ["what-built", "ai-expertise", "leadership"]
    },
    {
      id: "ai-expertise",
      kind: "section",
      q: "AI expertise",
      teaser: "Agents, evals, RAG, and the systems behind them.",
      keywords: "ai expertise machine learning agentic conversational llm evaluation prompt engineering rag retrieval augmented generation skills",
      body: [
        { p: "The AI work is where I spend most of my energy now — specifically the parts that make agents shippable:" },
        { tags: ["Agentic Systems", "Conversational AI", "LLM Evaluation", "LLM-as-Judge", "Human-in-the-Loop", "Prompt Engineering", "RAG"] },
        { p: "My bias is toward the system layer: evaluation, handle rates, and the guardrails that turn an impressive demo into something you can actually run in production." }
      ],
      related: ["future-of-ai", "proudest", "leading-eng-ds"]
    },
    {
      id: "leadership",
      kind: "section",
      q: "Leadership",
      teaser: "Leading across support, software & data science.",
      keywords: "leadership leading teams manage people management style mentor culture deel glovo",
      body: [
        { p: "I've led teams across support, software, and data science — most recently the OpsConnect and Deel AI teams at Deel. I lead with clarity and trust: a vision people can repeat without me in the room, and enough room for them to own the how." },
        { p: "Having shipped both fintech and AI, I can sit credibly with engineers and data scientists and still keep the business honest about outcomes. I think that combination is rarer than it should be." }
      ],
      related: ["cross-functional", "leading-eng-ds", "about"]
    },
    {
      id: "whats-next-ai",
      kind: "section",
      q: "What's next for AI",
      teaser: "A bet on the boring, decisive middle layer.",
      keywords: "whats next future ai opinion essay take thesis vision industry prediction trends agents evaluation",
      body: [
        { p: "Everyone's staring at the models. I'm watching the layer just underneath — the part nobody screenshots." },
        { p: "We've crossed the line where a capable agent is hard to build. The frontier now isn't capability, it's trust: can you prove the thing does what you claim, consistently, for real users, at scale? That's an evaluation problem, an operations problem, and a product problem all at once — and it's wildly underbuilt." },
        { p: "My bet: the next wave of category winners won't be defined by which model they wrap. They'll be defined by the speed of their feedback loop — how quickly they can see what their agents do in the wild, judge it, and close the gap. LLM-as-Judge, Human-in-the-Loop, handle rates, golden sets: the unsexy scaffolding becomes the moat." },
        { p: "The other shift I'm betting on is ambient, multilingual, conversational interfaces becoming the default surface for software. Not a chatbot bolted onto a product — the product itself, spoken to in whatever language you think in. I've shipped enough conversational systems to believe the interface war is only just starting." },
        { p: "So: less time arguing about which model is smartest, more time building the systems that let us trust them. That's the work I want to be in the middle of." }
      ],
      related: ["future-of-ai", "challenge-excited", "ai-expertise"]
    }
  ];

  const EXPERIENCE = [
    { role: "Senior Product Manager", org: "Deel", place: "Remote", dates: "2024 – Present", note: "Lead the OpsConnect & Deel AI teams. Built OpsConnect from scratch and launched the first Deel Inbox. Built Deel AI's production eval framework (LLM-as-Judge + Human-in-the-Loop)." },
    { role: "Principal Product Manager", org: "Glovo", place: "Barcelona", dates: "2018 – 2024", note: "Early member of the Contact team. Built support-agent tooling, AI chatbots, predictive analytics, and 10+ automated features for refunds, cancellations, and personalized support." },
    { role: "Product Manager — Startup Launch", org: "Brickbro", place: "Barcelona", dates: "2018 – 2019", note: "Launched a proptech crowdfunding platform that raised €1.57M within 6 months." },
    { role: "Digital Innovation Program Manager", org: "Oxfam Intermón", place: "Barcelona", dates: "2017 – 2018", note: "Led the Eureka project — a safety app in Nicaragua and a civic-reporting site in Bolivia, via human-centered design." }
  ];

  const EDUCATION = [
    { degree: "Product Management", school: "Stanford University", dates: "2020 – 2021" },
    { degree: "MSc, Applied Economics", school: "Pompeu Fabra × Toulouse School of Economics", dates: "2015 – 2016" },
    { degree: "BSc, Economics", school: "Toulouse School of Economics", dates: "2011 – 2015" }
  ];

  const REFERENCES = [
    { name: "Naghmeh Hayamanesh", role: "Product Director, Glovo" },
    { name: "Nir Smadar", role: "Product Director, Deel" }
  ];

  window.PORTFOLIO = { ENTRIES, EXPERIENCE, EDUCATION, REFERENCES };
})();
