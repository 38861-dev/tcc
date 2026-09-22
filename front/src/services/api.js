const API_URL = "http://localhost:3000/api";

function getToken() {
  return localStorage.getItem("token");
}

export async function login(email, senha) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.erro || "Não foi possível entrar.");
  }

  if (data.token) {
    localStorage.setItem("token", data.token);
  }

  return data;
}

export async function cadastrarUsuario(nome, email, senha) {
  const response = await fetch(`${API_URL}/cadastro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, senha }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.erro || "Não foi possível cadastrar.");
  }

  return data;
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
