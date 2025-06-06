const Document = require("../models/Document");
const upload = require("../config/upload");
const path = require("path");
const fs = require("fs");

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

  // Загрузка документа
  uploadDocument: upload.single("document_file"),

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

      let fileData = {
        file_path: null,
        file_name: null,
        file_size: null,
        file_type: null,
      };

      // Если был загружен файл, сохраняем информацию о нем
      if (req.file) {
        fileData = {
          file_path: "/uploads/" + req.file.filename,
          file_name: req.file.originalname,
          file_size: req.file.size,
          file_type: req.file.mimetype,
        };
      }

      await Document.create({
        title,
        description: description || null,
        content: content || null,
        ...fileData,
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

      let fileData = {};

      // Если был загружен файл, обновляем информацию
      if (req.file) {
        // Если у документа уже был файл, удаляем его
        if (document.file_path) {
          const oldFilePath = path.join(
            __dirname,
            "../public",
            document.file_path
          );
          try {
            if (fs.existsSync(oldFilePath)) {
              fs.unlinkSync(oldFilePath);
            }
          } catch (error) {
            console.error("Ошибка при удалении старого файла:", error);
          }
        }

        fileData = {
          file_path: "/uploads/" + req.file.filename,
          file_name: req.file.originalname,
          file_size: req.file.size,
          file_type: req.file.mimetype,
        };
      }

      await Document.update(req.params.id, {
        title,
        description: description || null,
        content: content || null,
        ...fileData,
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

  // Скачивание документа
  download: async (req, res) => {
    try {
      const document = await Document.getById(req.params.id);

      if (!document || !document.file_path) {
        return res.render("error", {
          title: "Ошибка",
          message: "Файл не найден",
        });
      }

      const filePath = path.join(__dirname, "../public", document.file_path);

      if (!fs.existsSync(filePath)) {
        return res.render("error", {
          title: "Ошибка",
          message: "Файл не существует на сервере",
        });
      }

      // Увеличиваем счетчик скачиваний (если он есть)
      // await Document.incrementDownloads(req.params.id);

      // Отправляем файл для скачивания
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${encodeURIComponent(document.file_name)}"`
      );
      res.setHeader(
        "Content-Type",
        document.file_type || "application/octet-stream"
      );

      // Отправляем файл
      const filestream = fs.createReadStream(filePath);
      filestream.pipe(res);
    } catch (err) {
      console.error(err);
      res.render("error", {
        title: "Ошибка",
        message: "Ошибка при скачивании файла",
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

      // Проверяем права доступа
      if (
        req.session.user.role !== "admin" &&
        document.user_id !== req.session.user.id
      ) {
        return res.render("error", {
          title: "Доступ запрещен",
          message: "Вы можете удалять только свои документы",
        });
      }

      // Удаляем файл, если он существует
      if (document.file_path) {
        const filePath = path.join(__dirname, "../public", document.file_path);
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (error) {
          console.error("Ошибка при удалении файла:", error);
        }
      }

      await Document.delete(req.params.id);
      res.redirect("/documents/my");
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
      const documents = await Document.search(query);
      res.render("documents/search", {
        title: `Результаты поиска: ${query}`,
        documents,
        searchQuery: query,
      });
    } catch (err) {
      console.error(err);
      res.render("error", {
        title: "Ошибка",
        message: "Ошибка при выполнении поиска",
      });
    }
  },

  // Страница контакта с поддержкой
  contactForm: (req, res) => {
    res.render("documents/contact", {
      title: "Связаться с поддержкой",
      error: null,
    });
  },

  // Отправка сообщения в поддержку
  contact: async (req, res) => {
    try {
      const { subject, message } = req.body;
      const user_id = req.session.user.id;

      if (!subject || !message) {
        return res.render("documents/contact", {
          title: "Связаться с поддержкой",
          error: "Заполните все поля",
        });
      }

      const Message = require("../models/Message");
      await Message.create({ user_id, subject, message });

      res.render("success", {
        title: "Сообщение отправлено",
        message: "Ваше сообщение успешно отправлено в службу поддержки",
        link: "/documents",
        linkText: "Вернуться к документам",
      });
    } catch (err) {
      console.error(err);
      res.render("documents/contact", {
        title: "Связаться с поддержкой",
        error: "Ошибка при отправке сообщения",
      });
    }
  },
};

module.exports = DocumentsController;
