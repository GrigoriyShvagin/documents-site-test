const express = require("express");
const router = express.Router();
const DocumentsController = require("../controllers/DocumentsController");
const { requireAuth, requireAdmin } = require("../middlewares/auth");

// Публичные маршруты (доступны всем)
router.get("/", DocumentsController.index);

// Маршруты для авторизованных пользователей
router.use(requireAuth);

// Мои документы
router.get("/my", DocumentsController.myDocuments);

// Форма создания документа
router.get("/create", DocumentsController.createForm);

// Создание документа
router.post(
  "/create",
  DocumentsController.uploadDocument,
  DocumentsController.create
);

// Форма редактирования документа
router.get("/:id/edit", DocumentsController.editForm);

// Обновление документа
router.post(
  "/:id/edit",
  DocumentsController.uploadDocument,
  DocumentsController.update
);

// Удаление документа
router.post("/:id/delete", DocumentsController.delete);

// Просмотр документа
router.get("/:id", DocumentsController.show);

// Скачивание документа
router.get("/:id/download", DocumentsController.download);

// Поиск документов
router.get("/search", DocumentsController.search);

// Контактная форма для связи с поддержкой
router.get("/contact/form", DocumentsController.contactForm);
router.post("/contact", DocumentsController.contact);

module.exports = router;
