/* SearchBox — header trigger + dropdown as a single connected unit. */

const { useState, useEffect, useRef, useMemo } = React;

function buildSearchIndex() {
  const docs = [];
  Object.entries(window.PAGES).forEach(([pageId, page]) => {
    docs.push({
      pageId,
      sectionId: "",
      title: page.title,
      crumb: page.category,
      text: (page.subtitle || "") + " " + (page.title || ""),
    });
    (page.sections || []).forEach(s => {
      const text = (s.description || "") + " " + (s.body || "") + " " + (s.signature || "") + " " + (s.title || "") + " " + (s.q || "") + " " + (s.a || "");
      const body = (s.body || "") + " " + (s.description || "");
      const title = s.signature || s.title || s.q || "";
      if (title) {
        docs.push({
          pageId,
          sectionId: s.id,
          title,
          crumb: `${page.category} › ${page.title}`,
          text: text.replace(/<[^>]+>/g, " "),
        });
      }
      // Extract individual functions from HTML table rows in prose sections
      if (body) {
        const funcRe = /<code>(\w[\w<>,[\] ]*?\([^)]*\))\s*<\/code>/g;
        let m;
        while ((m = funcRe.exec(body)) !== null) {
          let fn = m[1].replace(/<\/?[^>]+>/g, "").trim();
          fn = fn.replace(/\s+/g, " ");
          if (fn.length < 70 && !docs.some(d => d.sectionId === s.id && d.title === fn)) {
            docs.push({
              pageId,
              sectionId: s.id,
              title: fn,
              crumb: `${page.category} › ${page.title}`,
              text: fn + " " + text.replace(/<[^>]+>/g, " "),
            });
          }
        }
      }
    });
  });
  return docs;
}

function scoreMatch(doc, q) {
  const ql = q.toLowerCase();
  let s = 0;
  const t = doc.title.toLowerCase();
  if (t === ql) s += 1000;
  if (t.startsWith(ql)) s += 200;
  if (t.includes(ql)) s += 100;
  if (doc.text.toLowerCase().includes(ql)) s += 10;
  return s;
}

function highlightHit(text, q) {
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <span className="hit">{text.slice(i, i + q.length)}</span>
      {text.slice(i + q.length)}
    </>
  );
}

function SearchBox() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  const wrapRef = useRef(null);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  const index = useMemo(buildSearchIndex, []);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    return index
      .map(d => ({ d, s: scoreMatch(d, q.trim()) }))
      .filter(x => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 14)
      .map(x => x.d);
  }, [q, index]);

  const close = () => { setOpen(false); setQ(""); setActive(0); };

  const openIt = () => {
    setOpen(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const go = (r) => {
    if (r.sectionId) {
      window.dispatchEvent(new CustomEvent("goto", { detail: { pageId: r.pageId, section: r.sectionId } }));
    } else {
      window.dispatchEvent(new CustomEvent("goto", { detail: r.pageId }));
    }
    close();
  };

  /* Global shortcuts: Cmd/Ctrl+K and "/" to open. */
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openIt();
      }
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        openIt();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* Click outside the SearchBox closes it. */
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) close();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  /* Keep active row in view (no scrollIntoView). */
  useEffect(() => {
    const list = resultsRef.current;
    if (!list) return;
    const el = list.children[active];
    if (!el) return;
    const top = el.offsetTop;
    const bottom = top + el.offsetHeight;
    if (top < list.scrollTop) list.scrollTop = top;
    else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight;
  }, [active, results]);

  const onKey = (e) => {
    if (e.key === "Escape") { close(); return; }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive(a => results.length ? (a + 1) % results.length : 0);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(a => results.length ? (a - 1 + results.length) % results.length : 0);
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (results[active]) go(results[active]);
    }
  };

  return (
    <div className={`searchbox ${open ? "open" : ""}`} ref={wrapRef}>
      <button className="search-trigger" onClick={openIt} aria-label="Open search" aria-expanded={open}>
        <Icon name="search" size={14} />
        <span className="placeholder">Search docs…</span>
        <kbd>/</kbd>
      </button>
      {open && (
        <div className="search-shell">
          <div className="search-input-row">
            <Icon name="search" size={14} />
            <input
              ref={inputRef}
              value={q}
              onChange={e => { setQ(e.target.value); setActive(0); }}
              onKeyDown={onKey}
              placeholder="Search docs, functions, parameters…"
            />
            <kbd>Esc</kbd>
          </div>
          <div className="search-results" ref={resultsRef}>
            {q.trim() === "" ? (
              <div className="search-empty">Type to search · try <code>makeLuaSprite</code>, <code>getProperty</code>, <code>doTweenAlpha</code></div>
            ) : results.length === 0 ? (
              <div className="search-empty">No results for "{q}"</div>
            ) : results.map((r, i) => (
              <div
                key={`${r.pageId}-${r.sectionId}-${i}`}
                className={`search-result ${i === active ? "active" : ""}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(r)}
              >
                <div className="crumb">{r.crumb}</div>
                <div className="title">{highlightHit(r.title, q.trim())}</div>
              </div>
            ))}
          </div>
          <div className="search-foot">
            <span><kbd>↑</kbd><kbd>↓</kbd> nav</span>
            <span><kbd>↵</kbd> open</span>
            <span><kbd>Esc</kbd> close</span>
          </div>
        </div>
      )}
    </div>
  );
}

window.SearchBox = SearchBox;
