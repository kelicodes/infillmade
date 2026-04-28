import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { MdAttachEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { SiNamecheap } from "react-icons/si";
import "./Login.css";

const Login = () => {
  const [logstate, setLogstate] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const submithandler = async (e) => {
    e.preventDefault();

    try {
      if (logstate === "signup") {
        const response = await axios.post(
          "https://inf-1-udgs.onrender.com/user/reg",
          { name, email, password }
        );

        if (response.data.success) {
          // Clear fields
          setEmail("");
          setName("");
          setPassword("");

          // Store token if returned
          if (response.data.token) {
            localStorage.setItem("token", response.data.token);
          }

          toast.success(response.data.message);
          navigate("/add"); // redirect to dashboard
        }
      } else if (logstate === "login") {
        const response = await axios.post(
          "https://inf-1-udgs.onrender.com/user/login",
          { email, password }
        );

        if (response.data.success) {
          // Clear fields
          setEmail("");
          setName("");
          setPassword("");

          // Store token in localStorage
          localStorage.setItem("token", response.data.token);
          toast.success(response.data.message);

          navigate("/add"); // redirect to dashboard
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Login/Signup failed");
    }
  };

  return (
    <form onSubmit={submithandler} className="Login">
      <div className="navbar-logo">
        <h2>
          Gold<span>Store</span>
        </h2>
      </div>

      {logstate === "signup" && (
        <div className="Name">
          <div className="Nameinput enter">
            <SiNamecheap />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              required
            />
          </div>
        </div>
      )}

      <div className="Email enter">
        <MdAttachEmail />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          required
        />
      </div>

      <div className="Password enter">
        <RiLockPasswordFill />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          required
        />
      </div>

      {logstate === "signup" ? (
        <p onClick={() => setLogstate("login")}>
          Already have an account? <span>Login</span>
        </p>
      ) : (
        <p onClick={() => setLogstate("signup")}>
          Don't have an account? <span>Sign Up</span>
        </p>
      )}

      <button className="btn">SUBMIT</button>
    </form>
  );
};

export default Login;
