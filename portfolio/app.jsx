/* Safi portfolio — app. Loaded as Babel JSX. */
const { useState, useMemo, useRef, useEffect } = React;
const DATA = window.PORTFOLIO;

/* ---------------- search ---------------- */
function scoreEntry(entry, q) {
  const terms = q.toLowerCase().split(/[^a-z0-9àâäéèêëïîôùûüç→]+/i).filter(t => t.length > 1);
  if (!terms.length) return 0;
  const hay = (entry.q + " " + entry.keywords + " " + entry.teaser).toLowerCase();
  let score = 0;
  for (const t of terms) {
    if (entry.q.toLowerCase().includes(t)) score += 4;
    if (hay.includes(t)) score += 2;
    // soft prefix match
    if (hay.split(/\s+/).some(w => w.startsWith(t))) score += 1;
  }
  return score;
}
function search(q) {
  return DATA.ENTRIES
    .map(e => ({ e, s: scoreEntry(e, q) }))
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map(x => x.e);
}

/* ---------------- body renderer ---------------- */
function Body({ blocks }) {
  return (
    <div className="answer-body">
      {blocks.map((b, i) => {
        if (b.p) return <p key={i}>{b.p}</p>;
        if (b.steps) return (
          <ul className="step-list" key={i}>
            {b.steps.map((s, j) => <li key={j}><span className="step-num">{j + 1}</span><span>{s}</span></li>)}
          </ul>
        );
        if (b.tags) return (
          <div className="tag-row" key={i}>
            {b.tags.map((t, j) => <span className="tag" key={j}>{t}</span>)}
          </div>
        );
        if (b.projects) return (
          <div className="proj-list" key={i}>
            {b.projects.map((p, j) => (
              <div className="proj-item" key={j}>
                <div className="proj-head">
                  <span className="proj-name">{p.name}</span>
                  <span className="proj-org">{p.org}</span>
                </div>
                <p className="proj-note">{p.note}</p>
              </div>
            ))}
          </div>
        );
        return null;
      })}
    </div>
  );
}

/* ---------------- answer panel ---------------- */
function AnswerPanel({ entry, onPick, onClose }) {
  const related = (entry.related || []).map(id => DATA.ENTRIES.find(e => e.id === id)).filter(Boolean);
  return (
    <div className="answer" key={entry.id}>
      <div className="answer-top">
        <button className="back-btn" onClick={onClose}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>
          <span>All questions</span>
        </button>
        <span className="answer-kind">{entry.kind === "section" ? "Topic" : "Answer"}</span>
      </div>
      <h2 className="answer-q">{entry.q}</h2>
      <Body blocks={entry.body} />
      {related.length > 0 && (
        <div className="related">
          <div className="related-label">Keep going</div>
          <div className="related-row">
            {related.map(r => (
              <button className="related-chip" key={r.id} onClick={() => onPick(r.id)}>
                {r.q}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- conversation view (single Q&A exchange) ---------------- */
function Conversation({ userMsg, entry, thinking, onBackTopics, onAnother }) {
  return (
    <div className="chat" key={entry.id}>
      <div className="chat-thread">
        <div className="msg msg-user">
          <div className="msg-bubble user">{userMsg}</div>
        </div>
        {thinking ? (
          <div className="msg msg-assistant">
            <div className="msg-avatar" aria-hidden="true">S</div>
            <div className="msg-bubble assistant typing" aria-label="Safira is typing">
              <span className="dot"></span><span className="dot"></span><span className="dot"></span>
            </div>
          </div>
        ) : (
          <div className="msg msg-assistant reveal">
            <div className="msg-avatar" aria-hidden="true">S</div>
            <div className="msg-bubble assistant">
              <Body blocks={entry.body} />
            </div>
          </div>
        )}
      </div>
      {!thinking && (
        <div className="chat-foot reveal">
          <form className="searchbar locked" onSubmit={(e) => e.preventDefault()}>
            <input
              className="search-input"
              placeholder="Conversation complete — choose another question"
              disabled
              readOnly
              value=""
            />
            <button type="button" className="search-go" aria-label="Send" disabled>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
            </button>
          </form>
          <button className="back-link" onClick={onBackTopics}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>
            Back to topics
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------------- search results ---------------- */
function Results({ query, results, onPick }) {
  if (!results.length) return (
    <div className="noresult">
      <p className="noresult-q">No saved answer for <em>"{query}"</em> — yet.</p>
      <p className="noresult-sub">I write these by hand. Try a topic below, or just email me the question.</p>
      <a className="noresult-mail" href="mailto:safirachavezw@gmail.com">safirachavezw@gmail.com</a>
    </div>
  );
  return (
    <div className="results">
      <div className="results-label">{results.length} {results.length === 1 ? "match" : "matches"}</div>
      {results.map(r => (
        <button className="result-row" key={r.id} onClick={() => onPick(r.id)}>
          <div className="result-text">
            <span className="result-q">{r.q}</span>
            <span className="result-teaser">{r.teaser}</span>
          </div>
          <svg className="result-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </button>
      ))}
    </div>
  );
}

/* ---------------- hero wave (decorative gradient ribbon) ---------------- */
function HeroWave() {
  return (
    <div className="wave-wrap" aria-hidden="true">
      <svg className="wave-svg" viewBox="0 0 1600 340" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="wgA" x1="0" y1="0" x2="1600" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#f4b347"/>
            <stop offset="0.24" stopColor="#f7d79a"/>
            <stop offset="0.44" stopColor="#eef0ee"/>
            <stop offset="0.6" stopColor="#9bbef0"/>
            <stop offset="0.78" stopColor="#6aa3ee"/>
            <stop offset="1" stopColor="#f3b24a"/>
          </linearGradient>
          <linearGradient id="wgB" x1="0" y1="0" x2="1600" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#f0b85a"/>
            <stop offset="0.4" stopColor="#5cae7e"/>
            <stop offset="0.7" stopColor="#7fb0ef"/>
            <stop offset="1" stopColor="#f6c25a"/>
          </linearGradient>
          <filter id="wblurA" x="-10%" y="-60%" width="120%" height="220%"><feGaussianBlur stdDeviation="9"/></filter>
          <filter id="wblurB" x="-10%" y="-60%" width="120%" height="220%"><feGaussianBlur stdDeviation="15"/></filter>
        </defs>
        <path d="M-120 240 C 280 80 560 80 820 210 S 1340 350 1760 200" fill="none" stroke="url(#wgB)" strokeWidth="58" strokeLinecap="round" opacity="0.55" filter="url(#wblurB)"/>
        <path d="M-120 200 C 300 60 580 60 840 195 S 1350 330 1760 180" fill="none" stroke="url(#wgA)" strokeWidth="74" strokeLinecap="round" opacity="0.92" filter="url(#wblurA)"/>
        <path d="M-120 198 C 300 80 560 80 830 188 S 1340 300 1760 172" fill="none" stroke="#ffffff" strokeWidth="9" strokeLinecap="round" opacity="0.5" filter="url(#wblurA)"/>
      </svg>
    </div>
  );
}

/* ---------------- main app ---------------- */
const THEMES = [
  { id: "minimal", label: "Minimal" },
  { id: "editorial", label: "Editorial" },
  { id: "techy", label: "Techy" }
];
const ACCENTS = ["#1f8a5b", "#2a6fdb", "#e5532f", "#7a5ae0", "#111111"];

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "editorial",
  "accent": "#1f8a5b",
  "headline": "Query My Career"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");   // committed search string
  const [active, setActive] = useState(null);       // active entry id (drives conversation)
  const [openTopic, setOpenTopic] = useState(null); // expanded category index
  const [userMsg, setUserMsg] = useState("");       // exact text the visitor submitted
  const [thinking, setThinking] = useState(false);  // assistant "typing" phase
  const inputRef = useRef(null);
  const answerRef = useRef(null);
  const pendingTarget = useRef(null);               // {text,id} seeded from a prompt
  const thinkTimer = useRef(null);

  // lock to editorial theme; accent stays tweakable
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", "editorial");
    root.style.setProperty("--accent", t.accent || "#1f8a5b");
  }, [t.accent]);

  const questions = DATA.ENTRIES.filter(e => e.kind === "question");
  const sections = DATA.ENTRIES.filter(e => e.kind === "section");
  // conversation themes — each opens a small set of curated questions
  const TOPICS = [
    { label: "About Me", questions: [
      { q: "Tell me about your journey into product management.", id: "trajectory" },
      { q: "How did an economist end up leading AI products?", id: "start-with-product" }
    ]},
    { label: "How I Think", questions: [
      { q: "What product principles guide your decisions?", id: "how-i-think" },
      { q: "How do you make decisions with incomplete information?", id: "decisions-incomplete" }
    ]},
    { label: "How I Lead", questions: [
      { q: "How do you lead cross-functional teams?", id: "cross-functional" },
      { q: "What is your leadership philosophy?", id: "leadership" }
    ]},
    { label: "Impact", questions: [
      { q: "What work are you most proud of?", id: "proudest" },
      { q: "Which project best represents your impact?", id: "what-built" }
    ]},
    { label: "Product Expertise", questions: [
      { q: "What types of products have you specialized in building?", id: "product-expertise" },
      { q: "How do you approach product strategy and prioritization?", id: "product-expertise" }
    ]},
    { label: "AI Expertise", questions: [
      { q: "How do you approach building AI-powered products?", id: "ai-build-approach" },
      { q: "What future of AI are you betting on?", id: "future-of-ai" }
    ]}
  ];

  const results = useMemo(() => submitted ? search(submitted) : [], [submitted]);
  const activeEntry = active ? DATA.ENTRIES.find(e => e.id === active) : null;

  // open a conversation: show the user's message, a brief "typing" beat, then the answer
  const pick = (id, userText) => {
    const entry = DATA.ENTRIES.find(e => e.id === id);
    setActive(id);
    setUserMsg((userText || (entry ? entry.q : "")).trim());
    setSubmitted("");
    setQuery("");
    setOpenTopic(null);
    pendingTarget.current = null;
    setThinking(true);
    if (thinkTimer.current) clearTimeout(thinkTimer.current);
    thinkTimer.current = setTimeout(() => setThinking(false), 750);
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  // seed the chat input from a suggested question — focus, caret to end, highlight pulse, no auto-send
  const seedInput = (text, targetId) => {
    setActive(null);
    setSubmitted("");
    setQuery(text);
    pendingTarget.current = targetId ? { text, id: targetId } : null;
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      window.scrollTo({ top: 0, behavior: "smooth" });
      el.focus({ preventScroll: true });
      const len = text.length;
      try { el.setSelectionRange(len, len); } catch (e) {}
      const bar = el.closest(".searchbar");
      [el, bar].forEach(node => {
        if (!node) return;
        node.classList.remove("seeded");
        void node.offsetWidth;            // restart animation
        node.classList.add("seeded");
        setTimeout(() => node.classList.remove("seeded"), 650);
      });
    });
  };

  const runSearch = (q) => {
    if (showingAnswer) return;                        // conversation is single-exchange; input is locked
    const v = (q ?? query).trim();
    if (!v) return;
    // seeded prompt submitted unchanged → open its intended answer
    if (pendingTarget.current && v === pendingTarget.current.text) { pick(pendingTarget.current.id, v); return; }
    // exact question text → open that answer directly
    const exact = DATA.ENTRIES.find(e => e.q.toLowerCase() === v.toLowerCase());
    if (exact) { pick(exact.id, v); return; }
    setActive(null);
    setSubmitted(v);
    const hits = search(v);
    if (hits.length === 1) { pick(hits[0].id, v); }
    else { requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" })); }
  };
  const clearAll = () => {
    if (thinkTimer.current) clearTimeout(thinkTimer.current);
    setActive(null); setSubmitted(""); setQuery(""); setOpenTopic(null);
    setUserMsg(""); setThinking(false);
    pendingTarget.current = null;
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  };
  // reset, then drop focus into the input so the visitor can ask freely
  const exploreAnother = () => {
    clearAll();
    requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
  };

  const showingAnswer = !!activeEntry;
  const showingResults = !!submitted && !activeEntry;
  const showingHome = !showingAnswer && !showingResults;

  return (
    <div className="page">
      {/* top bar */}
      <header className="topbar">
        <button className="brand" onClick={clearAll}>
          <span className="brand-dot" />
          <span className="brand-name">Safira</span>
          <span className="brand-sub">/ product</span>
        </button>
      </header>

      {/* hero */}
      <section className={"hero" + (showingHome ? "" : " compact")} hidden={showingAnswer}>
        <div className="eyebrow">Product leader · AI builder · conversational systems</div>
        <h1 className="headline">{t.headline || "Query My Career"}</h1>
        <p className="subhead">Real answers about how I think, what I've shipped, and the AI I'm betting on.</p>

        {!showingAnswer && (
          <form className="searchbar" onSubmit={(e) => { e.preventDefault(); runSearch(); }}>
            <input
              ref={inputRef}
              className="search-input"
              placeholder="Ask me anything…"
              value={query}
              autoComplete="off"
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && <button type="button" className="search-clear" aria-label="Clear" onClick={() => { setQuery(""); inputRef.current?.focus(); }}>×</button>}
            <button type="submit" className="search-go" aria-label="Ask" disabled={!query.trim()}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
            </button>
          </form>
        )}

        <div className="chips" role="tablist" aria-label="Conversation topics" hidden={showingAnswer}>
          {TOPICS.map((topic, i) => (
            <button
              key={topic.label}
              role="tab"
              aria-selected={openTopic === i}
              aria-expanded={openTopic === i}
              className={"chip" + (openTopic === i ? " active" : "")}
              onClick={() => setOpenTopic(openTopic === i ? null : i)}
            >
              {topic.label}
            </button>
          ))}
        </div>

        <div className={"topic-panel-wrap" + (openTopic !== null && !showingAnswer ? " open" : "")}>
          <div className="topic-panel">
            {openTopic !== null && (
              <div className="topic-panel-inner" key={openTopic}>
                <div className="topic-panel-head">
                  <span className="topic-panel-label">{TOPICS[openTopic].label} — pick a question to start</span>
                </div>
                <div className="prompt-row">
                  {TOPICS[openTopic].questions.map((qq, j) => (
                    <button className="prompt-card" key={j} onClick={() => seedInput(qq.q, qq.id)} aria-label={"Ask: " + qq.q}>
                      <span className="prompt-text">{qq.q}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {showingHome && <div className="hero-spacer" aria-hidden="true"></div>}

      {/* dynamic region */}
      <main className="content" ref={answerRef}>
        {showingAnswer && (
          <Conversation
            userMsg={userMsg}
            entry={activeEntry}
            thinking={thinking}
            onBackTopics={clearAll}
            onAnother={exploreAnother}
          />
        )}
        {showingResults && (
          <Results query={submitted} results={results} onPick={pick} />
        )}
        {showingHome && (
          <section className="block">
            <div className="block-head">
              <span className="block-label">Frequently asked</span>
              <span className="block-hint">Or just tap a question to start</span>
            </div>
            <div className="card-grid">
              {questions.map(q => (
                <button className="qcard" key={q.id} onClick={() => seedInput(q.q, q.id)} aria-label={"Ask: " + q.q}>
                  <div className="qcard-q">{q.q}</div>
                  <div className="qcard-teaser">{q.teaser}</div>
                </button>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* footer / contact */}
      <footer className="foot">
        <div className="foot-cta">
          <div className="foot-lead">Still curious?</div>
          <h3 className="foot-head">Let's Connect</h3>
          <p className="foot-sub">There's always more to the story than a few questions.</p>
          <div className="foot-actions">
            <a className="foot-btn" href="mailto:safirachavezw@gmail.com">safirachavezw@gmail.com</a>
            <a className="foot-btn" href="https://www.linkedin.com/in/ana-safira-chavez/" target="_blank" rel="noopener">LinkedIn ↗</a>
          </div>
        </div>
      </footer>

      {/* tweaks */}
      <TweaksPanel>
        <TweakSection label="Look" />
        <TweakColor label="Accent" value={t.accent} options={ACCENTS} onChange={(v) => setTweak("accent", v)} />
        <TweakSection label="Hero" />
        <TweakText label="Headline" value={t.headline} onChange={(v) => setTweak("headline", v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
