import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const navigate=useNavigate()

  useEffect(() => {
    document.documentElement.setAttribute("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="beo-nav">

      {/* LOGO */}
      <div onClick={()=>navigate("/add")} className="beo-logo">
        BE<span>Ø</span>
      </div>

      {/* LINKS */}
      <ul className={`beo-links ${menuOpen ? "open" : ""}`}>
        <li><a href="/" onClick={closeMenu}>Home</a></li>
        <li><a href="/shop" onClick={closeMenu}>Shop</a></li>
        <li><a href="/collection" onClick={closeMenu}>Collection</a></li>
        <li><a href="/about" onClick={closeMenu}>About</a></li>
      </ul>

      {/* ACTIONS */}
      <div className="beo-actions">

        <button className="beo-icon-btn" >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          className="beo-icon-btn mobile"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

      </div>

      {/* MOBILE MENU */}
      <div className={`beo-mobile ${menuOpen ? "show" : ""}`}>
        <a href="/" onClick={closeMenu}>Home</a>
        <a href="/shop" onClick={closeMenu}>Shop</a>
        <a href="/collection" onClick={closeMenu}>Collection</a>
        <a href="/about" onClick={closeMenu}>About</a>
      </div>

    </nav>
  );
};

export default Navbar;