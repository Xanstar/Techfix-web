import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import TicketsPanel from "./TicketsPanel";
import ServicesPanel from "./ServicesPanel";

export default function AdminDashboard() {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("tickets");
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate("/admin/login", { replace: true });
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (profile?.role !== "admin") {
        navigate("/", { replace: true });
        return;
      }

      setAuthorized(true);
      setLoading(false);
    };

    init();
  }, [navigate]);

  if (loading || !authorized) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 font-mono">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          Panel de Administración
        </h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setTab("tickets")}
            className={`px-4 py-2 rounded ${
              tab === "tickets" ? "bg-blue-600" : "bg-slate-800"
            }`}
          >
            Tickets
          </button>

          <button
            onClick={() => setTab("services")}
            className={`px-4 py-2 rounded ${
              tab === "services" ? "bg-blue-600" : "bg-slate-800"
            }`}
          >
            Servicios internos
          </button>
        </div>

        {tab === "tickets" && <TicketsPanel />}
        {tab === "services" && <ServicesPanel />}
      </div>
    </div>
  );
}
