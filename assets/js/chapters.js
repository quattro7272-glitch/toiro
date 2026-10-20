/* 今どこにいるか（章・指・色）を常に見えるようにする。
   見た目の動きを切っても、ヘッダーの文字で現在地が分かる。 */
(() => {
  "use strict";

  const header = document.getElementById("header");
  const sections = Array.from(document.querySelectorAll("[data-pos]"));
  const segments = Array.from(document.querySelectorAll(".progress__seg"));
  const fingers = Array.from(document.querySelectorAll(".handmap__finger"));
  const posNum = header.querySelector(".pos__num");
  const posSep = header.querySelector(".pos__sep");
  const posFinger = header.querySelector(".pos__finger");
  const posName = header.querySelector(".pos__name");
  const root = document.documentElement;

  let currentSection = null;
  let hashTimer = null;
  let ticking = false;

  function pickSection() {
    const line = header.offsetHeight + window.innerHeight * 0.3;
    let picked = sections[0];
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= line) picked = section;
    });
    return picked;
  }

  function chapterIndex(section) {
    const id = section.id || "";
    const match = /^ch-(\d+)$/.exec(id);
    return match ? Number(match[1]) : 0;
  }

  function showPosition(section) {
    const index = chapterIndex(section);
    if (index > 0) {
      posNum.textContent = String(index).padStart(2, "0");
      posSep.hidden = false;
      posFinger.textContent = section.dataset.finger;
      posName.textContent = section.dataset.name;
    } else {
      posNum.textContent = "--";
      posSep.hidden = false;
      posFinger.textContent = section.dataset.pos;
      posName.textContent = "";
    }
    const color = index > 0 ? getComputedStyle(section).getPropertyValue("--chapter").trim() : "";
    if (color) root.style.setProperty("--chapter", color);
    else root.style.removeProperty("--chapter");

    segments.forEach((segment, i) => segment.classList.toggle("is-reached", index > 0 && i < index));
    fingers.forEach((finger) => finger.classList.toggle("is-current", Number(finger.dataset.index) === index));
  }

  function syncHash(section) {
    window.clearTimeout(hashTimer);
    hashTimer = window.setTimeout(() => {
      const base = window.location.pathname + window.location.search;
      const hash = section.id ? "#" + section.id : "";
      if (window.location.hash !== hash) history.replaceState(null, "", base + hash);
    }, 250);
  }

  function update() {
    ticking = false;
    const section = pickSection();
    if (section.classList.contains("chapter")) section.classList.add("is-seen");
    if (section === currentSection) return;
    currentSection = section;
    showPosition(section);
    syncHash(section);
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  // 画面に入った章は、照りの動きを一度だけ見せる
  if ("IntersectionObserver" in window) {
    const seen = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-seen");
          seen.unobserve(entry.target);
        }
      }),
      { threshold: 0.25 }
    );
    document.querySelectorAll(".chapter").forEach((chapter) => seen.observe(chapter));
  } else {
    document.querySelectorAll(".chapter").forEach((chapter) => chapter.classList.add("is-seen"));
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  requestUpdate();
})();
