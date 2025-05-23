const Document = require("../models/Document");

const DocumentsController = {
  // Список всех документов
  index: async (req, res) => {
    try {
      const documents = await Document.getAll();
      res.render("documents/index", {
        title: "Библиотека документов",
        documents,
      });
    } catch (err) {
      console.error(err);
      res.render("error", {
        title: "Ошибка",
        message: "Не удалось загрузить документы",
      });
    }
  },

  // Мои документы (для пользователей)
  myDocuments: async (req, res) => {
    try {
      const documents = await Document.getByUserId(req.session.user.id);
      res.render("documents/my", {
        title: "Мои документы",
        documents,
      });
    } catch (err) {
      console.error(err);
      res.render("error", {
        title: "Ошибка",
        message: "Не удалось загрузить ваши документы",
      });
    }
  },

  // Просмотр документа
  show: async (req, res) => {
    try {
      const document = await Document.getById(req.params.id);
      if (!document) {
        return res.render("error", {
          title: "Не найдено",
          message: "Документ не найден",
        });
      }
      res.render("documents/show", {
        title: document.title,
        document,
        user: req.session.user,
      });
    } catch (err) {
      console.error(err);
      res.render("error", {
        title: "Ошибка",
        message: "Не удалось загрузить документ",
      });
    }
  },

  // Форма создания документа
  createForm: (req, res) => {
    res.render("documents/create", {
      title: "Добавить документ",
      error: null,
    });
  },

  // Создание документа
  create: async (req, res) => {
    try {
      const { title, description, content } = req.body;

      if (!title) {
        return res.render("documents/create", {
          title: "Добавить документ",
          error: "Название документа обязательно",
        });
      }

      await Document.create({
        title,
        description: description || null,
        content: content || null,
        file_path: null, // Пока без файлов
        user_id: req.session.user.id,
      });

      res.redirect("/documents/my");
    } catch (err) {
      console.error(err);
      res.render("documents/create", {
        title: "Добавить документ",
        error: "Ошибка при создании документа",
      });
    }
  },

  // Форма редактирования документа
  editForm: async (req, res) => {
    try {
      const document = await Document.getById(req.params.id);
      if (!document) {
        return res.render("error", {
          title: "Не найдено",
          message: "Документ не найден",
        });
      }

      // Проверяем права доступа
      if (
        req.session.user.role !== "admin" &&
        document.user_id !== req.session.user.id
      ) {
        return res.render("error", {
          title: "Доступ запрещен",
          message: "Вы можете редактировать только свои документы",
        });
      }

      res.render("documents/edit", {
        title: "Редактировать документ",
        document,
        error: null,
      });
    } catch (err) {
      console.error(err);
      res.render("error", {
        title: "Ошибка",
        message: "Не удалось загрузить документ для редактирования",
      });
    }
  },

  // Обновление документа
  update: async (req, res) => {
    try {
      const { title, description, content } = req.body;
      const document = await Document.getById(req.params.id);

      if (!document) {
        return res.render("error", {
          title: "Не найдено",
          message: "Документ не найден",
        });
      }

      // Проверяем права доступа
      if (
        req.session.user.role !== "admin" &&
        document.user_id !== req.session.user.id
      ) {
        return res.render("error", {
          title: "Доступ запрещен",
          message: "Вы можете редактировать только свои документы",
        });
      }

      if (!title) {
        return res.render("documents/edit", {
          title: "Редактировать документ",
          document,
          error: "Название документа обязательно",
        });
      }

      await Document.update(req.params.id, {
        title,
        description: description || null,
        content: content || null,
        file_path: document.file_path,
      });

      res.redirect(`/documents/${req.params.id}`);
    } catch (err) {
      console.error(err);
      res.render("error", {
        title: "Ошибка",
        message: "Не удалось обновить документ",
      });
    }
  },

  // Удаление документа
  delete: async (req, res) => {
    try {
      const document = await Document.getById(req.params.id);

      if (!document) {
        return res.render("error", {
          title: "Не найдено",
          message: "Документ не найден",
        });
      }

      // Проверяем права доступа (пользователь может удалять только свои, админ и поддержка - любые)
      if (
        req.session.user.role === "user" &&
        document.user_id !== req.session.user.id
      ) {
        return res.render("error", {
          title: "Доступ запрещен",
          message: "Вы можете удалять только свои документы",
        });
      }

      await Document.delete(req.params.id);

      if (req.session.user.role === "admin") {
        res.redirect("/admin/documents");
      } else {
        res.redirect("/documents/my");
      }
    } catch (err) {
      console.error(err);
      res.render("error", {
        title: "Ошибка",
        message: "Не удалось удалить документ",
      });
    }
  },

  // Поиск документов
  search: async (req, res) => {
    try {
      const { query } = req.query;

      if (!query) {
        return res.redirect("/documents");
      }

      const documents = await Document.search(query);
      res.render("documents/search", {
        title: `Поиск: ${query}`,
        documents,
        query,
      });
    } catch (err) {
      console.error(err);
      res.render("error", {
        title: "Ошибка",
        message: "Ошибка поиска",
      });
    }
  },
};

module.exports = DocumentsController;
