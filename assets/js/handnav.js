/* 「十指」ボタン：どこからでも、手の図で章へ飛べる目次を開く */
(() => {
  "use strict";

  const overlay = document.getElementById("handnav");
  const openButton = document.querySelector(".js-handnav-open");
  const closeButton = document.querySelector(".js-handnav-close");
  const mapSlot = overlay.querySelector(".handnav__map");
  const sourceMap = document.querySelector(".preface .handmap__hands");
  if (!overlay || !openButton || !closeButton || !mapSlot || !sourceMap) return;

  let cloned = false;

  function ensureMap() {
    if (cloned) return;
    const copy = sourceMap.cloneNode(true);
    mapSlot.appendChild(copy);
    cloned = true;
  }

  function open() {
    ensureMap();
    overlay.hidden = false;
    openButton.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    closeButton.focus();
  }

  function close() {
    overlay.hidden = true;
    openButton.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    openButton.focus({ preventScroll: true });
  }

  openButton.addEventListener("click", open);
  closeButton.addEventListener("click", close);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !overlay.hidden) close();
  });

  // 目次の指を押したら、閉じてから章へ（移動は anchor-scroll.js が担当）
  overlay.addEventListener("click", (event) => {
    if (event.target.closest("a[href^='#']")) {
      overlay.hidden = true;
      openButton.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
  });
})();
