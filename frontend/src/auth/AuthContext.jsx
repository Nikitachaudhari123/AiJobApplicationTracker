import { createContext, useContext, useEffect, useState } from "react";
import client from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [msg, setMsg] = useState("");
  const [dark, setDark] = useState(localStorage.getItem("dark") === "true");

  useEffect(() => {
    document.body.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("dark", dark);
  }, [dark]);

  useEffect(() => {
    token
      ? localStorage.setItem("token", token)
      : localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    user
      ? localStorage.setItem("user", JSON.stringify(user))
      : localStorage.removeItem("user");
  }, [user]);

  async function register(name, email, password) {
  return client.post("/auth/register", {
    name,
    email,
    password,
  });
}


  async function login(email, password) {
    const res = await client.post("/auth/login", { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
  }

  function logout() {
    setToken("");
    setUser(null);
    setJobs([]);
  }

 async function fetchJobs(page = 1) {
  try {
    const res = await client.get(`/jobs?page=${page}`);
    setJobs(res.data.data);
    setHasNext(res.data.data.length === 10);
  } catch (err) {
    setMsg("Failed to load jobs");
  }
}
useEffect(() => {
  if (!token) return;

  fetchJobs(page);
}, [token, page]);


  async function addJob(job) {
    await client.post("/jobs", job, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchJobs(page);
  }

  async function updateStatus(id, status) {
    await client.put(`/jobs/${id}`, { status }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchJobs(page);
  }

  async function deleteJob(id) {
    await client.delete(`/jobs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchJobs(page);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        jobs,
        page,
        hasNext,
        msg,
        dark,
        setDark,
        login,
        logout,
        addJob,
        updateStatus,
        deleteJob,
        setPage,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
