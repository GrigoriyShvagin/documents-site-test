const { Pool } = require("pg");

// Создаем пул подключений к PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "document_library",
  port: process.env.DB_PORT || 5432,
});

// Проверяем соединение
pool.connect((err, client, release) => {
  if (err) {
    console.error("Ошибка подключения к базе данных:", err);
    return;
  }
  console.log("Подключение к PostgreSQL установлено");
  release();
});

module.exports = pool;
