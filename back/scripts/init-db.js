const fs = require("fs");
const path = require("path");
const pool = require("../db");

async function initializeDatabase() {
  const schemaPath = path.resolve(__dirname, "../../BD/rtual-postgres.sql");
  const schema = fs.readFileSync(schemaPath, "utf8");

  try {
    await pool.query(schema);
    console.log("Schema PostgreSQL inicializado com sucesso.");
  } finally {
    await pool.end();
  }
}

initializeDatabase().catch((error) => {
  console.error("Erro ao inicializar o banco PostgreSQL:", error);
  process.exitCode = 1;
});
