const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;
const SALT_ROUNDS = 10;

function createToken(usuario) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET não foi configurado.");
  }

  return jwt.sign(
    { sub: usuario.id, email: usuario.email, tipo: usuario.tipo },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function sanitizeUsuario(usuario) {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    tipo: usuario.tipo,
  };
}

router.post("/cadastro", async (req, res) => {
  const { nome, email, senha } = req.body || {};

  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ erro: "Informe um email válido." });
  }
  if (!senha || senha.length < MIN_PASSWORD_LENGTH) {
    return res
      .status(400)
      .json({ erro: `A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.` });
  }

  try {
    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

    const [result] = await pool.query(
      "INSERT INTO usuarios (nome, email, senha_hash, tipo) VALUES (?, ?, ?, 'cliente')",
      [nome || null, email.trim().toLowerCase(), senhaHash]
    );

    return res.status(201).json({
      usuario: {
        id: result.insertId,
        nome: nome || null,
        email: email.trim().toLowerCase(),
        tipo: "cliente",
      },
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ erro: "Este email já está cadastrado." });
    }
    console.error("Erro ao cadastrar usuário:", error);
    return res.status(500).json({ erro: "Erro interno ao cadastrar usuário." });
  }
});

router.post("/login", async (req, res) => {
  const { email, senha } = req.body || {};

  if (!email || !senha) {
    return res.status(400).json({ erro: "Informe email e senha." });
  }

  try {
    const [rows] = await pool.query(
      "SELECT id, nome, email, senha_hash, ativo, tipo FROM usuarios WHERE email = ? LIMIT 1",
      [email.trim().toLowerCase()]
    );
    const usuario = rows[0];

    if (!usuario || !usuario.senha_hash) {
      return res.status(401).json({ erro: "Email ou senha inválidos." });
    }
    if (!usuario.ativo) {
      return res.status(403).json({ erro: "Usuário inativo." });
    }

    const senhaOk = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaOk) {
      return res.status(401).json({ erro: "Email ou senha inválidos." });
    }

    const token = createToken(usuario);

    return res.json({ token, usuario: sanitizeUsuario(usuario) });
  } catch (error) {
    console.error("Erro ao autenticar usuário:", error);
    return res.status(500).json({ erro: "Erro interno ao autenticar." });
  }
});

router.get("/me", async (req, res) => {
  const [scheme, token] = (req.headers.authorization || "").split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ erro: "Token de acesso não informado." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await pool.query(
      "SELECT id, nome, email, ativo, tipo FROM usuarios WHERE id = ? LIMIT 1",
      [payload.sub]
    );
    const usuario = rows[0];

    if (!usuario || !usuario.ativo) {
      return res.status(401).json({ erro: "Sessão inválida ou usuário inativo." });
    }

    return res.json({ usuario: sanitizeUsuario(usuario) });
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ erro: "Sessão inválida ou expirada." });
    }
    console.error("Erro ao validar sessão:", error);
    return res.status(500).json({ erro: "Erro interno ao validar sessão." });
  }
});

module.exports = router;
