const User = require("../models/User");
const Document = require("../models/Document");
const Message = require("../models/Message");

const AdminController = {
  // Главная страница админки
  dashboard: async (req, res) => {
    try {
      const users = await User.getAll();
      const documents = await Document.getAll();
      const messages = await Message.getNewCount();

      res.render("admin/dashboard", {
        title: "Панель администратора",
        stats: {
          usersCount: users.length,
          documentsCount: documents.length,
          newMessagesCount: messages,
        },
      });
    } catch (err) {
      console.error(err);
      res.render("error", {
        title: "Ошибка",
        message: "Не удалось загрузить данные",
      });
    }
  },

  // Управление пользователями
  users: async (req, res) => {
    try {
      const users = await User.getAll();
      res.render("admin/users", {
        title: "Управление пользователями",
        users,
      });
    } catch (err) {
      console.error(err);
      res.render("error", {
        title: "Ошибка",
        message: "Не удалось загрузить пользователей",
      });
    }
  },

  // Управление документами
  documents: async (req, res) => {
    try {
      const documents = await Document.getAll();
      res.render("admin/documents", {
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

  // Удаление пользователя
  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;

      // Нельзя удалить самого себя
      if (userId == req.session.user.id) {
        return res.render("error", {
          title: "Ошибка",
          message: "Нельзя удалить самого себя",
        });
      }

      const deleted = await User.delete(userId);

      if (deleted) {
        res.redirect("/admin/users");
      } else {
        res.render("error", {
          title: "Ошибка",
          message: "Пользователь не найден",
        });
      }
    } catch (err) {
      console.error(err);
      res.render("error", {
        title: "Ошибка",
        message: "Не удалось удалить пользователя",
      });
    }
  },

  // Удаление документа
  deleteDocument: async (req, res) => {
    try {
      const deleted = await Document.delete(req.params.id);

      if (deleted) {
        res.redirect("/admin/documents");
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

  // Форма редактирования пользователя
  editUserForm: async (req, res) => {
    try {
      const user = await User.getById(req.params.id);
      if (!user) {
        return res.render("error", {
          title: "Не найдено",
          message: "Пользователь не найден",
        });
      }

      res.render("admin/edit-user", {
        title: "Редактировать пользователя",
        user,
        error: null,
      });
    } catch (err) {
      console.error(err);
      res.render("error", {
        title: "Ошибка",
        message: "Не удалось загрузить пользователя",
      });
    }
  },

  // Обновление пользователя
  updateUser: async (req, res) => {
    try {
      const { username, email, role } = req.body;
      const userId = req.params.id;

      const user = await User.getById(userId);
      if (!user) {
        return res.render("error", {
          title: "Не найдено",
          message: "Пользователь не найден",
        });
      }

      if (!username || !email || !role) {
        return res.render("admin/edit-user", {
          title: "Редактировать пользователя",
          user,
          error: "Заполните все поля",
        });
      }

      await User.update(userId, { username, email, role });
      res.redirect("/admin/users");
    } catch (err) {
      console.error(err);
      const user = await User.getById(req.params.id);
      res.render("admin/edit-user", {
        title: "Редактировать пользователя",
        user,
        error: "Ошибка при обновлении пользователя",
      });
    }
  },
};

module.exports = AdminController;
