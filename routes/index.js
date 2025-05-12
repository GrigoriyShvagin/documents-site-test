const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { title: "Сайт документов" });
});

router.get("/documents", (req, res) => {
  res.render("documents", { title: "Сайт документов", document: { id: 1 } });
});

module.exports = router;
