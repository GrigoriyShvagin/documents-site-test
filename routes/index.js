const express = require("express");
const router = express.Router();

// Главная страница
router.get("/", (req, res) => {
  res.render("index", { title: "Сайт документов" });
});

// Экспорт маршрутизатора
module.exports = router;
