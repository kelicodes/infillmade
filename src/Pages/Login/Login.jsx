import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { MdAttachEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { SiNamecheap } from "react-icons/si";
import "./Login.css";

const Login = () => {
  const [logstate, setLogstate] = useState("login");
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const submithandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (logstate === "signup") {
        const res = await axios.post(
          "https://inf-1-udgs.onrender.com/user/reg",
          { name, email, password }
        );

        if (res.data.success) {
          toast.success(res.data.message);
          navigate("/add");
        }
      } else {
        const res = await axios.post(
          "https://inf-1-udgs.onrender.com/user/login",
          { email, password }
        );

        if (res.data.success) {
          localStorage.setItem("token", res.data.token);
          toast.success(res.data.message);
          navigate("/add");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={submithandler} className="login-card">

        {/* LOGO */}
        <div className="logo">
          BEØ <span>STORE</span>
        </div>

        {/* NAME */}
        {logstate === "signup" && (
          <div className="input-box">
            <SiNamecheap />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        {/* EMAIL */}
        <div className="input-box">
          <MdAttachEmail />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* PASSWORD */}
        <div className="input-box">
          <RiLockPasswordFill />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* SWITCH */}
        <p className="switch">
          {logstate === "login" ? (
            <>
              Don’t have an account?{" "}
              <span onClick={() => setLogstate("signup")}>Sign up</span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span onClick={() => setLogstate("login")}>Login</span>
            </>
          )}
        </p>

        {/* BUTTON */}
        <button className="btn" disabled={loading}>
          {loading ? <span className="spinner"></span> : "ENTER BEØ"}
        </button>

      </form>
    </div>
  );
};

export default Login;