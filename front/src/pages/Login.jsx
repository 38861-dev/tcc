import { useState } from "react";
import { ArrowLeft, Lock, Mail } from "lucide-react";
import { login } from "../services/api";
import "../styles/Login.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(value) {
  if (!value.trim()) {
    return "Informe seu email.";
  }
  if (!EMAIL_REGEX.test(value)) {
    return "Informe um email válido.";
  }
  return "";
}

export default function Login({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleEmailChange(event) {
    const value = event.target.value;
    setEmail(value);
    if (emailError) {
      setEmailError(validateEmail(value));
    }
  }

  function handleEmailBlur(event) {
    setEmailError(validateEmail(event.target.value));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const error = validateEmail(email);
    setEmailError(error);
    if (error) {
      return;
    }

    setFormError("");
    setIsSubmitting(true);
    try {
      await login(email, password);
      setPage("admin");
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <span className="tag">Acesso interno</span>
        <h1>Entrar no painel</h1>
        <p>
          Área reservada para administração do salão e organização interna.
        </p>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <label>
            Email
            <div className={`input-box${emailError ? " input-box-error" : ""}`}>
              <Mail size={18} />
              <input
                type="email"
                placeholder="seuemail@email.com"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                autoComplete="email"
                required
              />
            </div>
            {emailError && <span className="field-error">{emailError}</span>}
          </label>

          <label>
            Senha
            <div className="input-box">
              <Lock size={18} />
              <input
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </label>

          {formError && <span className="field-error">{formError}</span>}

          <button type="submit" className="login-submit" disabled={isSubmitting}>
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <button
          type="button"
          className="back-button"
          onClick={() => setPage("register")}
        >
          Não tem conta? Cadastre-se
        </button>

        <button
          type="button"
          className="back-button"
          onClick={() => setPage("contact")}
        >
          <ArrowLeft size={18} />
          Voltar
        </button>
      </section>
    </main>
  );
}
