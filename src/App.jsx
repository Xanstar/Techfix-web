import { Routes, Route } from "react-router-dom";
import PublicApp from "./PublicApp";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import ProtectedAdminRoute from "./admin/ProtectedAdminRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/*" element={<PublicApp />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* 🔐 RUTA ADMIN PROTEGIDA */}
      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        }
      />
    </Routes>
  );
}
