import { ArrowLeft, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useState } from "react";
import { cadastrar, entrar } from "../services/api";
import "../styles/Login.css";

export default function Login({ setPage, onLogin }) {
  const [role, setRole] = useState("client");
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (role === "client" && isRegistering && name.trim().length < 2) {
      setError("Digite seu nome completo.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Digite um e-mail válido.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      if (role === "client" && isRegistering) {
        await cadastrar(name.trim(), normalizedEmail, password);
      }

      const session = await entrar(normalizedEmail, password);
      const expectedType = role === "admin" ? "administrador" : "cliente";

      if (session.usuario.tipo !== expectedType) {
        setError(`Este usuário não possui acesso como ${role === "admin" ? "administrador" : "cliente"}.`);
        return;
      }

      onLogin(session);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const changeRole = (nextRole) => {
    setRole(nextRole);
    setIsRegistering(false);
    setError("");
  };

  const toggleRegistration = () => {
    setIsRegistering((current) => !current);
    setError("");
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
        <p className="login-description">
          {role === "client" && isRegistering
            ? "Crie sua conta para acompanhar seus horários."
            : "Entre para acompanhar seus horários ou gerenciar o salão."}
        </p>

        <div className="login-role-picker" role="tablist" aria-label="Tipo de acesso">
          <button
            aria-selected={role === "client"}
            className={role === "client" ? "selected" : ""}
            onClick={() => changeRole("client")}
            role="tab"
            type="button"
          >
            <UserRound size={18} />
            Cliente
          </button>
          <button
            aria-selected={role === "admin"}
            className={role === "admin" ? "selected" : ""}
            onClick={() => changeRole("admin")}
            role="tab"
            type="button"
          >
            <LockKeyhole size={18} />
            Administrador
          </button>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {role === "client" && isRegistering && (
            <>
              <label htmlFor="login-name">Nome completo</label>
              <div className="login-input">
                <UserRound size={18} />
                <input
                  autoComplete="name"
                  id="login-name"
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Seu nome completo"
                  required
                  type="text"
                  value={name}
                />
              </div>
            </>
          )}
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
              autoComplete={role === "client" && isRegistering ? "new-password" : "current-password"}
              id="login-password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Mínimo de 6 caracteres"
              required
              type="password"
              value={password}
            />
          </div>
          {error && <p className="login-error" role="alert">{error}</p>}
          <button className="login-submit" disabled={isSubmitting} type="submit">
            {isSubmitting
              ? "Aguarde..."
              : role === "client" && isRegistering
                ? "Criar conta"
                : `Entrar como ${role === "client" ? "cliente" : "administrador"}`}
          </button>
        </form>
        {role === "client" && (
          <p className="login-account-prompt">
            {isRegistering ? "Já tem uma conta?" : "Não tem uma conta?"}
            <button onClick={toggleRegistration} type="button">
              {isRegistering ? "Entrar" : "Cadastrar-se"}
            </button>
          </p>
        )}
      </section>
    </main>
  );
}
