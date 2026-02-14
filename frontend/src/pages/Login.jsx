import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");

    try {
      await login(email, password); // ✅ only this
      navigate("/dashboard");
    } catch (err) {
      setMsg(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "60px auto", fontFamily: "Arial" }}>
      <h2>Login</h2>
      {msg && <p style={{ color: "red" }}>{msg}</p>}

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />
        <button style={{ width: "100%", padding: 10 }}>Login</button>
      </form>

      <p style={{ marginTop: 12 }}>
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
