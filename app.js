const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Настройка статических файлов
app.use(express.static(path.join(__dirname, "public")));

// Настройка шаблонизатора EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Парсинг данных из форм
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Маршруты
app.use("/", require("./routes/index"));
app.use("/documents", require("./routes/index"));

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
