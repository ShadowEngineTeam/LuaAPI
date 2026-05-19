/* CodeBlock — supports tabs, line highlighting, copy button */

const { useState, useEffect, useRef, useMemo } = React;

function CodeBlock({ lang, source, filename, tabs, highlight: hl }) {
  const hasTabs = Array.isArray(tabs) && tabs.length > 0;
  const [tabIdx, setTabIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const active = hasTabs ? tabs[tabIdx] : { source, name: filename };
  const code = active.source;
  const codeLang = active.lang || lang || "lua";
  const highlightedLines = useMemo(() => {
    const hl = window.highlight(code, codeLang);
    return hl.split("\n");
  }, [code, codeLang]);

  const hlSet = new Set(Array.isArray(hl) ? hl : []);
  const onCopy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="code-block">
      <div className="code-head">
        {hasTabs ? (
          <div className="tabs">
            {tabs.map((t, i) => (
              <button
                key={i}
                className={`tab ${i === tabIdx ? "active" : ""}`}
                onClick={() => setTabIdx(i)}
              >
                {t.name}
              </button>
            ))}
          </div>
        ) : (
          <>
            <span className="lang-dot" style={{
              background: codeLang === "lua" ? "var(--violet)" : codeLang === "bash" ? "var(--yellow)" : codeLang === "json" ? "#4ec9b0" : "#569cd6"
            }}></span>
            <span className="filename">{filename || codeLang}</span>
          </>
        )}
        <div className="code-actions">
          <button className={`code-btn ${copied ? "copied" : ""}`} onClick={onCopy} aria-label="Copy code">
            <Icon name={copied ? "check" : "copy"} size={13} />
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
      <div className="code-body">
        <div className="code-gutter">
          {highlightedLines.map((_, i) => (
            <span className="ln" key={i}>{i + 1}</span>
          ))}
        </div>
        <pre className="code-pre">
          {highlightedLines.map((html, i) => (
            <span
              key={i}
              className={`line ${hlSet.has(i + 1) ? "hl" : ""}`}
              dangerouslySetInnerHTML={{ __html: html || "&nbsp;" }}
            />
          ))}
        </pre>
      </div>
    </div>
  );
}

/* ---------- Signature block ---------- */
function Signature({ sig, ns, fn }) {
  // Build colorized signature: ns:fn(p1, p2, ...)
  const m = sig.match(/^([\w]+)?(:?)([\w_]+)\((.*)\)$/);
  if (!m) return <div className="sig">{sig}</div>;
  const [, nsName, sep, fnName, paramStr] = m;
  const params = paramStr.split(",").map(p => p.trim()).filter(Boolean);
  return (
    <div className="sig">
      {nsName && <><span className="ns">{nsName}</span><span className="pt">{sep}</span></>}
      <span className="fn">{fnName}</span>
      <span className="pt">(</span>
      {params.map((p, i) => (
        <React.Fragment key={i}>
          <span className="param">{p}</span>
          {i < params.length - 1 && <span className="pt">, </span>}
        </React.Fragment>
      ))}
      <span className="pt">)</span>
    </div>
  );
}

/* ---------- API section renderer ---------- */
function APIEntry({ s }) {
  return (
    <div>
      <h3 id={s.id}>
        <span className="h3-sig">{s.signature}</span>
        <a className="h3-anchor" href={`#${s.id}`} aria-label="Link to this section">#</a>
      </h3>
      <p dangerouslySetInnerHTML={{ __html: s.description }} />
      {s.params && s.params.length > 0 && (
        <>
          <h4>Parameters</h4>
          <table className="tbl">
            <thead>
              <tr>
                <th style={{width: 110}}>Name</th>
                <th style={{width: 110}}>Type</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {s.params.map(([name, type, desc, opt], i) => (
                <tr key={i}>
                  <td>{name}</td>
                  <td><span className="type">{type}</span></td>
                  <td>
                    <span dangerouslySetInnerHTML={{ __html: desc }} />
                    {opt && <> · <span className="opt">{opt}</span></>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {s.returns && (
        <>
          <h4>Returns</h4>
          <p><code>{s.returns}</code></p>
        </>
      )}
      {s.code && (
        <>
          <h4>Example</h4>
          <CodeBlock {...s.code} />
        </>
      )}
    </div>
  );
}

/* ---------- Prose section renderer ---------- */
function ProseSection({ s }) {
  return (
    <div>
      {s.title && (
        <h2 id={s.id}>
          {s.title}
        </h2>
      )}
      {s.body && <div className="prose" dangerouslySetInnerHTML={{ __html: s.body }} />}
      {s.code && <CodeBlock {...s.code} />}
      {s.callout && (
        <div className={`callout ${s.callout.kind === "warn" ? "warn" : s.callout.kind === "tip" ? "tip" : ""}`}>
          <Icon name={s.callout.kind === "warn" ? "warn" : "info"} size={18} />
          <p dangerouslySetInnerHTML={{ __html: s.callout.text }} />
        </div>
      )}
    </div>
  );
}

window.CodeBlock = CodeBlock;
window.APIEntry = APIEntry;
window.ProseSection = ProseSection;
