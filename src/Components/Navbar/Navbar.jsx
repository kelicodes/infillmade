import { useState, useEffect } from "react";
import { assets } from "../../assets/asssets.js";
import { Menu, X, Sun, Moon } from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("dark");

  // Apply theme to root element
  useEffect(() => {
    document.documentElement.setAttribute("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <nav className="navbar">
      {/* Left side: Logo */}
      <div className="navbar-logo">
        <h2>
          Gold<span>Store</span>
        </h2>
      </div>

      {/* Center: Links */}
      <ul className={`navbar-links ${menuOpen ? "open" : ""}`}>
        <li><a href="/">Home</a></li>
        <li><a href="/products">Products</a></li>
        <li><a href="/about">About</a></li>
      </ul>

      {/* Right side: Menu icon + Theme toggle + Profile */}
      <div className="navbar-right">
        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </div>
        <div className="theme-toggle" onClick={toggleTheme}>
          {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
        </div>
        <div className="navbar-profile">
          <img src={assets.profileimg} alt="Profile" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
