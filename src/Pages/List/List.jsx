import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

/* ─── one-time style injection ─────────────────────────────── */
const injectCSS = () => {
  if (document.getElementById("list-styles")) return;
  const s = document.createElement("style");
  s.id = "list-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;600;700&display=swap');

    .list-page {
      min-height: 100vh;
      padding: 48px 32px;
      font-family: 'Barlow Condensed', sans-serif;
      background: var(--bg-main, #080808);
      color: var(--text-primary, #fff);
    }

    /* ── header ── */
    .list-header {
      max-width: 960px;
      margin: 0 auto 40px;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255,208,0,0.18);
      padding-bottom: 20px;
    }
    .list-title { font-size: clamp(2rem,5vw,3.6rem); font-weight: 700;
      letter-spacing: .06em; text-transform: uppercase; line-height: 1; }
    .list-title span { color: var(--primary-color, #ffd000); }
    .list-sub { font-size: .75rem; letter-spacing: .28em; text-transform: uppercase;
      color: var(--text-secondary, #aaa); }
    .list-count { font-size: .78rem; letter-spacing: .2em; text-transform: uppercase;
      color: var(--text-secondary, #aaa); }

    /* ── column headers ── */
    .list-cols {
      max-width: 960px; margin: 0 auto 12px;
      display: grid;
      grid-template-columns: 72px 1fr 120px 80px 48px;
      gap: 16px;
      padding: 0 16px;
    }
    .list-col-label {
      font-size: .65rem; letter-spacing: .3em; text-transform: uppercase;
      color: var(--primary-color, #ffd000); font-weight: 600;
    }

    /* ── product row ── */
    .list-row {
      max-width: 960px; margin: 0 auto 10px;
      display: grid;
      grid-template-columns: 72px 1fr 120px 80px 48px;
      gap: 16px;
      align-items: center;
      padding: 14px 16px;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 6px;
      background: rgba(255,208,0,0.025);
      transition: border-color .2s, background .2s, transform .18s;
      animation: rowIn .35s ease both;
    }
    .list-row:hover {
      border-color: rgba(255,208,0,0.25);
      background: rgba(255,208,0,0.055);
      transform: translateX(4px);
    }
    @keyframes rowIn {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* staggered entrance */
    .list-row:nth-child(1)  { animation-delay: .04s }
    .list-row:nth-child(2)  { animation-delay: .08s }
    .list-row:nth-child(3)  { animation-delay: .12s }
    .list-row:nth-child(4)  { animation-delay: .16s }
    .list-row:nth-child(5)  { animation-delay: .20s }
    .list-row:nth-child(6)  { animation-delay: .24s }
    .list-row:nth-child(7)  { animation-delay: .28s }
    .list-row:nth-child(8)  { animation-delay: .32s }

    /* ── thumbnail ── */
    .list-thumb {
      width: 56px; height: 56px;
      border-radius: 4px;
      object-fit: cover;
      border: 1px solid rgba(255,208,0,0.15);
      display: block;
    }
    .list-thumb-placeholder {
      width: 56px; height: 56px; border-radius: 4px;
      background: rgba(255,208,0,0.06);
      border: 1px dashed rgba(255,208,0,0.2);
      display: flex; align-items: center; justify-content: center;
      font-size: .65rem; color: rgba(255,208,0,0.3); letter-spacing: .1em;
    }

    /* ── name ── */
    .list-name {
      font-size: 1rem; font-weight: 600; letter-spacing: .06em;
      text-transform: uppercase; color: var(--text-primary, #fff);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .list-category {
      font-size: .68rem; letter-spacing: .2em; text-transform: uppercase;
      color: var(--text-secondary, #aaa); margin-top: 3px;
    }

    /* ── price ── */
    .list-price {
      font-size: 1.05rem; font-weight: 700; letter-spacing: .05em;
      color: var(--primary-color, #ffd000);
    }
    .list-price-label {
      font-size: .6rem; letter-spacing: .15em; color: var(--text-secondary, #aaa);
      text-transform: uppercase;
    }

    /* ── badge ── */
    .list-badge {
      font-size: .62rem; letter-spacing: .18em; text-transform: uppercase;
      padding: 4px 10px; border-radius: 3px;
      background: rgba(255,208,0,0.1); color: var(--primary-color, #ffd000);
      border: 1px solid rgba(255,208,0,0.22); white-space: nowrap;
      display: inline-block;
    }

    /* ── delete button ── */
    .list-del {
      width: 34px; height: 34px; border-radius: 4px;
      border: 1px solid rgba(255,60,60,0.25);
      background: rgba(255,60,60,0.06);
      color: rgba(255,80,80,0.7);
      font-size: 1rem; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: background .2s, border-color .2s, color .2s, transform .15s;
    }
    .list-del:hover {
      background: rgba(255,60,60,0.18);
      border-color: rgba(255,60,60,0.6);
      color: #ff5050;
      transform: scale(1.12);
    }
    .list-del:active { transform: scale(0.96); }
    /* confirm state */
    .list-del.confirm {
      background: rgba(255,60,60,0.28);
      border-color: #ff5050; color: #fff;
      animation: pulse .4s ease infinite alternate;
    }
    @keyframes pulse {
      from { box-shadow: 0 0 0 0 rgba(255,80,80,0); }
      to   { box-shadow: 0 0 0 6px rgba(255,80,80,0.18); }
    }

    /* ── empty state ── */
    .list-empty {
      max-width: 960px; margin: 80px auto;
      text-align: center;
    }
    .list-empty-icon {
      font-size: 3rem; margin-bottom: 16px;
      color: rgba(255,208,0,0.2);
    }
    .list-empty-text {
      font-size: 1.4rem; letter-spacing: .2em; text-transform: uppercase;
      color: var(--text-secondary, #aaa);
    }
    .list-empty-sub {
      font-size: .78rem; letter-spacing: .18em; text-transform: uppercase;
      color: rgba(255,255,255,0.2); margin-top: 8px;
    }

    /* ── skeleton loader ── */
    .list-skeleton {
      max-width: 960px; margin: 0 auto 10px;
      height: 84px; border-radius: 6px;
      background: linear-gradient(90deg,
        rgba(255,255,255,.04) 25%,
        rgba(255,208,0,.06) 50%,
        rgba(255,255,255,.04) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.4s infinite;
    }
    @keyframes shimmer {
      from { background-position: 200% 0; }
      to   { background-position: -200% 0; }
    }

    /* ── divider lines ── */
    .list-divider {
      max-width: 960px; margin: 0 auto 24px;
      height: 1px; background: rgba(255,208,0,0.08);
    }

    /* responsive */
    @media (max-width: 640px) {
      .list-cols, .list-row {
        grid-template-columns: 56px 1fr 90px 36px;
      }
      .list-badge { display: none; }
      .list-page { padding: 32px 16px; }
    }
  `;
  document.head.appendChild(s);
};

/* ── Delete button with single-click confirm ── */
const DeleteBtn = ({ onConfirm }) => {
  const [armed, setArmed] = useState(false);
  const timer = useRef(null);

  const handleClick = () => {
    if (armed) {
      clearTimeout(timer.current);
      onConfirm();
    } else {
      setArmed(true);
      timer.current = setTimeout(() => setArmed(false), 2000);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`list-del${armed ? " confirm" : ""}`}
      title={armed ? "Click again to confirm" : "Remove product"}
    >
      {armed ? "!" : "×"}
    </button>
  );
};

/* ─────────────────────────────────────────── */
const List = () => {
  injectCSS();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://inf-1-udgs.onrender.com/products/fetch");
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (itemId) => {
    try {
      const response = await axios.delete(
        `https://inf-1-udgs.onrender.com/products/remove/${itemId}`
      );
      if (response.data.success) {
        toast.success("Product removed");
        setProducts((prev) => prev.filter((item) => item._id !== itemId));
      } else {
        toast.error(response.data.message);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to remove product");
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  return (
    <div className="list-page">

      {/* ── Header ── */}
      <div className="list-header">
        <div>
          <h1 className="list-title">Product<span> Catalogue</span></h1>
          <p className="list-sub" style={{ marginTop: 6 }}>Manage inventory</p>
        </div>
        <span className="list-count">
          {loading ? "—" : products.length} item{products.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Column labels ── */}
      {!loading && products.length > 0 && (
        <>
          <div className="list-cols">
            <span className="list-col-label">Image</span>
            <span className="list-col-label">Name</span>
            <span className="list-col-label">Price</span>
            <span className="list-col-label">Category</span>
            <span className="list-col-label"></span>
          </div>
          <div className="list-divider" />
        </>
      )}

      {/* ── Skeleton ── */}
      {loading && [1, 2, 3, 4].map((i) => (
        <div key={i} className="list-skeleton"
          style={{ animationDelay: `${i * 0.12}s` }} />
      ))}

      {/* ── Product rows ── */}
      {!loading && products.length > 0 && products.map((item) => (
        <div key={item._id} className="list-row">

          {/* thumb */}
          {item.images?.[0]
            ? <img src={item.images[0]} alt={item.name} className="list-thumb" />
            : <div className="list-thumb-placeholder">NO IMG</div>
          }

          {/* name + category */}
          <div>
            <div className="list-name">{item.name}</div>
            {item.category && (
              <div className="list-category">{item.category}</div>
            )}
          </div>

          {/* price */}
          <div>
            <div className="list-price-label">KES</div>
            <div className="list-price">
              {Number(item.price).toLocaleString()}
            </div>
          </div>

          {/* badge */}
          <span className="list-badge">
            {item.category || "—"}
          </span>

          {/* delete */}
          <DeleteBtn onConfirm={() => removeProduct(item._id)} />
        </div>
      ))}

      {/* ── Empty state ── */}
      {!loading && products.length === 0 && (
        <div className="list-empty">
          <div className="list-empty-icon">◻</div>
          <p className="list-empty-text">No products yet</p>
          <p className="list-empty-sub">Add your first item to the catalogue</p>
        </div>
      )}
    </div>
  );
};

export default List;