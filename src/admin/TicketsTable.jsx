import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function TicketsTable() {
  const [tickets, setTickets] = useState([]);

  const loadTickets = async () => {
    const { data } = await supabase
      .from("tickets")
      .select("*")
      .order("created_at", { ascending: false });

    setTickets(data || []);
  };

  const updateStatus = async (id, status) => {
    await supabase
      .from("tickets")
      .update({ status })
      .eq("id", id);

    loadTickets();
  };

  const deleteTicket = async (id) => {
    if (!confirm("¿Eliminar ticket?")) return;

    await supabase
      .from("tickets")
      .delete()
      .eq("id", id);

    loadTickets();
  };

  useEffect(() => {
    loadTickets();
  }, []);

  return (
    <table className="w-full border border-cyan-800 text-sm">
      <thead className="bg-slate-900 text-cyan-400">
        <tr>
          <th className="p-2">Código</th>
          <th>Cliente</th>
          <th>Servicio</th>
          <th>Mensaje</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {tickets.map(t => (
          <tr key={t.id} className="border-t border-cyan-900">
            <td className="p-2">{t.ticket_code}</td>
            <td>{t.customer_name}</td>
            <td>{t.issue_type}</td>
            <td className="max-w-xs truncate">{t.message}</td>

            <td>
              <select
                value={t.status || "open"}
                onChange={(e) => updateStatus(t.id, e.target.value)}
                className="bg-slate-950 border border-cyan-900 text-white"
              >
                <option value="open">Abierto</option>
                <option value="in_progress">En proceso</option>
                <option value="closed">Cerrado</option>
              </select>
            </td>

            <td>
              <button
                onClick={() => deleteTicket(t.id)}
                className="text-red-500 hover:underline"
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
