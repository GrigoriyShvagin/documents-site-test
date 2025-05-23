const express = require("express");
const router = express.Router();
const Document = require("../models/Document");

// Главная страница
router.get("/", async (req, res) => {
  try {
    // Показываем несколько последних документов на главной
    const documents = await Document.getAll();
    const recentDocuments = documents.slice(0, 4); // Первые 4 документа

    res.render("index", {
      title: "DocHub - Библиотека документов",
      recentDocuments,
    });
  } catch (err) {
    console.error(err);
    res.render("index", {
      title: "DocHub - Библиотека документов",
      recentDocuments: [],
    });
  }
});

// Страница "О библиотеке"
router.get("/about", (req, res) => {
  res.render("about", { title: "О библиотеке" });
});

// Форма обратной связи (для неавторизованных)
router.get("/contact", (req, res) => {
  if (!req.session.user) {
    return res.render("contact-public", {
      title: "Обратная связь",
      error: null,
      success: null,
    });
  }
  res.redirect("/documents/contact/form");
});

module.exports = router;
