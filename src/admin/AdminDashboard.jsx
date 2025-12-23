import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTickets = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error cargando tickets:", error);
        setTickets([]);
      } else {
        // 🔥 NORMALIZAMOS STATUS
        setTickets(
          (data ?? []).map(t => ({
            ...t,
            status: t.status || "recibido"
          }))
        );
      }

      setLoading(false);
    };

    loadTickets();
  }, []);

  const handleStatusChange = async (ticketId, newStatus) => {
    // 🟢 1. UPDATE LOCAL INMEDIATO
    setTickets(prev =>
      prev.map(ticket =>
        ticket.id === ticketId
          ? { ...ticket, status: newStatus }
          : ticket
      )
    );

    // 🟡 2. SYNC CON BACKEND (NO BLOQUEA UI)
    const { error } = await supabase.functions.invoke(
      "update-ticket-status",
      {
        body: {
          ticket_id: ticketId,
          new_status: newStatus
        }
      }
    );

    if (error) {
      console.error("Error actualizando estado:", error);
      // opcional: revertir estado si querés
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 font-mono">
      <h1 className="text-2xl mb-6">PANEL_ADMIN</h1>

      {loading && <p>Cargando tickets...</p>}

      {!loading && tickets.length === 0 && (
        <p>No hay tickets todavía</p>
      )}

      {!loading && tickets.length > 0 && (
        <table className="w-full border">
          <thead>
            <tr>
              <th>Código</th>
              <th>Cliente</th>
              <th>Servicio</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(t => (
              <tr key={t.id}>
                <td>{t.ticket_code}</td>
                <td>{t.customer_name}</td>
                <td>{t.issue_type}</td>
                <td>
                  <select
                    value={t.status}
                    onChange={(e) =>
                      handleStatusChange(t.id, e.target.value)
                    }
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1"
                  >
                    <option value="recibido">Recibido</option>
                    <option value="en_proceso">En proceso</option>
                    <option value="resuelto">Resuelto</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
