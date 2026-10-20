/* ご予約フォーム（デモ）：実際には送信しない */
(() => {
  "use strict";

  const form = document.querySelector(".js-reserve-form");
  if (!form) return;
  const message = form.querySelector(".reserve__message");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      message.textContent = "未入力の項目があります。ご希望の日とメールアドレスをご確認ください。";
      form.reportValidity();
      return;
    }
    message.textContent = "ありがとうございます。制作見本のため、実際には送信されていません。";
  });
})();
