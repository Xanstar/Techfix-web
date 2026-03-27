import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function ServicesPanel() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    device_type: "",
    brand_model: "",
    problem_description: "",
  });

  // 📦 CARGAR SERVICIOS
  const loadServices = async () => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error cargando servicios", error);
      return;
    }

    setServices(data ?? []);
  };

  useEffect(() => {
    loadServices();
  }, []);

  // 🛠 CREAR SERVICIO
  const createService = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("services").insert([
      {
        customer_name: form.customer_name,
        phone: form.phone,
        device_type: form.device_type,
        brand_model: form.brand_model,
        problem_description: form.problem_description,
        status: "ingresado",
      },
    ]);

    if (error) {
      console.error("❌ Error creando servicio:", error);
      alert("Error al crear servicio");
      setLoading(false);
      return;
    }

    await loadServices();

    setForm({
      customer_name: "",
      phone: "",
      device_type: "",
      brand_model: "",
      problem_description: "",
    });

    setLoading(false);
  };

  // 🗑 ELIMINAR SERVICIO
  const deleteService = async (id) => {
    const ok = window.confirm("¿Eliminar este servicio?");
    if (!ok) return;

    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Error al eliminar");
      return;
    }

    setServices(prev => prev.filter(s => s.id !== id));
  };

  // 📥 EXPORTAR A EXCEL
  const exportToExcel = () => {
    if (services.length === 0) {
      alert("No hay servicios para exportar");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(services);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Servicios");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(blob, "servicios_internos.xlsx");
  };

  return (
    <div className="space-y-6">
      {/* 📝 FORM */}
      <form
        onSubmit={createService}
        className="bg-slate-900 p-4 rounded-lg space-y-3"
      >
        <input
          placeholder="Cliente"
          className="w-full p-2 bg-slate-950 border border-slate-700 rounded"
          value={form.customer_name}
          onChange={e =>
            setForm({ ...form, customer_name: e.target.value })
          }
          required
        />

        <input
          placeholder="Teléfono"
          className="w-full p-2 bg-slate-950 border border-slate-700 rounded"
          value={form.phone}
          onChange={e =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        <input
          placeholder="Tipo de equipo"
          className="w-full p-2 bg-slate-950 border border-slate-700 rounded"
          value={form.device_type}
          onChange={e =>
            setForm({ ...form, device_type: e.target.value })
          }
        />

        <input
          placeholder="Marca / Modelo"
          className="w-full p-2 bg-slate-950 border border-slate-700 rounded"
          value={form.brand_model}
          onChange={e =>
            setForm({ ...form, brand_model: e.target.value })
          }
        />

        <textarea
          placeholder="Descripción del problema"
          className="w-full p-2 bg-slate-950 border border-slate-700 rounded"
          value={form.problem_description}
          onChange={e =>
            setForm({
              ...form,
              problem_description: e.target.value,
            })
          }
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 w-full p-2 rounded"
        >
          {loading ? "Guardando..." : "Crear servicio"}
        </button>
      </form>

      {/* 📥 EXCEL */}
      <button
        onClick={exportToExcel}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
      >
        Descargar Excel
      </button>

      {/* 📋 LISTADO */}
      <div className="space-y-3">
        {services.map(s => (
          <div
            key={s.id}
            className="bg-slate-900 border border-slate-700 rounded p-3 flex justify-between items-start"
          >
            <div>
              <div className="font-semibold">
                {s.customer_name} — {s.device_type}
              </div>
              <div className="text-sm text-slate-400">
                {s.brand_model}
              </div>
              <div className="text-sm mt-1">
                Estado: {s.status}
              </div>
            </div>

            <button
              onClick={() => deleteService(s.id)}
              className="text-red-400 hover:text-red-600 text-sm"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
