const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");

// Страница входа
router.get("/login", AuthController.loginPage);

// Обработка входа
router.post("/login", AuthController.login);

// Страница регистрации
router.get("/register", AuthController.registerPage);

// Обработка регистрации
router.post("/register", AuthController.register);

// Выход
router.get("/logout", AuthController.logout);

module.exports = router;
