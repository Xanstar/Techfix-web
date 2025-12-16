import { Routes, Route } from "react-router-dom";
import PublicApp from "./PublicApp";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/*" element={<PublicApp />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}
