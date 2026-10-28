const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function getToken() {
  return localStorage.getItem("token");
}

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.erro || "Não foi possível concluir a solicitação.");
  }
  return data;
}

export async function entrar(email, senha) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
  return parseResponse(response);
}

export async function cadastrar(nome, email, senha) {
  const response = await fetch(`${API_URL}/cadastro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, senha }),
  });
  return parseResponse(response);
}

export async function obterUsuarioAtual() {
  const token = getToken();
  if (!token) return null;

  const response = await fetch(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseResponse(response);
}

export async function criarAgendamento(payload) {
  const token = getToken();

  const response = await fetch(`${API_URL}/agendamentos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  return response.json();
}

export async function listarAgendamentos() {
  const token = getToken();

  const response = await fetch(`${API_URL}/agendamentos`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return response.json();
}

export async function cancelarAgendamento(agendamentoId) {
  const token = getToken();

  const response = await fetch(`${API_URL}/agendamentos/${agendamentoId}`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return response.json();
}

export async function listarServicos() {
  const response = await fetch(`${API_URL}/servicos`);
  return response.json();
}
