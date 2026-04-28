import { Link } from "react-router-dom";
import { MdAddchart, MdAddBusiness } from "react-icons/md";
import { FaList } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <aside className="beo-sidebar">

      <div className="beo-sidebar-title">MENU</div>

      <Link to="/add" className="beo-side-link">
        <MdAddchart className="beo-icon" />
        <span className="beo-label">Add Product</span>
      </Link>

      <Link to="/list" className="beo-side-link">
        <FaList className="beo-icon" />
        <span className="beo-label">Products</span>
      </Link>

      <Link to="/orders" className="beo-side-link">
        <MdAddBusiness className="beo-icon" />
        <span className="beo-label">Orders</span>
      </Link>

    </aside>
  );
};

export default Sidebar;