const Message = require("../models/Message");
const Document = require("../models/Document");

const SupportController = {
  // Главная страница поддержки
  dashboard: async (req, res) => {
    try {
      const newMessages = await Message.getByStatus("new");
      const inProgressMessages = await Message.getByStatus("in_progress");
      const resolvedMessages = await Message.getByStatus("resolved");
      const recentMessages = await Message.getRecentMessages(5); // Последние 5 сообщений

      res.render("support/dashboard", {
        title: "Панель поддержки",
        stats: {
          newMessages: newMessages.length,
          inProgressMessages: inProgressMessages.length,
          resolvedMessages: resolvedMessages.length,
        },
        recentMessages,
      });
    } catch (err) {
      console.error(err);
      res.render("error", {
        title: "Ошибка",
        message: "Не удалось загрузить данные",
      });
    }
  },

  // Все сообщения
  messages: async (req, res) => {
    try {
      const { status } = req.query;
      let messages;

      if (status && ["new", "in_progress", "resolved"].includes(status)) {
        messages = await Message.getByStatus(status);
      } else {
        messages = await Message.getAll();
      }

      res.render("support/messages", {
        title: "Сообщения пользователей",
        messages,
        currentStatus: status || null,
      });
    } catch (err) {
      console.error(err);
      res.render("error", {
        title: "Ошибка",
        message: "Не удалось загрузить сообщения",
      });
    }
  },

  // Просмотр сообщения
  showMessage: async (req, res) => {
    try {
      const message = await Message.getById(req.params.id);
      if (!message) {
        return res.render("error", {
          title: "Не найдено",
          message: "Сообщение не найдено",
        });
      }

      res.render("support/show-message", {
        title: `Сообщение: ${message.subject}`,
        message,
      });
    } catch (err) {
      console.error(err);
      res.render("error", {
        title: "Ошибка",
        message: "Не удалось загрузить сообщение",
      });
    }
  },

  // Изменение статуса сообщения
  updateStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const messageId = req.params.id;

      if (!["new", "in_progress", "resolved"].includes(status)) {
        return res.render("error", {
          title: "Ошибка",
          message: "Неверный статус",
        });
      }

      await Message.updateStatus(messageId, status);
      res.redirect("/support/messages");
    } catch (err) {
      console.error(err);
      res.render("error", {
        title: "Ошибка",
        message: "Не удалось обновить статус",
      });
    }
  },

  // Управление документами (для поддержки)
  documents: async (req, res) => {
    try {
      const documents = await Document.getAll();
      res.render("support/documents", {
        title: "Управление документами",
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

  // Удаление документа (для поддержки)
  deleteDocument: async (req, res) => {
    try {
      const deleted = await Document.delete(req.params.id);

      if (deleted) {
        res.redirect("/support/documents");
      } else {
        res.render("error", {
          title: "Ошибка",
          message: "Документ не найден",
        });
      }
    } catch (err) {
      console.error(err);
      res.render("error", {
        title: "Ошибка",
        message: "Не удалось удалить документ",
      });
    }
  },

  // Удаление сообщения
  deleteMessage: async (req, res) => {
    try {
      const deleted = await Message.delete(req.params.id);

      if (deleted) {
        res.redirect("/support/messages");
      } else {
        res.render("error", {
          title: "Ошибка",
          message: "Сообщение не найдено",
        });
      }
    } catch (err) {
      console.error(err);
      res.render("error", {
        title: "Ошибка",
        message: "Не удалось удалить сообщение",
      });
    }
  },
};

module.exports = SupportController;
