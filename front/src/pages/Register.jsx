import { useState } from "react";
import { ArrowLeft, Lock, Mail, User } from "lucide-react";
import { cadastrarUsuario } from "../services/api";
import "../styles/Login.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

function validateName(value) {
  if (!value.trim()) {
    return "Informe seu nome.";
  }
  return "";
}

function validateEmail(value) {
  if (!value.trim()) {
    return "Informe seu email.";
  }
  if (!EMAIL_REGEX.test(value)) {
    return "Informe um email válido.";
  }
  return "";
}

function validatePassword(value) {
  if (!value) {
    return "Informe uma senha.";
  }
  if (value.length < MIN_PASSWORD_LENGTH) {
    return `A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  }
  return "";
}

function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) {
    return "Confirme sua senha.";
  }
  if (confirmPassword !== password) {
    return "As senhas não coincidem.";
  }
  return "";
}

export default function Register({ setPage }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleNameBlur(event) {
    setErrors((prev) => ({ ...prev, name: validateName(event.target.value) }));
  }

  function handleEmailChange(event) {
    const value = event.target.value;
    setEmail(value);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    }
  }

  function handleEmailBlur(event) {
    setErrors((prev) => ({ ...prev, email: validateEmail(event.target.value) }));
  }

  function handlePasswordChange(event) {
    const value = event.target.value;
    setPassword(value);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
    }
    if (errors.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateConfirmPassword(value, confirmPassword),
      }));
    }
  }

  function handlePasswordBlur(event) {
    setErrors((prev) => ({ ...prev, password: validatePassword(event.target.value) }));
  }

  function handleConfirmPasswordChange(event) {
    const value = event.target.value;
    setConfirmPassword(value);
    if (errors.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateConfirmPassword(password, value),
      }));
    }
  }

  function handleConfirmPasswordBlur(event) {
    setErrors((prev) => ({
      ...prev,
      confirmPassword: validateConfirmPassword(password, event.target.value),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(password, confirmPassword),
    };
    setErrors(nextErrors);

    const hasError = Object.values(nextErrors).some(Boolean);
    if (hasError) {
      return;
    }

    setFormError("");
    setFormSuccess("");
    setIsSubmitting(true);
    try {
      await cadastrarUsuario(name, email, password);
      setFormSuccess("Conta criada com sucesso! Você já pode entrar.");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <span className="tag">Novo por aqui?</span>
        <h1>Criar conta</h1>
        <p>Cadastre-se para agendar seus horários no R.tual Hair Care.</p>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <label>
            Nome
            <div className={`input-box${errors.name ? " input-box-error" : ""}`}>
              <User size={18} />
              <input
                type="text"
                placeholder="Digite seu nome completo"
                value={name}
                onChange={(event) => setName(event.target.value)}
                onBlur={handleNameBlur}
                autoComplete="name"
                required
              />
            </div>
            {errors.name && <span className="field-error">{errors.name}</span>}
          </label>

          <label>
            Email
            <div className={`input-box${errors.email ? " input-box-error" : ""}`}>
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
            {errors.email && <span className="field-error">{errors.email}</span>}
          </label>

          <label>
            Senha
            <div className={`input-box${errors.password ? " input-box-error" : ""}`}>
              <Lock size={18} />
              <input
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                autoComplete="new-password"
                required
              />
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </label>

          <label>
            Confirmar senha
            <div className={`input-box${errors.confirmPassword ? " input-box-error" : ""}`}>
              <Lock size={18} />
              <input
                type="password"
                placeholder="Digite a senha novamente"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                onBlur={handleConfirmPasswordBlur}
                autoComplete="new-password"
                required
              />
            </div>
            {errors.confirmPassword && (
              <span className="field-error">{errors.confirmPassword}</span>
            )}
          </label>

          {formError && <span className="field-error">{formError}</span>}
          {formSuccess && <span className="field-success">{formSuccess}</span>}

          <button type="submit" className="login-submit" disabled={isSubmitting}>
            {isSubmitting ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <button type="button" className="back-button" onClick={() => setPage("login")}>
          <ArrowLeft size={18} />
          Já tenho conta
        </button>
      </section>
    </main>
  );
}
