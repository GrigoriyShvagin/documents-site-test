$(document).ready(function () {
  console.log("Документ загружен с jQuery");
  console.log("Система документов инициализирована");

  console.log("User Agent: " + navigator.userAgent);

  console.log("jQuery версия: " + $.fn.jquery);

  const docsCount = $(".document-card").length;
  if (docsCount > 0) {
    console.log("Документов на странице: " + docsCount);
  }
});
