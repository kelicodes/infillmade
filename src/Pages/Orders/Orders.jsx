import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

/* ─── CSS injection ─────────────────────────────────────────── */
const injectCSS = () => {
  if (document.getElementById("orders-styles")) return;
  const s = document.createElement("style");
  s.id = "orders-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;600;700&display=swap');

    .ord-page {
      min-height: 100vh;
      padding: 48px 32px;
      font-family: 'Barlow Condensed', sans-serif;
      background: var(--bg-main, #080808);
      color: var(--text-primary, #fff);
    }

    /* ── header ── */
    .ord-header {
      max-width: 1020px; margin: 0 auto 40px;
      display: flex; align-items: flex-end; justify-content: space-between;
      border-bottom: 1px solid rgba(255,208,0,0.18);
      padding-bottom: 20px;
    }
    .ord-title { font-size: clamp(2rem,5vw,3.6rem); font-weight:700;
      letter-spacing:.06em; text-transform:uppercase; line-height:1; }
    .ord-title span { color: var(--primary-color,#ffd000); }
    .ord-sub { font-size:.75rem; letter-spacing:.28em; text-transform:uppercase;
      color:var(--text-secondary,#aaa); margin-top:6px; }
    .ord-count { font-size:.78rem; letter-spacing:.2em; text-transform:uppercase;
      color:var(--text-secondary,#aaa); }

    /* ── order card ── */
    .ord-card {
      max-width: 1020px; margin: 0 auto 14px;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 8px;
      background: rgba(255,208,0,0.02);
      overflow: hidden;
      transition: border-color .2s;
      animation: cardIn .35s ease both;
    }
    .ord-card:hover { border-color: rgba(255,208,0,0.2); }
    @keyframes cardIn {
      from { opacity:0; transform:translateY(14px); }
      to   { opacity:1; transform:translateY(0); }
    }
    .ord-card:nth-child(1) { animation-delay:.04s }
    .ord-card:nth-child(2) { animation-delay:.09s }
    .ord-card:nth-child(3) { animation-delay:.14s }
    .ord-card:nth-child(4) { animation-delay:.19s }
    .ord-card:nth-child(5) { animation-delay:.24s }
    .ord-card:nth-child(6) { animation-delay:.29s }

    /* ── card top bar ── */
    .ord-topbar {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 20px;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      background: rgba(255,255,255,0.02);
    }
    .ord-id {
      font-size:.68rem; letter-spacing:.2em; text-transform:uppercase;
      color:var(--text-secondary,#aaa);
    }
    .ord-id strong {
      color:var(--text-primary,#fff); font-size:.78rem;
    }
    .ord-meta { display:flex; gap:20px; align-items:center; }
    .ord-total {
      font-size:1.1rem; font-weight:700; letter-spacing:.05em;
      color:var(--primary-color,#ffd000);
    }
    .ord-total-label {
      font-size:.6rem; letter-spacing:.15em; text-transform:uppercase;
      color:var(--text-secondary,#aaa); display:block;
    }
    .ord-payment {
      font-size:.68rem; letter-spacing:.18em; text-transform:uppercase;
      padding: 4px 10px; border-radius:3px;
      background:rgba(255,255,255,0.05);
      color:var(--text-secondary,#aaa);
      border:1px solid rgba(255,255,255,0.08);
    }

    /* ── status badge ── */
    .ord-badge {
      font-size:.62rem; letter-spacing:.2em; text-transform:uppercase;
      padding:4px 10px; border-radius:3px; font-weight:600;
      border:1px solid; display:inline-block;
    }
    .ord-badge-Pending         { color:#f5c400; background:rgba(245,196,0,.1);  border-color:rgba(245,196,0,.3); }
    .ord-badge-Paid            { color:#4ade80; background:rgba(74,222,128,.08); border-color:rgba(74,222,128,.25); }
    .ord-badge-Packaged        { color:#60a5fa; background:rgba(96,165,250,.08); border-color:rgba(96,165,250,.25); }
    .ord-badge-Out\\ for\\ Delivery { color:#a78bfa; background:rgba(167,139,250,.08); border-color:rgba(167,139,250,.25); }
    .ord-badge-Delivered       { color:#34d399; background:rgba(52,211,153,.08); border-color:rgba(52,211,153,.25); }
    .ord-badge-Cancelled       { color:#f87171; background:rgba(248,113,113,.08); border-color:rgba(248,113,113,.25); }

    /* ── items section ── */
    .ord-items {
      padding: 14px 20px;
      display: flex; flex-wrap: wrap; gap: 12px;
    }

    .ord-item {
      display:flex; gap:12px; align-items:center;
      padding:10px 14px;
      border:1px solid rgba(255,255,255,0.05);
      border-radius:6px;
      background:rgba(255,255,255,0.015);
      flex: 1 1 280px;
      transition: border-color .2s;
    }
    .ord-item:hover { border-color: rgba(255,208,0,0.15); }

    .ord-thumb {
      width:52px; height:52px; border-radius:5px;
      object-fit:cover;
      border:1px solid rgba(255,208,0,0.15);
      flex-shrink:0;
      background:#111;
    }
    .ord-thumb-ph {
      width:52px; height:52px; border-radius:5px;
      border:1px dashed rgba(255,208,0,0.15);
      background:rgba(255,208,0,0.04);
      flex-shrink:0;
      display:flex; align-items:center; justify-content:center;
      font-size:.55rem; letter-spacing:.1em; color:rgba(255,208,0,0.25);
    }

    .ord-item-name {
      font-size:.95rem; font-weight:600; letter-spacing:.05em;
      text-transform:uppercase; color:var(--text-primary,#fff);
      white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
    }
    .ord-item-sub {
      font-size:.7rem; letter-spacing:.15em; text-transform:uppercase;
      color:var(--text-secondary,#aaa); margin-top:3px;
    }
    .ord-item-price {
      font-size:.88rem; font-weight:700;
      color:var(--primary-color,#ffd000); margin-top:4px;
    }

    /* ── card footer ── */
    .ord-footer {
      display:flex; align-items:center; justify-content:space-between;
      padding:12px 20px;
      border-top:1px solid rgba(255,255,255,0.05);
      background:rgba(255,255,255,0.015);
    }
    .ord-footer-label {
      font-size:.65rem; letter-spacing:.25em; text-transform:uppercase;
      color:var(--text-secondary,#aaa);
    }

    /* ── status select ── */
    .ord-select {
      background:var(--bg-main,#080808);
      border:1px solid rgba(255,208,0,0.25);
      border-radius:4px;
      color:var(--text-primary,#fff);
      font-size:.78rem; font-family:inherit;
      letter-spacing:.15em; text-transform:uppercase;
      padding:8px 32px 8px 12px;
      outline:none; cursor:pointer; appearance:none;
      background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23ffd000' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
      background-repeat:no-repeat; background-position:right 10px center;
      transition:border-color .2s;
    }
    .ord-select:focus { border-color:rgba(255,208,0,0.6); }

    /* ── skeleton ── */
    .ord-skeleton {
      max-width:1020px; margin:0 auto 14px;
      height:140px; border-radius:8px;
      background:linear-gradient(90deg,
        rgba(255,255,255,.03) 25%,
        rgba(255,208,0,.05) 50%,
        rgba(255,255,255,.03) 75%);
      background-size:200% 100%;
      animation:shimmer 1.4s infinite;
    }
    @keyframes shimmer {
      from { background-position:200% 0; }
      to   { background-position:-200% 0; }
    }

    /* ── empty ── */
    .ord-empty {
      max-width:1020px; margin:80px auto; text-align:center;
    }
    .ord-empty-icon { font-size:3rem; color:rgba(255,208,0,0.15); margin-bottom:16px; }
    .ord-empty-text { font-size:1.4rem; letter-spacing:.2em; text-transform:uppercase;
      color:var(--text-secondary,#aaa); }
    .ord-empty-sub { font-size:.75rem; letter-spacing:.18em; text-transform:uppercase;
      color:rgba(255,255,255,.18); margin-top:8px; }

    /* ── progress track ── */
    .ord-progress {
      display:flex; align-items:center; gap:0;
      padding:0 20px 14px;
    }
    .ord-step { display:flex; flex-direction:column; align-items:center; flex:1; }
    .ord-step-dot {
      width:8px; height:8px; border-radius:50%;
      background:rgba(255,255,255,0.12);
      border:1px solid rgba(255,255,255,0.15);
      transition:background .3s, border-color .3s;
      position:relative; z-index:1;
    }
    .ord-step-dot.active {
      background:var(--primary-color,#ffd000);
      border-color:var(--primary-color,#ffd000);
      box-shadow:0 0 8px rgba(255,208,0,0.5);
    }
    .ord-step-dot.done {
      background:rgba(255,208,0,0.35);
      border-color:rgba(255,208,0,0.5);
    }
    .ord-step-line {
      flex:1; height:1px; margin-top:-4px;
      background:rgba(255,255,255,0.08);
      transition:background .3s;
    }
    .ord-step-line.done { background:rgba(255,208,0,0.4); }
    .ord-step-name {
      font-size:.55rem; letter-spacing:.12em; text-transform:uppercase;
      color:var(--text-secondary,#aaa); margin-top:5px; text-align:center;
    }
    .ord-step-name.active { color:var(--primary-color,#ffd000); }

    @media(max-width:640px){
      .ord-page { padding:32px 16px; }
      .ord-topbar { flex-direction:column; align-items:flex-start; gap:10px; }
      .ord-progress { display:none; }
    }
  `;
  document.head.appendChild(s);
};

/* ── status pipeline ── */
const STEPS = ["Pending", "Paid", "Packaged", "Out for Delivery", "Delivered"];
const stepIndex = (s) => STEPS.indexOf(s);

const StatusProgress = ({ status }) => {
  if (status === "Cancelled") return (
    <div style={{ padding: "10px 20px 14px", display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: ".65rem", letterSpacing: ".2em", textTransform: "uppercase", color: "#f87171" }}>
        ✕ Order Cancelled
      </span>
    </div>
  );

  const cur = stepIndex(status);
  return (
    <div className="ord-progress">
      {STEPS.map((step, i) => (
        <div key={step} style={{ display: "flex", alignItems: "center", flex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div className={`ord-step-dot ${i === cur ? "active" : i < cur ? "done" : ""}`} />
            <span className={`ord-step-name ${i === cur ? "active" : ""}`}>{step}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`ord-step-line ${i < cur ? "done" : ""}`}
              style={{ flex: 1, height: 1, marginBottom: 18 }} />
          )}
        </div>
      ))}
    </div>
  );
};

/* ── lazy product image ── */
const ProductImage = ({ productId, cache, setCache }) => {
  const [img, setImg] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (cache[productId]) { setImg(cache[productId]); return; }
      try {
        const res = await axios.get(`https://inf-1-udgs.onrender.com/products/fetch/${productId}`);
        if (res.data.success && !cancelled) {
          const url = res.data.theproduct?.images?.[0] || "";
          setCache((p) => ({ ...p, [productId]: url }));
          setImg(url);
        }
      } catch (_) {}
    };
    load();
    return () => { cancelled = true; };
  }, [productId]);

  return img
    ? <img src={img} alt="" className="ord-thumb" />
    : <div className="ord-thumb-ph">IMG</div>;
};

/* ─── main component ──────────────────────────────────────── */
const Orders = () => {
  injectCSS();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cache, setCache] = useState({});
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const res = await axios.get("https://inf-1-udgs.onrender.com/orders/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setOrders(res.data.orders);
      else toast.error("Failed to fetch orders");
    } catch (err) {
      console.log(err);
      toast.error("Error loading orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await axios.put(
        `https://inf-1-udgs.onrender.com/orders/update/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setOrders((prev) => prev.map((o) => o._id === id ? { ...o, status } : o));
      }
    } catch (err) {
      console.log(err);
      toast.error("Update failed");
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  return (
    <div className="ord-page">

      {/* ── Header ── */}
      <div className="ord-header">
        <div>
          <h1 className="ord-title">Order<span> Board</span></h1>
          <p className="ord-sub">Manage & fulfil customer orders</p>
        </div>
        <span className="ord-count">
          {loading ? "—" : `${orders.length} order${orders.length !== 1 ? "s" : ""}`}
        </span>
      </div>

      {/* ── Skeletons ── */}
      {loading && [1, 2, 3].map((i) => (
        <div key={i} className="ord-skeleton" style={{ animationDelay: `${i * 0.13}s` }} />
      ))}

      {/* ── Empty ── */}
      {!loading && orders.length === 0 && (
        <div className="ord-empty">
          <div className="ord-empty-icon">◻</div>
          <p className="ord-empty-text">No orders yet</p>
          <p className="ord-empty-sub">Orders will appear here once customers check out</p>
        </div>
      )}

      {/* ── Order cards ── */}
      {!loading && orders.map((order) => (
        <div key={order._id} className="ord-card">

          {/* top bar */}
          <div className="ord-topbar">
            <div className="ord-id">
              Order <strong>#{order._id.slice(-8).toUpperCase()}</strong>
            </div>
            <div className="ord-meta">
              <div>
                <span className="ord-total-label">KES</span>
                <span className="ord-total">{Number(order.totalAmount).toLocaleString()}</span>
              </div>
              <span className="ord-payment">{order.paymentMethod}</span>
              <span className={`ord-badge ord-badge-${order.status.replace(/ /g, "\\ ")}`}>
                {order.status}
              </span>
            </div>
          </div>

          {/* progress track */}
          <StatusProgress status={order.status} />

          {/* items */}
          <div className="ord-items">
            {order.items.map((item, i) => (
              <div key={i} className="ord-item">
                <ProductImage productId={item.productId} cache={cache} setCache={setCache} />
                <div style={{ minWidth: 0 }}>
                  <div className="ord-item-name">{item.name}</div>
                  <div className="ord-item-sub">Qty: {item.quantity}</div>
                  <div className="ord-item-price">KES {Number(item.price).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>

          {/* footer / status update */}
          <div className="ord-footer">
            <span className="ord-footer-label">Update status</span>
            <select
              className="ord-select"
              value={order.status}
              onChange={(e) => updateStatus(order._id, e.target.value)}
            >
              {["Pending", "Paid", "Packaged", "Out for Delivery", "Delivered", "Cancelled"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

        </div>
      ))}
    </div>
  );
};

export default Orders;