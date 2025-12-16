import { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) navigate("/admin");
    else alert("Login incorrecto");
  };

  return (
    <form onSubmit={handleLogin} className="min-h-screen flex flex-col justify-center items-center bg-slate-950 text-white gap-4">
      <h1 className="text-2xl font-mono">ADMIN_LOGIN</h1>

      <input className="bg-slate-900 border px-4 py-2"
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input type="password"
        className="bg-slate-900 border px-4 py-2"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="bg-cyan-500 text-black px-6 py-2">
        LOGIN
      </button>
    </form>
  );
}