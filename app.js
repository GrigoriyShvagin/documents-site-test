const express = require("express");
const path = require("path");
const session = require("express-session");
const app = express();
const PORT = process.env.PORT || 3000;

// Настройка сессий
app.use(
  session({
    secret: "document-library-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 24 часа
  })
);

// Middleware для передачи пользователя в шаблоны
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

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
app.use("/auth", require("./routes/auth"));
app.use("/documents", require("./routes/documents"));
app.use("/admin", require("./routes/admin"));
app.use("/support", require("./routes/support"));

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
