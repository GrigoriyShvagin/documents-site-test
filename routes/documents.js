const express = require("express");
const router = express.Router();

// GET запрос на /documents
router.get("/", (req, res) => {
  // Рендерим страницу с данными
  res.render("documents", {
    title: "Документы",
    document: { id: 1 },
  });
});

module.exports = router;
