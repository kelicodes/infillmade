import { useState } from "react";
import { assets } from "../../assets/asssets.js";
import { toast } from "react-toastify";
import axios from "axios";
import "./Add.css";
import AddingProduct from "../../Components/AddingProduct/AddingProduct.jsx";

const Add = () => {
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

    if (loading) return; // 🚫 stop double clicks

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
        "https://inf-ct8e.onrender.com/products/upload",
        formdata,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success(response.data.message);

      // reset form
      setName("");
      setPrice("");
      setDesc("");
      setCategory("");
      setImage1(null);
      setImage2(null);
      setImage3(null);
      setImage4(null);

    } catch (error) {
      console.log(error);
      toast.error("Product upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🔄 SPINNER OVERLAY */}
      {loading && <AddingProduct />}

      <form onSubmit={handlesubmit} className="add">
        <div className="imageupload">
          <label htmlFor="image1" className="image">
            <input
              type="file"
              id="image1"
              hidden
              onChange={(e) => setImage1(e.target.files[0])}
            />
            <img src={!image1 ? assets.upload : URL.createObjectURL(image1)} />
          </label>

          <label htmlFor="image2" className="image">
            <input
              type="file"
              id="image2"
              hidden
              onChange={(e) => setImage2(e.target.files[0])}
            />
            <img src={!image2 ? assets.upload : URL.createObjectURL(image2)} />
          </label>

          <label htmlFor="image3" className="image">
            <input
              type="file"
              id="image3"
              hidden
              onChange={(e) => setImage3(e.target.files[0])}
            />
            <img src={!image3 ? assets.upload : URL.createObjectURL(image3)} />
          </label>

          <label htmlFor="image4" className="image">
            <input
              type="file"
              id="image4"
              hidden
              onChange={(e) => setImage4(e.target.files[0])}
            />
            <img src={!image4 ? assets.upload : URL.createObjectURL(image4)} />
          </label>
        </div>

        <div className="nameprice">
          <div className="name">
            <label>Name</label>
            <input
              type="text"
              value={name}
              placeholder="name of product"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="name">
            <label>Price</label>
            <input
              type="text"
              value={price}
              placeholder="price"
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>

        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="product description"
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select category</option>
          <option value="Hoodie">Bags</option>
          <option value="T-shirts/shirts">Accessories</option>
          <option value="Jeans">Skirts/Dresses</option>
          <option value="combo">Combo</option>
        </select>

        <button disabled={loading}>
          {loading ? "Adding..." : "Submit"}
        </button>
      </form>
    </>
  );
};

export default Add;
