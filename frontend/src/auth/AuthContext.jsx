import { createContext, useContext, useEffect, useState } from "react";
import client from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // Jobs state
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 5;
  const [hasNext, setHasNext] = useState(false);
  const [msg, setMsg] = useState("");

  // Dark mode
  const [dark, setDark] = useState(() => localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    localStorage.setItem("darkMode", String(dark));
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    token ? localStorage.setItem("token", token) : localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    user ? localStorage.setItem("user", JSON.stringify(user)) : localStorage.removeItem("user");
  }, [user]);

  async function register(name, email, password) {
    const res = await client.post("/auth/register", { name, email, password });
    return res.data;
  }

  async function login(email, password) {
    const res = await client.post("/auth/login", { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    setMsg("");
    return res.data;
  }

  function logout() {
    setToken("");
    setUser(null);
    setJobs([]);
    setMsg("");
  }

  // ✅ Fetch jobs whenever token/page changes
  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        setMsg("");
        const res = await client.get(`/jobs?page=${page}&limit=${limit}`);
        const list = res.data?.data || [];
        setJobs(list);

        // if API returns hasNext, use it; otherwise infer
        if (typeof res.data?.hasNext === "boolean") {
          setHasNext(res.data.hasNext);
        } else {
          setHasNext(list.length === limit);
        }
      } catch (err) {
        setMsg(err?.response?.data?.message || "Failed to load jobs");
      }
    })();
  }, [token, page]);

  // ✅ AI Level 1.1: create job + store ai + keywords + skills
  async function addJob(payload) {
    try {
      setMsg("");

      const body = {
        job_title: payload.job_title,
        company: payload.company,
        job_description: payload.job_description || "",
        status: "applied",

        // NEW columns (JSON)
        keywords_json: payload.keywords || [],
        ai_analysis_json: payload.ai_analysis || null,
      };

      // 1) Create job
      const jobRes = await client.post("/jobs", body);
      const id = jobRes?.data?.data?.id;

      // 2) Attach skills
      if (id && Array.isArray(payload.skills) && payload.skills.length) {
        await client.post(`/jobs/${id}/skills`, { skills: payload.skills });
      }

      // 3) Refresh list
      const res = await client.get(`/jobs?page=${page}&limit=${limit}`);
      const list = res.data?.data || [];
      setJobs(list);
      setHasNext(typeof res.data?.hasNext === "boolean" ? res.data.hasNext : list.length === limit);
    } catch (err) {
      setMsg(err?.response?.data?.message || "Failed to add job");
    }
  }

  async function updateStatus(id, status) {
    try {
      setMsg("");
      await client.put(`/jobs/${id}`, { status });

      setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status } : j)));
    } catch (err) {
      setMsg(err?.response?.data?.message || "Failed to update status");
    }
  }

  async function deleteJob(id) {
    try {
      setMsg("");
      await client.delete(`/jobs/${id}`);
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (err) {
      setMsg(err?.response?.data?.message || "Failed to delete job");
    }
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        register,
        login,
        logout,

        jobs,
        addJob,
        updateStatus,
        deleteJob,

        page,
        setPage,
        hasNext,
        msg,

        dark,
        setDark,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
