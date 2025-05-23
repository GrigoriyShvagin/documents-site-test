const express = require("express");
const router = express.Router();
const SupportController = require("../controllers/SupportController");
const { requireAuth, requireSupport } = require("../middlewares/auth");

// Все маршруты требуют авторизации и роль поддержки или админа
router.use(requireAuth);
router.use(requireSupport);

// Главная страница поддержки
router.get("/", SupportController.dashboard);
router.get("/dashboard", SupportController.dashboard);

// Управление сообщениями
router.get("/messages", SupportController.messages);

// Просмотр сообщения
router.get("/messages/:id", SupportController.showMessage);

// Обновление статуса сообщения
router.post("/messages/:id/update", SupportController.updateStatus);
router.post("/messages/:id/status", SupportController.updateStatus);

// Удаление сообщения
router.post("/messages/:id/delete", SupportController.deleteMessage);

// Управление документами
router.get("/documents", SupportController.documents);

// Удаление документа
router.post("/documents/:id/delete", SupportController.deleteDocument);

module.exports = router;
