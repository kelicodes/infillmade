import { useState } from "react";
import { assets } from "../../assets/asssets.js";
import { toast } from "react-toastify";
import axios from "axios";
import AddingProduct from "../../Components/AddingProduct/AddingProduct.jsx";

/* ── inline styles keep this self-contained ── */
const S = {
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)",
    zIndex: 1000,
    display: "flex", alignItems: "center", justifyContent: "center",
  },

  page: {
    minHeight: "100vh",
    padding: "48px 32px",
    display: "flex", flexDirection: "column", alignItems: "center",
    background: "var(--bg-main)",
    fontFamily: "'Barlow Condensed', 'Bebas Neue', sans-serif",
  },

  header: {
    width: "100%", maxWidth: 820,
    marginBottom: 40,
    display: "flex", alignItems: "flex-end", justifyContent: "space-between",
    borderBottom: "1px solid rgba(255,208,0,0.18)",
    paddingBottom: 20,
  },

  headerTitle: {
    fontSize: "clamp(2rem,5vw,3.6rem)",
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "var(--text-primary)",
    lineHeight: 1,
  },

  headerAccent: {
    color: "var(--primary-color)",
  },

  headerSub: {
    fontSize: "0.9rem",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "var(--text-secondary)",
  },

  form: {
    width: "100%", maxWidth: 820,
    display: "flex", flexDirection: "column", gap: 36,
  },

  /* ── IMAGE GRID ── */
  imageSection: {
    display: "flex", flexDirection: "column", gap: 12,
  },

  sectionLabel: {
    fontSize: "0.75rem",
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    color: "var(--primary-color)",
    fontWeight: 600,
  },

  imageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: 12,
  },

  imageSlot: (filled) => ({
    aspectRatio: "1 / 1",
    border: filled
      ? "2px solid var(--primary-color)"
      : "2px dashed rgba(255,208,0,0.25)",
    borderRadius: 6,
    overflow: "hidden",
    position: "relative",
    cursor: "pointer",
    background: filled ? "transparent" : "rgba(255,208,0,0.04)",
    transition: "border-color 0.2s, transform 0.2s",
    display: "flex", alignItems: "center", justifyContent: "center",
  }),

  imageImg: {
    width: "100%", height: "100%",
    objectFit: "cover",
    display: "block",
  },

  imageNumber: {
    position: "absolute", bottom: 6, right: 8,
    fontSize: "0.7rem",
    letterSpacing: "0.1em",
    color: "var(--primary-color)",
    opacity: 0.6,
    fontWeight: 700,
  },

  uploadIcon: {
    fontSize: "1.6rem",
    color: "rgba(255,208,0,0.3)",
    pointerEvents: "none",
    userSelect: "none",
  },

  /* ── FIELDS ── */
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
  },

  field: {
    display: "flex", flexDirection: "column", gap: 8,
  },

  fieldLabel: {
    fontSize: "0.72rem",
    letterSpacing: "0.28em",
    textTransform: "uppercase",
    color: "var(--text-secondary)",
    fontWeight: 600,
  },

  input: {
    background: "transparent",
    border: "none",
    borderBottom: "1.5px solid rgba(255,255,255,0.12)",
    color: "var(--text-primary)",
    fontSize: "1.05rem",
    padding: "10px 0",
    fontFamily: "inherit",
    letterSpacing: "0.05em",
    outline: "none",
    transition: "border-color 0.2s",
    width: "100%",
  },

  textarea: {
    background: "rgba(255,208,0,0.03)",
    border: "1.5px solid rgba(255,255,255,0.08)",
    borderRadius: 6,
    color: "var(--text-primary)",
    fontSize: "1rem",
    padding: "14px 16px",
    fontFamily: "inherit",
    letterSpacing: "0.04em",
    outline: "none",
    resize: "vertical",
    minHeight: 110,
    transition: "border-color 0.2s",
    width: "100%",
    lineHeight: 1.6,
  },

  select: {
    background: "var(--bg-main)",
    border: "1.5px solid rgba(255,255,255,0.08)",
    borderRadius: 6,
    color: "var(--text-primary)",
    fontSize: "1rem",
    padding: "12px 16px",
    fontFamily: "inherit",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    outline: "none",
    cursor: "pointer",
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='7' viewBox='0 0 12 7'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23ffd000' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 14px center",
    paddingRight: 38,
    width: "100%",
    transition: "border-color 0.2s",
  },

  /* ── FOOTER / SUBMIT ── */
  footer: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    paddingTop: 16,
    borderTop: "1px solid rgba(255,208,0,0.10)",
  },

  footerHint: {
    fontSize: "0.78rem",
    letterSpacing: "0.15em",
    color: "var(--text-secondary)",
    textTransform: "uppercase",
  },

  btn: (loading) => ({
    background: loading ? "rgba(255,208,0,0.4)" : "var(--primary-color)",
    color: "#000",
    border: "none",
    borderRadius: 4,
    padding: "14px 44px",
    fontSize: "1rem",
    fontFamily: "inherit",
    fontWeight: 700,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    cursor: loading ? "not-allowed" : "pointer",
    transition: "background 0.2s, transform 0.15s",
    outline: "none",
  }),
};

/* tiny CSS injected once */
const injectCSS = () => {
  if (document.getElementById("add-form-styles")) return;
  const tag = document.createElement("style");
  tag.id = "add-form-styles";
  tag.textContent = `
    .add-image-slot:hover { border-color: var(--primary-color) !important; transform: scale(1.03); }
    .add-input:focus { border-bottom-color: var(--primary-color) !important; }
    .add-textarea:focus { border-color: rgba(255,208,0,0.5) !important; }
    .add-select:focus { border-color: rgba(255,208,0,0.5) !important; }
    .add-btn:hover:not(:disabled) { transform: translateY(-2px); background: #ffe033 !important; }
    .add-btn:active:not(:disabled) { transform: translateY(0); }
    @media (max-width: 600px) {
      .add-image-grid { grid-template-columns: repeat(2,1fr) !important; }
      .add-row { grid-template-columns: 1fr !important; }
      .add-footer { flex-direction: column; gap: 16px; align-items: stretch !important; }
      .add-footer .add-btn { text-align: center; }
    }
  `;
  document.head.appendChild(tag);
};

const ImageSlot = ({ id, image, setImage, index }) => {
  injectCSS();
  return (
    <label
      htmlFor={id}
      className="add-image-slot"
      style={S.imageSlot(!!image)}
    >
      <input
        type="file"
        id={id}
        hidden
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />
      {image ? (
        <img src={URL.createObjectURL(image)} style={S.imageImg} alt="" />
      ) : (
        <span style={S.uploadIcon}>＋</span>
      )}
      <span style={S.imageNumber}>0{index}</span>
    </label>
  );
};

const Add = () => {
  injectCSS();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlesubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!image1 && !image2 && !image3 && !image4) {
      toast.error("At least one image is required");
      return;
    }
    try {
      setLoading(true);
      const formdata = new FormData();
      formdata.append("name", name);
      formdata.append("price", price);
      formdata.append("desc", desc);
      formdata.append("category", category);
      if (image1) formdata.append("image1", image1);
      if (image2) formdata.append("image2", image2);
      if (image3) formdata.append("image3", image3);
      if (image4) formdata.append("image4", image4);

      const response = await axios.post(
        "https://inf-1-udgs.onrender.com/products/upload",
        formdata,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success(response.data.message);
      setName(""); setPrice(""); setDesc(""); setCategory("");
      setImage1(null); setImage2(null); setImage3(null); setImage4(null);
    } catch (error) {
      console.log(error);
      toast.error("Product upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.page}>
      {loading && (
        <div style={S.overlay}>
          <AddingProduct />
        </div>
      )}

      {/* ── HEADER ── */}
      <div style={S.header}>
        <div>
          <h1 style={S.headerTitle}>
            New<span style={S.headerAccent}> Product</span>
          </h1>
          <p style={{ ...S.headerSub, marginTop: 6 }}>Add to catalogue</p>
        </div>
        <span style={S.headerSub}>Admin Panel</span>
      </div>

      {/* ── FORM ── */}
      <form onSubmit={handlesubmit} style={S.form}>

        {/* Images */}
        <div style={S.imageSection}>
          <span style={S.sectionLabel}>Product Images</span>
          <div className="add-image-grid" style={S.imageGrid}>
            <ImageSlot id="image1" image={image1} setImage={setImage1} index={1} />
            <ImageSlot id="image2" image={image2} setImage={setImage2} index={2} />
            <ImageSlot id="image3" image={image3} setImage={setImage3} index={3} />
            <ImageSlot id="image4" image={image4} setImage={setImage4} index={4} />
          </div>
        </div>

        {/* Name + Price */}
        <div className="add-row" style={S.row}>
          <div style={S.field}>
            <label style={S.fieldLabel}>Product Name</label>
            <input
              className="add-input"
              style={S.input}
              type="text"
              value={name}
              placeholder="e.g. Classic Hoodie"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div style={S.field}>
            <label style={S.fieldLabel}>Price (KES)</label>
            <input
              className="add-input"
              style={S.input}
              type="text"
              value={price}
              placeholder="e.g. 2500"
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Description */}
        <div style={S.field}>
          <label style={S.fieldLabel}>Description</label>
          <textarea
            className="add-textarea"
            style={S.textarea}
            value={desc}
            placeholder="Describe the product — material, fit, occasion..."
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>

        {/* Category */}
        <div style={S.field}>
          <label style={S.fieldLabel}>Category</label>
          <select
            className="add-select"
            style={S.select}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">— Select category —</option>
            <option value="Men">Hoodie</option>
            <option value="ladies">T-shirts / Shirts</option>
            <option value="unisex">Jeans</option>
            
          </select>
        </div>

        {/* Footer */}
        <div className="add-footer" style={S.footer}>
          <span style={S.footerHint}>
            {[image1, image2, image3, image4].filter(Boolean).length} / 4 images selected
          </span>
          <button
            type="submit"
            className="add-btn"
            style={S.btn(loading)}
            disabled={loading}
          >
            {loading ? "Uploading…" : "Publish Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Add;