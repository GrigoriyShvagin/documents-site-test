const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/AdminController");
const { requireAuth, requireAdmin } = require("../middlewares/auth");

// Все маршруты требуют авторизации и роль админа
router.use(requireAuth);
router.use(requireAdmin);

// Главная страница админки
router.get("/", AdminController.dashboard);
router.get("/dashboard", AdminController.dashboard);

// Управление пользователями
router.get("/users", AdminController.users);

// Редактирование пользователя
router.get("/users/:id/edit", AdminController.editUserForm);
router.post("/users/:id/edit", AdminController.updateUser);

// Удаление пользователя
router.post("/users/:id/delete", AdminController.deleteUser);

// Управление документами
router.get("/documents", AdminController.documents);

// Удаление документа
router.post("/documents/:id/delete", AdminController.deleteDocument);

module.exports = router;
