import { motion } from "framer-motion";
import Button from "./Button";

export default function Navbar({ setPage }) {
  return (
    <motion.header
      className="navbar"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <div className="navbar-brand">
        <div className="brand-mark">R</div>
        <div>
          <span>R.tual</span>
          <p>Hair Care</p>
        </div>
      </div>

      <nav>
        <button onClick={() => setPage("home")}>Início</button>
        <button onClick={() => setPage("dashboard")}>Serviços</button>
        <button onClick={() => setPage("about")}>Sobre</button>
        <button onClick={() => setPage("technology")}>Diferenciais</button>
        <button onClick={() => setPage("contact")}>Contato</button>
      </nav>

      <Button onClick={() => setPage("reading")}>Meus Agendamentos</Button>
    </motion.header>
  );
}
