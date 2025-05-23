const Message = require("../models/Message");

const UsersController = {
  // Форма обратной связи
  contactForm: (req, res) => {
    res.render("contact", {
      title: "Обратная связь",
      error: null,
      success: null,
    });
  },

  // Отправка сообщения в поддержку
  sendMessage: async (req, res) => {
    try {
      const { subject, message } = req.body;

      if (!subject || !message) {
        return res.render("contact", {
          title: "Обратная связь",
          error: "Заполните все поля",
          success: null,
        });
      }

      await Message.create({
        user_id: req.session.user.id,
        subject,
        message,
      });

      res.render("contact", {
        title: "Обратная связь",
        error: null,
        success:
          "Ваше сообщение отправлено! Мы свяжемся с вами в ближайшее время.",
      });
    } catch (err) {
      console.error(err);
      res.render("contact", {
        title: "Обратная связь",
        error: "Ошибка при отправке сообщения",
        success: null,
      });
    }
  },

  // Мои сообщения
  myMessages: async (req, res) => {
    try {
      const messages = await Message.getByUserId(req.session.user.id);
      res.render("users/my-messages", {
        title: "Мои сообщения",
        messages,
      });
    } catch (err) {
      console.error(err);
      res.render("error", {
        title: "Ошибка",
        message: "Не удалось загрузить ваши сообщения",
      });
    }
  },
};

module.exports = UsersController;
