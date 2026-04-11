import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token"); // token only auth
      const response = await axios.get(
        "https://inf-ct8e.onrender.com/orders/all",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message || "Failed to fetch orders");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `https://thegoldfina.onrender.com/orders/update/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to update order status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p className="loading-text">Loading your orders...</p>;
  if (!orders || orders.length === 0)
    return <p className="no-orders-text">You have no orders yet.</p>;

  // Calculate total revenue
  const totalRevenue = orders.reduce(
    (acc, order) => acc + Number(order.totalAmount || 0),
    0
  );

  const allowedStatuses = [
    "Pending",
    "Paid",
    "Packaged",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h2 className="orders-title">My Orders</h2>
        <div className="total-revenue">
          Total Revenue: KES {totalRevenue.toLocaleString()}
        </div>
      </div>

      {orders.map((order) => (
        <div key={order._id} className="order-card">
          <div className="order-header">
            <p>
              <strong>Order ID:</strong> {order._id}
            </p>
            <span
              className={`order-status ${
                order.status?.toLowerCase().replace(/ /g, "-") || "pending"
              }`}
            >
              {order.status || "Pending"}
            </span>
          </div>

          <p>
            <strong>Payment Method:</strong> {order.paymentMethod}
          </p>
          <p>
            <strong>Total:</strong> KES {order.totalAmount}
          </p>

          <div className="order-items">
            <h4>Items:</h4>
            <div className="items-grid">
              {order.items.map((item) => (
                <div key={item.productId} className="item-card">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="item-image"
                  />
                  <p className="item-name">{item.name}</p>
                  <p className="item-qty">Qty: {item.quantity}</p>
                  <p className="item-price">KES {item.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Status update dropdown */}
          <div className="status-update">
            <label htmlFor={`status-${order._id}`}>Update Status:</label>
            <select
              id={`status-${order._id}`}
              value={order.status}
              onChange={(e) =>
                handleStatusChange(order._id, e.target.value)
              }
            >
              {allowedStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
