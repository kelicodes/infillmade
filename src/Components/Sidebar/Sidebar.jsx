import { Link, useLocation } from "react-router-dom";
import { MdAddchart, MdAddBusiness } from "react-icons/md";
import { FaList } from "react-icons/fa";

const injectCSS = () => {
  if (document.getElementById("sidebar-styles")) return;
  const s = document.createElement("style");
  s.id = "sidebar-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700&display=swap');

    .beo-sidebar {
      width: 100px; min-height: 100vh;
      background: var(--bg-main, #080808);
      border-right: 1px solid rgba(255,208,0,0.10);
      padding: 36px 0 24px;
      display: flex; flex-direction: column;
      font-family: 'Barlow Condensed', sans-serif;
      position: relative; flex-shrink: 0;
    }
    .beo-sidebar::after {
      content: ''; position: absolute; top: 10%; right: -1px;
      width: 1px; height: 80%;
      background: linear-gradient(to bottom,
        transparent, rgba(255,208,0,0.25) 30%,
        rgba(255,208,0,0.25) 70%, transparent);
    }

    .beo-sidebar-brand {
      padding: 0 22px 28px;
      border-bottom: 1px solid rgba(255,208,0,0.08);
      margin-bottom: 20px;
    }
    .beo-sidebar-wordmark {
      font-size: 1.55rem; font-weight: 700;
      letter-spacing: .14em; text-transform: uppercase;
      color: var(--text-primary, #fff); line-height: 1; user-select: none;
    }
    .beo-sidebar-wordmark span { color: var(--primary-color, #ffd000); }
    .beo-sidebar-role {
      font-size: .6rem; letter-spacing: .32em; text-transform: uppercase;
      color: var(--text-secondary, #aaa); margin-top: 5px;
    }

    .beo-sidebar-section {
      font-size: .58rem; letter-spacing: .38em; text-transform: uppercase;
      color: rgba(255,208,0,0.45); font-weight: 700; padding: 0 22px 10px;
    }

    .beo-side-link {
      display: flex; align-items: center; gap: 12px;
      padding: 11px 20px 11px 18px; margin: 2px 10px;
      border-radius: 5px; text-decoration: none;
      color: var(--text-secondary, #aaa);
      position: relative; overflow: hidden;
      transition: color .2s, background .2s;
      border: 1px solid transparent;
      animation: slideIn .3s ease both;
    }
    .beo-side-link:nth-child(1){animation-delay:.05s}
    .beo-side-link:nth-child(2){animation-delay:.10s}
    .beo-side-link:nth-child(3){animation-delay:.15s}
    @keyframes slideIn {
      from { opacity:0; transform:translateX(-10px); }
      to   { opacity:1; transform:translateX(0); }
    }
    .beo-side-link::before {
      content: ''; position: absolute; inset: 0;
      background: rgba(255,208,0,0.06); opacity: 0;
      transition: opacity .2s; border-radius: 4px;
    }
    .beo-side-link:hover::before { opacity: 1; }
    .beo-side-link:hover { color: var(--text-primary, #fff); border-color: rgba(255,208,0,0.15); }
    .beo-side-link::after {
      content: ''; position: absolute; left: 0; top: 20%; bottom: 20%;
      width: 2.5px; border-radius: 2px;
      background: var(--primary-color, #ffd000);
      transform: scaleY(0);
      transition: transform .22s cubic-bezier(.34,1.56,.64,1);
    }
    .beo-side-link:hover::after { transform: scaleY(0.6); }
    .beo-side-link.active::after { transform: scaleY(1) !important; }
    .beo-side-link.active {
      color: var(--text-primary, #fff);
      background: rgba(255,208,0,0.07);
      border-color: rgba(255,208,0,0.18);
    }

    .beo-side-icon {
      font-size: 1.15rem; color: var(--text-secondary, #aaa);
      transition: color .2s, transform .2s; flex-shrink: 0;
    }
    .beo-side-link:hover .beo-side-icon,
    .beo-side-link.active .beo-side-icon {
      color: var(--primary-color, #ffd000); transform: scale(1.18);
    }
    .beo-label {
      font-size: .82rem; font-weight: 600;
      letter-spacing: .18em; text-transform: uppercase;
      transition: letter-spacing .2s;
    }
    .beo-side-link:hover .beo-label,
    .beo-side-link.active .beo-label { letter-spacing: .24em; }

    .beo-side-badge {
      margin-left: auto; font-size: .58rem; font-weight: 700;
      letter-spacing: .08em;
      background: rgba(255,208,0,0.12); color: var(--primary-color, #ffd000);
      border: 1px solid rgba(255,208,0,0.28); border-radius: 3px; padding: 2px 6px;
      opacity: 0; transform: translateX(-4px);
      transition: opacity .2s, transform .2s;
    }
    .beo-side-link:hover .beo-side-badge,
    .beo-side-link.active .beo-side-badge { opacity: 1; transform: translateX(0); }

    .beo-sidebar-bottom {
      margin-top: auto; padding: 20px 22px 0;
      border-top: 1px solid rgba(255,255,255,0.05);
    }
    .beo-sidebar-hint {
      font-size: .6rem; letter-spacing: .2em; text-transform: uppercase;
      color: rgba(255,255,255,0.15); line-height: 1.8;
    }
    .beo-sidebar-hint strong {
      color: rgba(255,208,0,0.4); display: block; margin-bottom: 2px;
    }

    /* visible on mobile, hidden on desktop */
   

/* after */
@media (max-width: 768px) { .beo-sidebar { display: flex; } }
@media (min-width: 769px) { .beo-sidebar { display: none; } }
  `;
  document.head.appendChild(s);
};

const LINKS = [
  { to: "/add",    icon: MdAddchart,    label: "Add", badge: "NEW" },
  { to: "/list",   icon: FaList,        label: "lIST",    badge: null  },
  { to: "/orders", icon: MdAddBusiness, label: "Orders",      badge: null  },
];

const Sidebar = () => {
  injectCSS();
  const { pathname } = useLocation();

  return (
    <aside className="beo-sidebar">
      <div className="beo-sidebar-brand">
        <div className="beo-sidebar-wordmark">BE<span>Ø</span></div>
        <div className="beo-sidebar-role">Admin Panel</div>
      </div>

      <div className="beo-sidebar-section">Manage</div>

      {LINKS.map(({ to, icon: Icon, label, badge }) => (
        <Link key={to} to={to}
          className={`beo-side-link${pathname === to ? " active" : ""}`}>
          <Icon className="beo-side-icon" />
          <span className="beo-label">{label}</span>
          {badge && <span className="beo-side-badge">{badge}</span>}
        </Link>
      ))}

      <div className="beo-sidebar-bottom">
        <p className="beo-sidebar-hint">
          <strong>BEØ Studio</strong>
          Admin v1.0
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;