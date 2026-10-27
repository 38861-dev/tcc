const API_URL = "http://localhost:3000/api";

function getToken() {
  return localStorage.getItem("token");
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
