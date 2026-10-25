import History from "./History";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

export default function Dashboard() {
  const [halls, setHalls] = useState([]);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const load = async () => {
    try {
      const [h, e] = await Promise.all([api.get("/halls/"), api.get("/events/")]);
      setHalls(h.data);
      setEvents(e.data);
    } catch {
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  useEffect(() => {
    load();
    const timer = setInterval(load, 3000); // refresh every 3 seconds
    return () => clearInterval(timer);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Person Counter Dashboard</h1>
        <button onClick={logout}>Logout</button>
      </div>

      {halls.map((h) => {
        const pct = Math.min((h.current_count / h.capacity) * 100, 100);
        const color = pct > 90 ? "#dc2626" : pct > 70 ? "#f59e0b" : "#16a34a";
        return (
          <div key={h.id} style={{ background: "white", padding: 24, borderRadius: 12, marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <h2 style={{ marginTop: 0 }}>{h.name}</h2>
            <div style={{ fontSize: 48, fontWeight: "bold", color }}>{h.current_count}</div>
            <p style={{ margin: "4px 0 12px" }}>people inside (capacity {h.capacity})</p>
            <div style={{ background: "#e2e8f0", borderRadius: 8, height: 14 }}>
              <div style={{ width: `${pct}%`, background: color, height: 14, borderRadius: 8, transition: "width 0.5s" }} />
            </div>
          </div>
        );
      })}
   {halls.length > 0 && <History hallId={halls[0].id} />}
      <div style={{ background: "white", padding: 24, borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
        <h3 style={{ marginTop: 0 }}>Recent activity</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "2px solid #e2e8f0" }}>
              <th>#</th><th>Type</th><th>Time</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td>{e.id}</td>
                <td style={{ color: e.type === "IN" ? "#16a34a" : "#dc2626", fontWeight: "bold" }}>
                  {e.type === "IN" ? "Entry" : "Exit"}
                </td>
                <td>{new Date(e.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}