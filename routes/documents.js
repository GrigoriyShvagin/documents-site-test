const express = require("express");
const router = express.Router();
const DocumentsController = require("../controllers/DocumentsController");
const UsersController = require("../controllers/UsersController");
const { requireAuth } = require("../middlewares/auth");

// Все маршруты требуют авторизации
router.use(requireAuth);

// Главная страница документов (все документы)
router.get("/", DocumentsController.index);

// Мои документы
router.get("/my", DocumentsController.myDocuments);

// Поиск документов
router.get("/search", DocumentsController.search);

// Форма создания документа
router.get("/create", DocumentsController.createForm);

// Создание документа
router.post("/create", DocumentsController.create);

// Просмотр документа
router.get("/:id", DocumentsController.show);

// Форма редактирования документа
router.get("/:id/edit", DocumentsController.editForm);

// Обновление документа
router.post("/:id/edit", DocumentsController.update);

// Удаление документа
router.post("/:id/delete", DocumentsController.delete);

// Форма обратной связи
router.get("/contact/form", UsersController.contactForm);

// Отправка сообщения в поддержку
router.post("/contact/send", UsersController.sendMessage);

// Мои сообщения
router.get("/contact/my", UsersController.myMessages);

module.exports = router;
