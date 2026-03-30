const menuBtn = document.querySelector(".menu-btn");
const menuList = document.querySelector(".menu-list");
const menuLinks = document.querySelectorAll(".menu-list a");

if (menuBtn && menuList) {
  menuBtn.addEventListener("click", () => {
    menuList.classList.toggle("open");
  });

  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuList.classList.remove("open");
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 760) {
      menuList.classList.remove("open");
    }
  });
}

// Seamless marquee duplication for the studio lines
document.querySelectorAll(".studio-line.marquee .marquee-track").forEach((track) => {
  const original = document.createElement("div");
  original.className = "marquee-segment";
  original.style.display = "inline-flex";
  original.style.alignItems = "center";
  original.style.gap = getComputedStyle(track).gap || "12px";

  Array.from(track.childNodes).forEach((node) => {
    original.appendChild(node.cloneNode(true));
  });

  const clone = original.cloneNode(true);

  track.textContent = "";
  track.appendChild(original);
  track.appendChild(clone);
});
