import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";
import api from "./api";

export default function History({ hallId }) {
  const [date, setDate] = useState(new Date().toLocaleDateString("en-CA"));
  const [data, setData] = useState([]);

  useEffect(() => {
    const load = () =>
      api.get(`/history/?hall=${hallId}&date=${date}`).then((r) => setData(r.data));
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [hallId, date]);

  return (
    <div style={{ background: "white", padding: 24, borderRadius: 12, marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0 }}>Hourly history</h3>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div style={{ width: "100%", height: 300, marginTop: 16 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="entries" name="Entries" fill="#16a34a" />
            <Bar dataKey="exits" name="Exits" fill="#dc2626" />
            <Bar dataKey="inside" name="People inside" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}