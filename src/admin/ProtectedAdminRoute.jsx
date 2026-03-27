import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function ProtectedAdminRoute({ children }) {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    const checkAccess = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setAllowed(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (error || profile?.role !== "admin") {
        setAllowed(false);
        return;
      }

      setAllowed(true);
    };

    checkAccess();
  }, []);

  // ⏳ Mientras verifica → no renderiza nada
  if (allowed === null) return null;

  // 🚫 Bloqueado
  if (!allowed) return <Navigate to="/admin/login" replace />;

  // ✅ Permitido
  return children;
}
