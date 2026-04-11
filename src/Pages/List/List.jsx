import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./List.css";

const List = () => {
  const [products, setProducts] = useState([]);

  // ✅ Fetch products
  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://inf-ct8e.onrender.com/products/fetch");
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to fetch products");
    }
  };

  // ✅ Remove product
  const removeProduct = async (itemId) => {
    try {
      const response = await axios.delete(
        `https://inf-ct8e.onrender.com/products/remove/${itemId}`
      );

      if (response.data.success) {
        toast.success("Product removed");
        // Refresh the product list after deletion
        setProducts((prev) => prev.filter((item) => item._id !== itemId));
      } else {
        toast.error(response.data.message);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to remove product");
    }
  };

  // ✅ Fetch products once on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="list">
    
      <div className="products">
        {products.length > 0 ? (
          products.map((item, index) => (
            <div key={index} className="product-item">
              <img
                src={item.images?.[0] }
                alt={item.name}
                style={{ width: "60px", height: "60px", objectFit: "cover" }}
              />
              <p>{item.name}</p>
              <p>{item.price}</p>
              <p
                onClick={() => removeProduct(item._id)}
                style={{ cursor: "pointer", color: "red" }}
              >
                X
              </p>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default List;
