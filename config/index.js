// Конфигурация приложения
module.exports = {
  development: {
    port: process.env.PORT || 3000,
    databaseUrl: "mongodb://localhost:27017/documents_db",
    jwtSecret: "your_jwt_secret_key",
  },
  production: {
    port: process.env.PORT || 8080,
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
  },
};
