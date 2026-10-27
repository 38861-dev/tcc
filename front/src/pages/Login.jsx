import { ArrowLeft, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useState } from "react";
import "../styles/Login.css";

export default function Login({ setPage, onAdminLogin }) {
  const [role, setRole] = useState("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Digite um e-mail válido.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setError("");

    if (role === "client") {
      setNotice("O acesso de cliente será ativado quando o backend estiver conectado. Seus dados não foram enviados nem armazenados.");
      return;
    }

    setNotice("");
    onAdminLogin();
  };

  return (
    <main className="login-page">
      <button className="login-back" onClick={() => setPage("home")} type="button">
        <ArrowLeft size={18} />
        Voltar ao salão
      </button>
      <section className="login-card">
        <div className="login-brand">
          <span className="login-brand-mark">
            <span className="login-brand-main">R.tual</span>
            <span className="login-brand-sub">Hair Care</span>
          </span>
          <span>R.tual <small>Hair Care</small></span>
        </div>

        <span className="login-eyebrow">Área exclusiva</span>
        <h1>Que bom ter você aqui.</h1>
        <p className="login-description">Entre para acompanhar seus horários ou gerenciar o salão.</p>

        <div className="login-role-picker" role="tablist" aria-label="Tipo de acesso">
          <button
            aria-selected={role === "client"}
            className={role === "client" ? "selected" : ""}
            onClick={() => setRole("client")}
            role="tab"
            type="button"
          >
            <UserRound size={18} />
            Cliente
          </button>
          <button
            aria-selected={role === "admin"}
            className={role === "admin" ? "selected" : ""}
            onClick={() => setRole("admin")}
            role="tab"
            type="button"
          >
            <LockKeyhole size={18} />
            Administrador
          </button>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="login-email">E-mail</label>
          <div className="login-input">
            <Mail size={18} />
            <input
              autoComplete="email"
              id="login-email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="E-mail"
              required
              type="email"
              value={email}
            />
          </div>
          <label htmlFor="login-password">Senha</label>
          <div className="login-input">
            <LockKeyhole size={18} />
            <input
              autoComplete="current-password"
              id="login-password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Mínimo de 6 caracteres"
              required
              type="password"
              value={password}
            />
          </div>
          {error && <p className="login-error" role="alert">{error}</p>}
          {notice && <p className="login-notice" role="status">{notice}</p>}
          <button className="login-submit" type="submit">
            Entrar como {role === "client" ? "cliente" : "administrador"}
          </button>
        </form>

        <p className="login-demo-note">
          A área do cliente ainda não valida credenciais. O acesso administrativo abaixo é apenas uma demonstração local.
        </p>
      </section>
    </main>
  );
}
