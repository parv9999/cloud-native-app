import { useEffect, useState } from "react";
import api from "../api/axios";

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    api
      .get("/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => setData(res.data))
      .catch(() => alert("Unauthorized"));
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default Dashboard;
