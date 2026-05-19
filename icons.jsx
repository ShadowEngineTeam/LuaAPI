/* Minimal inline icon set + lua/bash syntax highlighter */

const Icon = ({ name, size = 16, color }) => {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color || "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: { flexShrink: 0 },
  };
  switch (name) {
    case "search":
      return <svg {...props}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
    case "chev":
      return <svg {...props}><path d="m6 9 6 6 6-6" /></svg>;
    case "chev-r":
      return <svg {...props}><path d="m9 6 6 6-6 6" /></svg>;
    case "chev-l":
      return <svg {...props}><path d="m15 6-6 6 6 6" /></svg>;
    case "copy":
      return <svg {...props}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>;
    case "check":
      return <svg {...props}><path d="m5 12 5 5L20 7" /></svg>;
    case "menu":
      return <svg {...props}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
    case "close":
      return <svg {...props}><path d="M6 6l12 12M18 6L6 18" /></svg>;
    case "external":
      return <svg {...props}><path d="M14 4h6v6" /><path d="M20 4 10 14" /><path d="M20 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4" /></svg>;
    case "github":
      return <svg viewBox="0 0 24 24" width={size} height={size} fill={color || "currentColor"}><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.35.78 1.05.78 2.12 0 1.53-.01 2.77-.01 3.14 0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z"/></svg>;
    case "bolt":
      return <svg {...props}><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" /></svg>;
    case "tag":
      return <svg {...props}><path d="M20 12 12 20l-9-9V3h8z" /><circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" /></svg>;
    case "puzzle":
      return <svg {...props}><path d="M14 4a2 2 0 1 0-4 0v2H6a2 2 0 0 0-2 2v4h2a2 2 0 1 1 0 4H4v4a2 2 0 0 0 2 2h4v-2a2 2 0 1 1 4 0v2h4a2 2 0 0 0 2-2v-4h-2a2 2 0 1 1 0-4h2V8a2 2 0 0 0-2-2h-4z" /></svg>;
    case "wave":
      return <svg {...props}><path d="M3 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0" /></svg>;
    case "info":
      return <svg {...props}><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.5v.5" /></svg>;
    case "warn":
      return <svg {...props}><path d="M12 3 2 21h20Z" /><path d="M12 10v5M12 18v.5" /></svg>;
    default: return null;
  }
};

/* ----------- Lua / Bash highlighter -----------
   Outputs HTML string with <span class="tok-..."> tokens. */
const LUA_KEYWORDS = new Set([
  "function","end","if","then","else","elseif","do","while","for","in","local",
  "return","true","false","nil","and","or","not","repeat","until","break"
]);
const LUA_BUILTINS = new Set([
  "print","type","tostring","tonumber","pairs","ipairs"
]);
const HL_ESC = (s) => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

function highlightLua(src) {
  let out = "";
  let i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    const next2 = src.slice(i, i + 2);
    // comment
    if (next2 === "--") {
      const end = src.indexOf("\n", i);
      const stop = end === -1 ? n : end;
      out += `<span class="tok-cm">${HL_ESC(src.slice(i, stop))}</span>`;
      i = stop;
      continue;
    }
    // strings
    if (c === '"' || c === "'") {
      const quote = c;
      let j = i + 1;
      while (j < n && src[j] !== quote) {
        if (src[j] === "\\") j += 2; else j++;
      }
      j = Math.min(j + 1, n);
      out += `<span class="tok-str">${HL_ESC(src.slice(i, j))}</span>`;
      i = j;
      continue;
    }
    // numbers
    if (/[0-9]/.test(c) && (i === 0 || /[^a-zA-Z_0-9]/.test(src[i - 1]))) {
      let j = i;
      while (j < n && /[0-9.xXa-fA-F]/.test(src[j])) j++;
      out += `<span class="tok-num">${HL_ESC(src.slice(i, j))}</span>`;
      i = j;
      continue;
    }
    // identifiers
    if (/[a-zA-Z_]/.test(c)) {
      let j = i;
      while (j < n && /[a-zA-Z_0-9]/.test(src[j])) j++;
      const ident = src.slice(i, j);
      const prevCh = src[i - 1];
      const nextCh = src[j];

      if (LUA_KEYWORDS.has(ident)) {
        out += `<span class="tok-kw">${ident}</span>`;
      } else if (prevCh === "." || prevCh === ":") {
        // method/property after . or :
        if (nextCh === "(") out += `<span class="tok-fn">${ident}</span>`;
        else out += `<span class="tok-pr">${ident}</span>`;
      } else if (LUA_BUILTINS.has(ident)) {
        out += `<span class="tok-bi">${ident}</span>`;
      } else if (nextCh === "(") {
        out += `<span class="tok-fn">${ident}</span>`;
      } else {
        out += HL_ESC(ident);
      }
      i = j;
      continue;
    }
    // punctuation
    if (/[{}()\[\],;]/.test(c)) {
      out += `<span class="tok-pt">${HL_ESC(c)}</span>`;
      i++;
      continue;
    }
    if (/[=+\-*/%<>~!#:.]/.test(c)) {
      out += `<span class="tok-op">${HL_ESC(c)}</span>`;
      i++;
      continue;
    }
    out += HL_ESC(c);
    i++;
  }
  return out;
}

function highlightBash(src) {
  // Per-line: if line starts with $ make $ violet, command yellow-ish; comments green.
  return src.split("\n").map(raw => {
    const line = HL_ESC(raw);
    // comment
    if (/^\s*#/.test(raw)) return `<span class="tok-cm">${line}</span>`;
    // prompt
    const m = raw.match(/^(\s*)(\$)\s+(\S+)(.*)$/);
    if (m) {
      const [, sp, dollar, cmd, rest] = m;
      const restEsc = HL_ESC(rest);
      return `${sp}<span class="tok-bi">${dollar}</span> <span class="tok-fn">${HL_ESC(cmd)}</span><span class="tok-str">${restEsc}</span>`;
    }
    return line;
  }).join("\n");
}

function highlightJson(src) {
  let out = "";
  let i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    // string (key or value)
    if (c === '"') {
      let j = i + 1;
      while (j < n && src[j] !== '"') {
        if (src[j] === "\\") j += 2; else j++;
      }
      j = Math.min(j + 1, n);
      // peek next non-space to decide key vs value
      let k = j;
      while (k < n && /\s/.test(src[k])) k++;
      const isKey = src[k] === ":";
      out += `<span class="${isKey ? "tok-pr" : "tok-str"}">${HL_ESC(src.slice(i, j))}</span>`;
      i = j;
      continue;
    }
    // numbers
    if (/[0-9-]/.test(c) && /[^a-zA-Z_]/.test(src[i - 1] || " ")) {
      let j = i;
      if (src[j] === "-") j++;
      while (j < n && /[0-9.eE+-]/.test(src[j])) j++;
      out += `<span class="tok-num">${HL_ESC(src.slice(i, j))}</span>`;
      i = j;
      continue;
    }
    // literals
    if (/[a-z]/.test(c)) {
      let j = i;
      while (j < n && /[a-z]/.test(src[j])) j++;
      const word = src.slice(i, j);
      if (word === "true" || word === "false" || word === "null") {
        out += `<span class="tok-kw">${word}</span>`;
      } else {
        out += HL_ESC(word);
      }
      i = j;
      continue;
    }
    if (/[{}\[\],:]/.test(c)) {
      out += `<span class="tok-pt">${HL_ESC(c)}</span>`;
      i++;
      continue;
    }
    out += HL_ESC(c);
    i++;
  }
  return out;
}

function highlight(src, lang) {
  if (lang === "lua") return highlightLua(src);
  if (lang === "bash" || lang === "sh") return highlightBash(src);
  if (lang === "json") return highlightJson(src);
  return HL_ESC(src);
}

window.Icon = Icon;
window.highlight = highlight;
