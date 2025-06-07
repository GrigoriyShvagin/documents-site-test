// Скрипт для поиска документов на клиентской стороне

document.addEventListener("DOMContentLoaded", () => {
  // Получаем элементы формы поиска
  const searchForm = document.querySelector(".search-container form");
  const searchInput = document.querySelector(
    '.search-container input[name="query"]'
  );

  // Массив для хранения документов пользователя
  let myDocuments = [];

  // Функция загрузки документов пользователя
  const loadMyDocuments = async () => {
    try {
      const response = await fetch("/documents/api/my");
      if (!response.ok) {
        throw new Error("Не удалось загрузить документы");
      }
      myDocuments = await response.json();
      console.log("Загружено документов:", myDocuments.length);
    } catch (error) {
      console.error("Ошибка при загрузке документов:", error);
    }
  };

  // Функция поиска
  const searchDocuments = (query) => {
    if (!query) {
      return myDocuments;
    }

    query = query.toLowerCase();

    return myDocuments.filter((doc) => {
      const title = (doc.title || "").toLowerCase();
      const description = (doc.description || "").toLowerCase();
      const content = (doc.content || "").toLowerCase();

      return (
        title.includes(query) ||
        description.includes(query) ||
        content.includes(query)
      );
    });
  };

  // Обработчик формы поиска
  if (searchForm) {
    searchForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const query = searchInput.value.trim();
      console.log("Поиск по запросу:", query);

      // Если документы ещё не загружены
      if (myDocuments.length === 0) {
        await loadMyDocuments();
      }

      // Выполняем поиск
      const results = searchDocuments(query);
      console.log(`Найдено ${results.length} документов`);

      // Перенаправляем на страницу поиска с результатами
      window.location.href = `/documents/search?query=${encodeURIComponent(
        query
      )}`;
    });

    // Загружаем документы при открытии страницы
    loadMyDocuments();
  }
});
