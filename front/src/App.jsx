import { useState } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminHome from "./pages/AdminHome";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import Contact from "./pages/Contact";

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <>
      {page === "home" && <Home setPage={setPage} />}
      {page === "login" && <Login setPage={setPage} />}
      {page === "register" && <Register setPage={setPage} />}
      {page === "admin" && <AdminHome setPage={setPage} />}
      {page === "dashboard" && <Dashboard setPage={setPage} />}
      {(page === "services" || page === "technology") && <Services setPage={setPage} />}
      {page === "contact" && <Contact setPage={setPage} />}
    </>
  );
}
