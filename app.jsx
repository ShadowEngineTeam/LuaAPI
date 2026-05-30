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

/* Easing math — mirrors flixel's FlxEase (Penner equations) so previews match in-game. */
const EASE = (() => {
  const PI = Math.PI;
  const c1 = 1.70158, c2 = c1 * 1.525, c3 = c1 + 1, c4 = (2 * PI) / 3, c5 = (2 * PI) / 4.5;
  const bo = (t) => {
    const n = 7.5625, d = 2.75;
    if (t < 1 / d) return n * t * t;
    if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75;
    if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375;
    return n * (t -= 2.625 / d) * t + 0.984375;
  };
  return {
    linear: (t) => t,
    sineIn: (t) => 1 - Math.cos((t * PI) / 2),
    sineOut: (t) => Math.sin((t * PI) / 2),
    sineInOut: (t) => -(Math.cos(PI * t) - 1) / 2,
    quadIn: (t) => t * t,
    quadOut: (t) => 1 - (1 - t) * (1 - t),
    quadInOut: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
    cubeIn: (t) => t * t * t,
    cubeOut: (t) => 1 - Math.pow(1 - t, 3),
    cubeInOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    quartIn: (t) => t * t * t * t,
    quartOut: (t) => 1 - Math.pow(1 - t, 4),
    quartInOut: (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2),
    quintIn: (t) => t * t * t * t * t,
    quintOut: (t) => 1 - Math.pow(1 - t, 5),
    quintInOut: (t) => (t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2),
    expoIn: (t) => (t === 0 ? 0 : Math.pow(2, 10 * t - 10)),
    expoOut: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    expoInOut: (t) => (t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2),
    backIn: (t) => c3 * t * t * t - c1 * t * t,
    backOut: (t) => 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2),
    backInOut: (t) => (t < 0.5 ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2 : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2),
    elasticIn: (t) => (t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4)),
    elasticOut: (t) => (t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1),
    elasticInOut: (t) => (t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2 : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1),
    bounceIn: (t) => 1 - bo(1 - t),
    bounceOut: bo,
    bounceInOut: (t) => (t < 0.5 ? (1 - bo(1 - 2 * t)) / 2 : (1 + bo(2 * t - 1)) / 2),
    circIn: (t) => 1 - Math.sqrt(1 - t * t),
    circOut: (t) => Math.sqrt(1 - (t - 1) * (t - 1)),
    circInOut: (t) => (t < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2),
  };
})();

/* Animated curve + motion preview for a single easing. */
function EasingPreview({ name, compact }) {
  const fn = EASE[name] || EASE.linear;
  const W = 280, H = 220, X0 = 36, X1 = 262, Y0 = 180, Y1 = 40; // Y0 = value 0, Y1 = value 1
  const tx = (t) => X0 + t * (X1 - X0);
  const vy = (v) => Y0 - v * (Y0 - Y1);
  // static curve path for the current easing
  let d = "";
  const N = 96;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    d += (i ? " L" : "M") + tx(t).toFixed(1) + " " + vy(fn(t)).toFixed(1);
  }
  // compress motion track to [-0.3, 1.3] so overshoot stays visible
  const puckPos = (v) => ((v + 0.3) / 1.6) * 100;

  const dot = useRef(null), gx = useRef(null), gy = useRef(null), puck = useRef(null);
  useEffect(() => {
    let raf, start = null;
    const RUN = 1500, HOLD = 450, TOTAL = RUN + HOLD;
    const tick = (now) => {
      if (start == null) start = now;
      let t = ((now - start) % TOTAL) / RUN;
      if (t > 1) t = 1;
      const v = fn(t), x = tx(t), y = vy(v);
      if (dot.current) { dot.current.setAttribute("cx", x); dot.current.setAttribute("cy", y); }
      if (gx.current) { gx.current.setAttribute("x2", x); gx.current.setAttribute("y1", y); gx.current.setAttribute("y2", y); }
      if (gy.current) { gy.current.setAttribute("x1", x); gy.current.setAttribute("x2", x); gy.current.setAttribute("y1", y); }
      if (puck.current) puck.current.style.left = puckPos(v) + "%";
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [name]);

  return (
    <React.Fragment>
      <svg className="ease-graph" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${name} easing curve`}>
        <line className="ease-grid" x1={X0} y1={Y1} x2={X1} y2={Y1} />
        <line className="ease-axis" x1={X0} y1={Y1 - 18} x2={X0} y2={Y0 + 18} />
        <line className="ease-axis" x1={X0} y1={Y0} x2={X1} y2={Y0} />
        <text className="ease-tick" x={X0 - 9} y={Y0 + 4} textAnchor="end">0</text>
        <text className="ease-tick" x={X0 - 9} y={Y1 + 4} textAnchor="end">1</text>
        <text className="ease-tick" x={X0} y={Y0 + 30} textAnchor="middle">t=0</text>
        <text className="ease-tick" x={X1} y={Y0 + 30} textAnchor="middle">t=1</text>
        <line className="ease-linear" x1={X0} y1={Y0} x2={X1} y2={Y1} />
        <line ref={gy} className="ease-guide" x1={X0} y1={Y0} x2={X0} y2={Y0} />
        <line ref={gx} className="ease-guide" x1={X0} y1={Y0} x2={X0} y2={Y0} />
        <path className="ease-curve" d={d} />
        <circle ref={dot} className="ease-dot" cx={X0} cy={Y0} r="4.5" />
      </svg>
      {compact ? (
        <div className="ease-active">{name}</div>
      ) : (
        <div className="ease-demo">
          <div className="ease-active">{name}</div>
          <div className="ease-demo-cap">value 0 → 1 over time</div>
          <div className="ease-track">
            <span className="ease-tick-mark" style={{ left: puckPos(0) + "%" }}></span>
            <span className="ease-tick-mark" style={{ left: puckPos(1) + "%" }}></span>
            <div ref={puck} className="ease-puck" style={{ left: puckPos(0) + "%" }}></div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

function EasingsSection() {
  const [hover, setHover] = useState(null);
  const [selected, setSelected] = useState("elasticOut");
  const [docked, setDocked] = useState(false);
  const cardRef = useRef(null);
  const active = hover || selected;

  // When the inline preview scrolls up out of view, show a compact docked copy
  // so the curve stays visible while hovering rows further down the table.
  useEffect(() => {
    const el = cardRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([e]) => setDocked(!e.isIntersecting && e.boundingClientRect.top < 60),
      { threshold: 0, rootMargin: "-56px 0px 0px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div>
      <h2 id="list">Available easings</h2>
      <p>Hover or click an easing to preview its curve. Unknown names fall back to <code>linear</code>.</p>
      <div className="ease-card" ref={cardRef}>
        <EasingPreview name={active} />
      </div>
      {docked && (
        <div className="ease-float" aria-hidden="true">
          <EasingPreview name={active} compact />
        </div>
      )}
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
                      onClick={() => setSelected(name)}
                      style={{
                        cursor: "pointer",
                        color: active === name ? "var(--violet-strong)" : "var(--violet)",
                        background: active === name ? "var(--violet-soft)" : "transparent",
                        fontWeight: selected === name ? 700 : 400,
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
    { ease = '${active}' })`} />
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
