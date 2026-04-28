import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";

import Add from "./Pages/Add/Add.jsx";
import List from "./Pages/List/List.jsx";
import Login from "./Pages/Login/Login.jsx";
import Navbar from "./Components/Navbar/Navbar.jsx";
import Sidebar from "./Components/Sidebar/Sidebar.jsx";
import Orders from "./Pages/Orders/Orders.jsx";


const App = () => {
  const location = useLocation();
  const [paid, setPaid] = useState(true);


  const isLoginPage = location.pathname === "/Login" || location.pathname === "/";

  if (!paid) {
    return <p>G</p>;
  }

 return (
  <div className="app-layout">
    {!isLoginPage && <Navbar />}

    <div className="app-body">
      {!isLoginPage && <Sidebar />}

      <main className="app-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/add" element={<Add />} />
          <Route path="/list" element={<List />} />
          <Route path="/orders" element={<Orders />} />
       
        </Routes>
      </main>
    </div>
  </div>
);
};

export default App;