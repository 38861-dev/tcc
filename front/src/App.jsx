import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import { obterUsuarioAtual } from "./services/api";

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("usuario")) || null;
  } catch {
    return null;
  }
}

export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(readStoredUser);

  useEffect(() => {
    if (!localStorage.getItem("token")) return;

    obterUsuarioAtual()
      .then(({ usuario }) => {
        setUser(usuario);
        localStorage.setItem("usuario", JSON.stringify(usuario));
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        setUser(null);
        setPage("home");
      });
  }, []);

  const handleLogin = ({ token, usuario }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(usuario));
    setUser(usuario);
    setPage(usuario.tipo === "administrador" ? "dashboard" : "home");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUser(null);
    setPage("home");
  };

  return (
    <>
      {page === "home" && <Home setPage={setPage} user={user} onLogout={handleLogout} />}
      {page === "login" && <Login setPage={setPage} onLogin={handleLogin} />}
      {page === "dashboard" && user?.tipo === "administrador" && (
        <Dashboard setPage={setPage} onLogout={handleLogout} />
      )}
      {page === "dashboard" && user?.tipo !== "administrador" && (
        <Login setPage={setPage} onLogin={handleLogin} />
      )}
      {(page === "services" || page === "technology") && <Services setPage={setPage} />}
      {page === "contact" && <Contact setPage={setPage} />}
    </>
  );
}
