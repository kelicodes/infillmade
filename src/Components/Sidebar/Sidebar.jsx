import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdAddchart } from "react-icons/md";
import { FaList } from "react-icons/fa";
import { MdAddBusiness } from "react-icons/md";
import "./Sidebar.css";

export const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to="/add" className="side-link">
        <MdAddchart className="icon" />
        <p>Add</p>
      </Link>

      <Link to="/list" className="side-link">
        <FaList className="icon" />
        <p>List</p>
      </Link>

      <Link to="/orders" className="side-link">
        <MdAddBusiness className="icon" />
        <p>Orders</p>
      </Link>
    </div>
  );
};

export default Sidebar;
