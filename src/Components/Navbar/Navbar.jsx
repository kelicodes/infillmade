import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const injectCSS = () => {
  if (document.getElementById("navbar-styles")) return;
  const s = document.createElement("style");
  s.id = "navbar-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;600;700&display=swap');

    .beo-nav {
      position: sticky; top: 0; z-index: 999;
      width: 100%;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 40px;
      height: 64px;
      font-family: 'Barlow Condensed', sans-serif;
      background: var(--bg-main, #080808);
      border-bottom: 1px solid rgba(255,208,0,0.10);
      transition: background .4s, border-color .3s;
    }
    .beo-nav.scrolled {
      background: rgba(8,8,8,0.92);
      backdrop-filter: blur(14px);
      border-bottom-color: rgba(255,208,0,0.18);
    }
    html[theme="light"] .beo-nav.scrolled {
      background: rgba(255,255,255,0.92);
    }

    .beo-nav-accent {
      position: absolute; top: 0; left: 0;
      height: 2px;
      background: var(--primary-color, #ffd000);
      width: 0;
      transition: width .6s ease;
    }
    .beo-nav.scrolled .beo-nav-accent { width: 100%; }

    .beo-logo {
      font-size: 1.7rem; font-weight: 700;
      letter-spacing: .12em; text-transform: uppercase;
      color: var(--text-primary, #fff);
      cursor: pointer; user-select: none;
      transition: opacity .2s; line-height: 1;
    }
    .beo-logo:hover { opacity: .75; }
    .beo-logo span {
      color: var(--primary-color, #ffd000);
      display: inline-block;
      transition: transform .3s cubic-bezier(.34,1.56,.64,1);
    }
    .beo-logo:hover span { transform: rotate(20deg) scale(1.15); }

    .beo-links {
      display: flex; align-items: center; gap: 4px;
    }
    .beo-link {
      position: relative;
      font-size: .78rem; font-weight: 600;
      letter-spacing: .28em; text-transform: uppercase;
      color: var(--text-secondary, #aaa);
      text-decoration: none;
      padding: 6px 14px; border-radius: 3px;
      transition: color .2s; cursor: pointer;
    }
    .beo-link::after {
      content: '';
      position: absolute; bottom: 0; left: 14px; right: 14px;
      height: 1.5px;
      background: var(--primary-color, #ffd000);
      transform: scaleX(0); transform-origin: left;
      transition: transform .25s ease;
    }
    .beo-link:hover { color: var(--text-primary, #fff); }
    .beo-link:hover::after { transform: scaleX(1); }
    .beo-link.active { color: var(--text-primary, #fff); }
    .beo-link.active::after { transform: scaleX(1); }

    .beo-actions {
      display: flex; align-items: center; gap: 8px;
    }
    .beo-icon-btn {
      width: 36px; height: 36px; border-radius: 4px;
      border: 1px solid rgba(255,255,255,0.08);
      background: transparent;
      color: var(--text-secondary, #aaa);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      transition: border-color .2s, color .2s, background .2s, transform .15s;
    }
    .beo-icon-btn:hover {
      border-color: rgba(255,208,0,0.4);
      color: var(--primary-color, #ffd000);
      background: rgba(255,208,0,0.06);
      transform: scale(1.08);
    }
    .beo-icon-btn:active { transform: scale(0.95); }

    .beo-hamburger { display: none; }

    .beo-drawer {
      position: fixed;
      top: 64px; left: 0; right: 0;
      background: var(--bg-main, #080808);
      border-bottom: 1px solid rgba(255,208,0,0.12);
      padding: 0 24px;
      max-height: 0; overflow: hidden;
      transition: max-height .38s cubic-bezier(.4,0,.2,1), padding .38s ease;
      z-index: 998;
    }
    .beo-drawer.open {
      max-height: 320px;
      padding: 16px 24px 24px;
    }
    .beo-drawer-link {
      display: block;
      font-size: 1.1rem; font-weight: 600;
      letter-spacing: .22em; text-transform: uppercase;
      color: var(--text-secondary, #aaa);
      text-decoration: none;
      padding: 13px 0;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      transition: color .2s, padding-left .2s;
      cursor: pointer;
    }
    .beo-drawer-link:last-child { border-bottom: none; }
    .beo-drawer-link:hover { color: var(--primary-color, #ffd000); padding-left: 8px; }
    .beo-drawer-link.active { color: var(--primary-color, #ffd000); }

    @media (max-width: 768px) {
      .beo-nav { padding: 0 20px; }
      .beo-links { display: none; }
      .beo-hamburger { display: flex; }
    }
  `;
  document.head.appendChild(s);
};

const NAV_LINKS = [
  { label: "Add",    path: "/add" },
  { label: "List",   path: "/list" },
  { label: "Orders", path: "/orders" },
];

const Navbar = () => {
  injectCSS();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme]       = useState("dark");
  const [scrolled, setScrolled] = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute("theme", theme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className={`beo-nav${scrolled ? " scrolled" : ""}`}>
        <div className="beo-nav-accent" />

        <div className="beo-logo" onClick={() => navigate("/add")}>
          BE<span>Ø</span>
        </div>

        <div className="beo-links">
          {NAV_LINKS.map(({ label, path }) => (
            <span
              key={path}
              className={`beo-link${isActive(path) ? " active" : ""}`}
              onClick={() => navigate(path)}
            >
              {label}
            </span>
          ))}
        </div>

        <div className="beo-actions">
          <button
            className="beo-icon-btn"
            onClick={() => setTheme((p) => p === "dark" ? "light" : "dark")}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            className="beo-icon-btn beo-hamburger"
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <div className={`beo-drawer${menuOpen ? " open" : ""}`}>
        {NAV_LINKS.map(({ label, path }) => (
          <span
            key={path}
            className={`beo-drawer-link${isActive(path) ? " active" : ""}`}
            onClick={() => navigate(path)}
          >
            {label}
          </span>
        ))}
      </div>
    </>
  );
};

export default Navbar;