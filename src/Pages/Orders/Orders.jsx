import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [productCache, setProductCache] = useState({});
  const token = localStorage.getItem("token");

  // =========================
  // FETCH ORDERS
  // =========================
  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "https://inf-1-udgs.onrender.com/orders/all",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setOrders(res.data.orders);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (err) {
      console.log(err);
      toast.error("Error loading orders");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FETCH PRODUCT BY ID
  // =========================
  const getProduct = async (productId) => {
    try {
      if (productCache[productId]) return productCache[productId];

      const res = await axios.get(
        `https://inf-1-udgs.onrender.com/products/fetch/${productId}`
      );

      if (res.data.success) {
        const product = res.data.theproduct;

        setProductCache((prev) => ({
          ...prev,
          [productId]: product,
        }));

        return product;
      }
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // STATUS UPDATE
  // =========================
  const updateStatus = async (id, status) => {
    try {
      const res = await axios.put(
        `https://inf-1-udgs.onrender.com/orders/update/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === id ? { ...o, status } : o
          )
        );
      }
    } catch (err) {
      console.log(err);
      toast.error("Update failed");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // =========================
  // LOADING STATES
  // =========================
  if (loading) return <p>Loading...</p>;
  if (!orders.length) return <p>No orders found</p>;

  // =========================
  // PRODUCT IMAGE COMPONENT
  // =========================
  const ProductImage = ({ productId }) => {
    const [img, setImg] = useState("");

    useEffect(() => {
      const load = async () => {
        const product = await getProduct(productId);
        setImg(product?.images?.[0] || "");
      };

      load();
    }, [productId]);

    return (
      <img
        src={img}
        alt="product"
        width="60"
        height="60"
        style={{
          objectFit: "cover",
          borderRadius: "8px",
          background: "#222",
        }}
      />
    );
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="orders-container">
      <h2 className="orders-title">Orders</h2>

      {orders.map((order) => (
        <div key={order._id} className="order-card">

          <div className="order-header">
            <p><b>ID:</b> {order._id}</p>
            <span>{order.status}</span>
          </div>

          <p><b>Payment:</b> {order.paymentMethod}</p>
          <p><b>Total:</b> KES {order.totalAmount}</p>

          {/* ITEMS */}
          <div className="items">

            {order.items.map((item, i) => (
              <div key={i} className="item">

                {/* IMAGE FROM PRODUCT ID */}
                <ProductImage productId={item.productId} />

                <div>
                  <p>{item.name}</p>
                  <small>Qty: {item.quantity}</small>
                  <p>KES {item.price}</p>
                </div>

              </div>
            ))}

          </div>

          {/* STATUS */}
          <select
            value={order.status}
            onChange={(e) =>
              updateStatus(order._id, e.target.value)
            }
          >
            <option>Pending</option>
            <option>Paid</option>
            <option>Packaged</option>
            <option>Out for Delivery</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>

        </div>
      ))}
    </div>
  );
};

export default Orders;