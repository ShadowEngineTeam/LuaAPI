/* Main app: routing, page rendering, scroll-spy TOC, navigation events */

const { useState, useEffect, useRef, useMemo } = React;

/* ---------- Specialty section renderers ---------- */
const EASINGS = [
  ["linear"],
  ["sineIn", "sineOut", "sineInOut"],
  ["quadIn", "quadOut", "quadInOut"],
  ["cubeIn", "cubeOut", "cubeInOut"],
  ["quartIn", "quartOut", "quartInOut"],
  ["quintIn", "quintOut", "quintInOut"],
  ["expoIn", "expoOut", "expoInOut"],
  ["backIn", "backOut", "backInOut"],
  ["bounceIn", "bounceOut", "bounceInOut"],
  ["elasticIn", "elasticOut", "elasticInOut"],
  ["circIn", "circOut", "circInOut"],
];

function EasingsSection() {
  const [hover, setHover] = useState(null);
  return (
    <div>
      <h2 id="list">Available easings</h2>
      <p>Unknown names fall back to <code>linear</code>. Click an easing to preview its curve.</p>
      <table className="tbl">
        <thead>
          <tr><th>Family</th><th>In</th><th>Out</th><th>InOut</th></tr>
        </thead>
        <tbody>
          {EASINGS.map((row, i) => {
            const family = row[0].replace(/(In|Out|InOut)$/,"") || "linear";
            return (
              <tr key={i}>
                <td>{family}</td>
                {[0, 1, 2].map(idx => {
                  const name = row[idx];
                  if (!name) return <td key={idx}></td>;
                  return (
                    <td key={idx}
                      onMouseEnter={() => setHover(name)}
                      onMouseLeave={() => setHover(null)}
                      style={{
                        cursor: "default",
                        color: hover === name ? "var(--violet-strong)" : "var(--violet)",
                        background: hover === name ? "var(--violet-soft)" : "transparent",
                        transition: "background 0.12s",
                      }}
                    >
                      {name}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <CodeBlock lang="lua" filename="usage.lua" source={`startTween('flourish', 'logo',
    { angle = 360, alpha = 0.5 },
    2.0,
    { ease = '${hover || "elasticOut"}' })`} />
    </div>
  );
}

function ColorsSection() {
  const samples = [
    { label: "Raw hex (RGB)", form: "'FF6699'", hex: "#FF6699" },
    { label: "Prefixed 0x", form: "'0xFFFF6699'", hex: "#FF6699" },
    { label: "Prefixed #", form: "'#FF6699'", hex: "#FF6699" },
  ];
  const palette = [
    { hex: "#A78BFA", form: "'A78BFA'", label: "violet" },
    { hex: "#FACC15", form: "'FACC15'", label: "yellow" },
    { hex: "#4EC9B0", form: "'4EC9B0'", label: "teal" },
    { hex: "#FF6699", form: "'FF6699'", label: "pink" },
    { hex: "#00FFAA", form: "'00FFAA'", label: "mint" },
  ];
  return (
    <div>
      <h2 id="forms">Equivalent forms</h2>
      <table className="tbl">
        <thead><tr><th>Form</th><th>Example</th></tr></thead>
        <tbody>
          <tr><td>Raw hex (RGB)</td><td><code>'FF6699'</code> — alpha forced to <code>FF</code></td></tr>
          <tr><td>Prefixed 0x</td><td><code>'0xFFFF6699'</code></td></tr>
          <tr><td>Prefixed #</td><td><code>'#FF6699'</code></td></tr>
        </tbody>
      </table>

      <h2 id="palette">Sample palette</h2>
      <p>A few colours that look good against the engine's default dark background.</p>
      <div className="demo-row">
        {palette.map((p, i) => (
          <div className="swatch" key={i}>
            <div className="swatch-chip" style={{ background: p.hex }}></div>
            <span className="swatch-hex">{p.hex}</span>
            <span className="swatch-form">{p.form}</span>
          </div>
        ))}
      </div>

      <h2 id="usage">Usage</h2>
      <CodeBlock lang="lua" source={`makeLuaSprite('box')
makeGraphic('box', 120, 80, 'A78BFA')
addLuaSprite('box')
doTweenColor('boxRecolor', 'box', '#FACC15', 1.5, 'sineInOut')`} />
    </div>
  );
}

function FAQSection({ items }) {
  const [open, setOpen] = useState(() => new Set([0]));
  return (
    <div>
      {items.map((it, i) => (
        <div key={i} className={`faq-item ${open.has(i) ? "open" : ""}`}>
          <button className="faq-q" onClick={() => {
            setOpen(prev => {
              const n = new Set(prev);
              n.has(i) ? n.delete(i) : n.add(i);
              return n;
            });
          }}>
            {it.q}
            <Icon name="chev-r" size={14} />
          </button>
          <div className="faq-a" dangerouslySetInnerHTML={{ __html: it.a }} />
        </div>
      ))}
    </div>
  );
}

function FeaturesGrid({ items }) {
  return (
    <div className="feat-grid">
      {items.map((f, i) => (
        <div className="feat" key={i}>
          <div className="feat-ico"><Icon name={f.ico} size={18} /></div>
          <h3>{f.title}</h3>
          <p>{f.body}</p>
        </div>
      ))}
    </div>
  );
}

/* ---------- Hero (Introduction only) ---------- */
function Hero() {
  return (
    <div className="hero page-fade">
      <div className="hero-eyebrow">DOCS</div>
      <h1>The <span className="accent">Lua scripting</span> reference for Shadow Engine.</h1>
      <p className="lede">A complete guide to every function exposed to <code>.lua</code> scripts — sprites, tweens, callbacks, reflection, shaders, and cross-script messaging. Built for daily reference, optimised for long reading.</p>
      <div className="hero-actions">
        <button className="btn primary" onClick={() => window.dispatchEvent(new CustomEvent("goto", { detail: "getting-started" }))}>
          Get started
          <Icon name="chev-r" size={14} />
        </button>
      </div>
    </div>
  );
}

/* ---------- Page renderer ---------- */
function PageRenderer({ pageId }) {
  const page = window.PAGES[pageId];
  if (!page) return <div>Page not found</div>;

  return (
    <article className="content page-fade" key={pageId}>
      <div className="breadcrumb">
        <span>{page.category}</span>
        <span className="sep">›</span>
        <span className="crumb-cur">{page.title}</span>
      </div>
      {page.hero && <Hero />}
      {!page.hero && <h1>{page.title}</h1>}
      {page.subtitle && <p className="lede" dangerouslySetInnerHTML={{ __html: page.subtitle }} />}

      {(page.sections || []).map((s) => {
        if (s.kind === "api") return <APIEntry key={s.id} s={s} />;
        if (s.kind === "features") return <FeaturesGrid key={s.id} items={s.items} />;
        if (s.kind === "easings") return <EasingsSection key={s.id} />;
        if (s.kind === "colors") return <ColorsSection key={s.id} />;
        if (s.kind === "faq") return <FAQSection key={s.id} items={s.items} />;
        return <ProseSection key={s.id} s={s} />;
      })}

      <Pager pageId={pageId} />
    </article>
  );
}

/* ---------- Pager (prev/next) ---------- */
function flatPageList() {
  const out = [];
  window.NAV.forEach(group => group.items.forEach(it => out.push(it)));
  return out;
}

function Pager({ pageId }) {
  const list = flatPageList();
  const idx = list.findIndex(p => p.id === pageId);
  const prev = idx > 0 ? list[idx - 1] : null;
  const next = idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null;
  return (
    <div className="pager">
      {prev ? (
        <a href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent("goto", { detail: prev.id })); }}>
          <div className="dir">Previous</div>
          <div className="lbl"><Icon name="chev-l" size={14} />{prev.label}</div>
        </a>
      ) : <div />}
      {next ? (
        <a className="next" href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent("goto", { detail: next.id })); }}>
          <div className="dir">Next</div>
          <div className="lbl">{next.label}<Icon name="chev-r" size={14} /></div>
        </a>
      ) : <div />}
    </div>
  );
}

/* ---------- TOC builder ---------- */
function buildTOC(pageId) {
  const page = window.PAGES[pageId];
  if (!page) return [];
  const out = [];
  (page.sections || []).forEach(s => {
    if (s.kind === "api") {
      out.push({ id: s.id, label: s.signature, lvl: 3 });
    } else if (s.kind === "easings") {
      out.push({ id: "list", label: "Available easings", lvl: 2 });
    } else if (s.kind === "colors") {
      out.push({ id: "forms", label: "Equivalent forms", lvl: 2 });
      out.push({ id: "palette", label: "Sample palette", lvl: 2 });
      out.push({ id: "usage", label: "Usage", lvl: 2 });
    } else if (s.kind === "faq") {
      // skip
    } else if (s.kind === "features") {
      // skip
    } else if (s.title) {
      out.push({ id: s.id, label: s.title, lvl: 2 });
    }
  });
  return out;
}

/* ---------- App ---------- */
function App() {
  const [pageId, setPageId] = useState(() => {
    const h = window.location.hash.replace(/^#\/?/, "");
    return window.PAGES[h] ? h : "introduction";
  });
  const [sbOpen, setSbOpen] = useState(false);
  const [activeHeading, setActiveHeading] = useState(null);
  const contentRef = useRef(null);
  const pinUntilRef = useRef(0);

  const headings = useMemo(() => buildTOC(pageId), [pageId]);

  /* navigation event */
  useEffect(() => {
    const handler = (e) => {
      const id = e.detail;
      if (typeof id === "string" && window.PAGES[id]) {
        setPageId(id);
        window.location.hash = `/${id}`;
        window.scrollTo({ top: 0, behavior: "instant" });
      } else if (typeof id === "object" && id.pageId) {
        setPageId(id.pageId);
        window.location.hash = `/${id.pageId}${id.section ? "#" + id.section : ""}`;
        setTimeout(() => {
          if (id.section) {
            const el = document.getElementById(id.section);
            if (el) el.scrollIntoView({ block: "start", behavior: "smooth" });
          } else {
            window.scrollTo({ top: 0 });
          }
        }, 50);
      }
    };
    window.addEventListener("goto", handler);
    return () => window.removeEventListener("goto", handler);
  }, []);

  /* keyboard: Cmd/Ctrl+K — handled by SearchBox itself now. */

  /* scroll-spy for TOC */
  useEffect(() => {
    if (headings.length === 0) return;
    const onScroll = () => {
      // Honour a click-pin: when the user just clicked a TOC link, keep that
      // heading active for a short window so the smooth-scroll doesn't slide
      // past it into the next one.
      if (Date.now() < pinUntilRef.current) return;

      // Reading-line ~120px from the top — sits just under the header.
      // Section is active while its heading is above the line AND the next
      // heading is still below it.
      const line = 140;
      const docH = document.documentElement.scrollHeight;
      if (window.innerHeight + window.scrollY >= docH - 4) {
        setActiveHeading(headings[headings.length - 1].id);
        return;
      }
      let current = headings[0]?.id;
      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= line) current = h.id;
        else break;
      }
      setActiveHeading(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [headings, pageId]);

  /* internal data-go links */
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest("a[data-go]");
      if (!a) return;
      e.preventDefault();
      window.dispatchEvent(new CustomEvent("goto", { detail: a.getAttribute("data-go") }));
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const goSearch = (pid, sid) => {
    if (sid) {
      window.dispatchEvent(new CustomEvent("goto", { detail: { pageId: pid, section: sid } }));
    } else {
      window.dispatchEvent(new CustomEvent("goto", { detail: pid }));
    }
  };
  // (kept for any future consumers; SearchBox is self-contained now)
  void goSearch;

  const jumpToHeading = (id) => {
    const el = document.getElementById(id);
    if (el) {
      // Land the heading 80px below the top so it sits just above the
      // reading-line and is unambiguously the active section.
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      setActiveHeading(id);
      pinUntilRef.current = Date.now() + 900;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="app">
      <Header
        onMenuOpen={() => setSbOpen(true)}
        currentPage={pageId}
      />
      <div className="main">
        <Sidebar
          currentPage={pageId}
          onGo={(id) => window.dispatchEvent(new CustomEvent("goto", { detail: id }))}
          open={sbOpen}
          onClose={() => setSbOpen(false)}
        />
        <div className={`scrim ${sbOpen ? "show" : ""}`} onClick={() => setSbOpen(false)}></div>
        <main className="content-wrap" ref={contentRef}>
          <PageRenderer pageId={pageId} />
        </main>
        <TOC headings={headings} activeId={activeHeading} onJump={jumpToHeading} />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
