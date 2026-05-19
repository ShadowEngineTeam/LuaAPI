const { useState } = React;

function Sidebar({ currentPage, onGo, open, onClose }) {
  const [collapsed, setCollapsed] = useState(() => new Set());
  const toggleGroup = (title) => {
    setCollapsed(prev => {
      const n = new Set(prev);
      n.has(title) ? n.delete(title) : n.add(title);
      return n;
    });
  };
  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <div className="sidebar-inner">
        {window.NAV.map(group => {
          const isCollapsed = collapsed.has(group.title);
          return (
            <div key={group.title} className={`sb-group ${isCollapsed ? "collapsed" : ""}`}>
              <button className="sb-group-title" onClick={() => toggleGroup(group.title)}>
                <Icon name="chev" size={12} />
                <span>{group.title}</span>
              </button>
              <div className="sb-items">
                {group.items.map(item => (
                  <button
                    key={item.id}
                    className={`sb-item ${currentPage === item.id ? "active" : ""}`}
                    onClick={() => { onGo(item.id); onClose && onClose(); }}
                  >
                    {item.mono ? <span className="fnname">{item.label}</span> : item.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

function Header({ onMenuOpen, currentPage }) {
  return (
    <header className="header">
      <button className="icon-btn menu-btn" onClick={onMenuOpen} aria-label="Open menu">
        <Icon name="menu" size={18} />
      </button>
      <a className="brand" href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent("goto", { detail: "introduction" })); }}>
        <img src="assets/engine_logo.png" alt="Shadow Engine" />
        <span className="brand-text">Shadow Engine</span>
      </a>
      <nav className="header-nav">
        <a href="#" className={currentPage === "introduction" ? "active" : ""} onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent("goto", { detail: "introduction" })); }}>Docs</a>
        <a href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent("goto", { detail: "event-callbacks" })); }}>API</a>
        <a href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent("goto", { detail: "examples" })); }}>Examples</a>
        <a href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent("goto", { detail: "faq" })); }}>FAQ</a>
      </nav>
      <div className="header-right">
        <SearchBox />
        <a className="icon-btn" href="https://github.com/ShadowEngineTeam/FNF-Shadow-Engine" target="_blank" rel="noopener" aria-label="GitHub repository">
          <Icon name="github" size={18} />
        </a>
      </div>
    </header>
  );
}

function TOC({ headings, activeId, onJump }) {
  if (!headings || headings.length === 0) return <aside className="toc" />;
  return (
    <aside className="toc">
      <div className="toc-title">On this page</div>
      <ul className="toc-list">
        {headings.map(h => (
          <li key={h.id} className={`lvl-${h.lvl}`}>
            <a
              href={`#${h.id}`}
              className={activeId === h.id ? "active" : ""}
              onClick={(e) => { e.preventDefault(); onJump(h.id); }}
            >{h.label}</a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

window.Sidebar = Sidebar;
window.Header = Header;
window.TOC = TOC;
