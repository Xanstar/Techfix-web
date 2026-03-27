import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function TicketsPanel() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTickets();
  }, []);

  // 📦 CARGAR TICKETS
  async function loadTickets() {
    setLoading(true);

    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error cargando tickets:", error);
      setTickets([]);
    } else {
      setTickets(
        (data ?? []).map(t => ({
          ...t,
          status: t.status || "recibido",
        }))
      );
    }

    setLoading(false);
  }

  // 🔄 CAMBIO DE ESTADO
  async function handleStatusChange(ticketId, newStatus) {
    setTickets(prev =>
      prev.map(t =>
        t.id === ticketId ? { ...t, status: newStatus } : t
      )
    );

    const { error } = await supabase
      .from("tickets")
      .update({ status: newStatus })
      .eq("id", ticketId);

    if (error) {
      console.error("Error actualizando estado:", error);
      loadTickets();
    }
  }

  // 🗑 ELIMINAR TICKET
  async function deleteTicket(id) {
    const ok = window.confirm("¿Eliminar este ticket?");
    if (!ok) return;

    const { error } = await supabase
      .from("tickets")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Error al eliminar ticket");
      return;
    }

    setTickets(prev => prev.filter(t => t.id !== id));
  }

  // 📥 EXPORTAR EXCEL
  function exportToExcel() {
    if (tickets.length === 0) {
      alert("No hay tickets para exportar");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(tickets);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tickets");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(blob, "tickets.xlsx");
  }

  // ⏳ LOADING
  if (loading) {
    return <p>Cargando tickets...</p>;
  }

  if (tickets.length === 0) {
    return <p>No hay tickets todavía</p>;
  }

  return (
    <div className="space-y-4">
      {/* 📥 EXCEL */}
      <button
        onClick={exportToExcel}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
      >
        Descargar Excel
      </button>

      {/* 📱 MOBILE */}
      <div className="space-y-4 md:hidden">
        {tickets.map(t => (
          <div
            key={t.id}
            className="bg-slate-900 border border-slate-700 rounded p-4"
          >
            <p className="text-slate-400 text-sm">
              Código: {t.ticket_code}
            </p>

            <p className="font-semibold">{t.customer_name}</p>
            <p className="text-sm">Servicio: {t.issue_type}</p>

            <select
              value={t.status}
              onChange={e =>
                handleStatusChange(t.id, e.target.value)
              }
              className="mt-3 w-full bg-slate-950 border border-slate-700 rounded px-2 py-2"
            >
              <option value="recibido">Recibido</option>
              <option value="en_proceso">En proceso</option>
              <option value="resuelto">Resuelto</option>
            </select>

            <button
              onClick={() => deleteTicket(t.id)}
              className="mt-3 text-red-400 hover:text-red-600 text-sm"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

      {/* 🖥 DESKTOP */}
      <div className="hidden md:block">
        <table className="w-full border border-slate-700">
          <thead>
            <tr className="bg-slate-900">
              <th className="p-2 border">Código</th>
              <th className="p-2 border">Cliente</th>
              <th className="p-2 border">Servicio</th>
              <th className="p-2 border">Estado</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(t => (
              <tr key={t.id} className="hover:bg-slate-900">
                <td className="p-2 border">{t.ticket_code}</td>
                <td className="p-2 border">{t.customer_name}</td>
                <td className="p-2 border">{t.issue_type}</td>
                <td className="p-2 border">
                  <select
                    value={t.status}
                    onChange={e =>
                      handleStatusChange(t.id, e.target.value)
                    }
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1"
                  >
                    <option value="recibido">Recibido</option>
                    <option value="en_proceso">En proceso</option>
                    <option value="resuelto">Resuelto</option>
                  </select>
                </td>
                <td className="p-2 border">
                  <button
                    onClick={() => deleteTicket(t.id)}
                    className="text-red-400 hover:text-red-600 text-sm"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
