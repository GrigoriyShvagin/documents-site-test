const User = require("../models/User");

const AuthController = {
  // Страница входа
  loginPage: async (req, res) => {
    if (req.session.user) {
      return res.redirect("/");
    }
    res.render("auth/login", { title: "Вход в систему", error: null });
  },

  // Обработка входа
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.render("auth/login", {
          title: "Вход в систему",
          error: "Введите логин и пароль",
        });
      }

      const user = await User.authenticate(username, password);

      if (user) {
        req.session.user = user;
        res.redirect("/documents");
      } else {
        res.render("auth/login", {
          title: "Вход в систему",
          error: "Неверный логин или пароль",
        });
      }
    } catch (err) {
      console.error(err);
      res.render("auth/login", {
        title: "Вход в систему",
        error: "Ошибка сервера",
      });
    }
  },

  // Страница регистрации
  registerPage: async (req, res) => {
    if (req.session.user) {
      return res.redirect("/");
    }
    res.render("auth/register", { title: "Регистрация", error: null });
  },

  // Обработка регистрации
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.render("auth/register", {
          title: "Регистрация",
          error: "Заполните все поля",
        });
      }

      // Проверяем, не существует ли пользователь
      const existingUser = await User.getByUsername(username);
      if (existingUser) {
        return res.render("auth/register", {
          title: "Регистрация",
          error: "Пользователь с таким логином уже существует",
        });
      }

      const existingEmail = await User.getByEmail(email);
      if (existingEmail) {
        return res.render("auth/register", {
          title: "Регистрация",
          error: "Пользователь с таким email уже существует",
        });
      }

      // Создаем нового пользователя
      const userId = await User.create({ username, email, password });
      const newUser = await User.getById(userId);

      req.session.user = newUser;
      res.redirect("/documents");
    } catch (err) {
      console.error(err);
      res.render("auth/register", {
        title: "Регистрация",
        error: "Ошибка при создании пользователя",
      });
    }
  },

  // Выход
  logout: async (req, res) => {
    req.session.destroy();
    res.redirect("/");
  },
};

module.exports = AuthController;
