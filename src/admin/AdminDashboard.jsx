import TicketsTable from "./TicketsTable";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 font-mono">
      <h1 className="text-2xl mb-6 text-cyan-400">
        GESTIÓN DE TICKETS
      </h1>

      <TicketsTable />
    </div>
  );
}
