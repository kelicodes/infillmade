import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Mock.css";

const BASE_URL = "https://thegoldfina.onrender.com";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = () => localStorage.getItem("token");
  const getAuthHeader = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

  // Fetch orders from backend
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/orders/all`, getAuthHeader());
      if (res.data.success && res.data.orders) {
        const uniqueOrders = Array.from(new Map(res.data.orders.map(o => [o._id, o])).values());
        setOrders(uniqueOrders);
      } else {
        setOrders([]);
        toast.info("No orders found");
      }
    } catch (err) {
      console.error("Fetch Orders Error:", err);
      toast.error("Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${BASE_URL}/orders/${orderId}/status`,
        { status: newStatus },
        getAuthHeader()
      );
      setOrders(prev =>
        prev.map(order => (order._id === orderId ? { ...order, status: newStatus } : order))
      );
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error("Update Status Error:", err);
      toast.error("Failed to update order status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Calculate total funds
  const totalFunds = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

  if (loading) return <p className="loading-text">Loading your orders...</p>;
  if (!orders || orders.length === 0) return <p className="no-orders-text">You have no orders yet.</p>;

  const allowedStatuses = ["Pending", "Paid", "Packaged", "Out for Delivery", "Delivered", "Cancelled"];

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h2 className="orders-title">My Orders</h2>
        <div className="total-revenue">Total Funds: KES {totalFunds}</div>
      </div>

      {orders.map((order, orderIndex) => (
        <div key={`${order._id}-${orderIndex}`} className="order-card">
          <div className="order-header">
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <span className={`order-status ${order.status?.toLowerCase().replace(/ /g, "-") || "pending"}`}>
              {order.status || "Pending"}
            </span>
          </div>

          <p><strong>Payment Method:</strong> {order.paymentMethod || "N/A"}</p>
          <p><strong>Total:</strong> KES {order.totalAmount || 0}</p>

          <div className="order-items">
            <h4>Items:</h4>
            <div className="items-grid">
              {order.items?.map((item, itemIndex) => (
                <div key={`${item.productId}-${itemIndex}`} className="item-card">
                  <p className="item-name">{item.name || "Unknown"}</p>
                  <p className="item-qty">Qty: {item.quantity || 0}</p>
                  <p className="item-price">KES {item.price || 0}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="status-update">
            <label htmlFor={`status-${order._id}`}>Update Status:</label>
            <select
              id={`status-${order._id}`}
              value={order.status || "Pending"}
              onChange={(e) => handleStatusChange(order._id, e.target.value)}
            >
              {allowedStatuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
