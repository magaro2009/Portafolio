const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.transform = "translateY(0)";
      entry.target.style.opacity = "1";
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll(".reveal").forEach(card => {
  card.style.transform = "translateY(14px)";
  card.style.opacity = "0";
  observer.observe(card);
});

const sections = Array.from(document.querySelectorAll("section[id]"));
const navLinks = Array.from(document.querySelectorAll("nav a")).reduce((acc, link) => {
  const href = link.getAttribute("href") || "";
  if (href.startsWith("#")) acc[href.slice(1)] = link;
  return acc;
}, {});

const spy = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.id;
    const link = navLinks[id];
    if (!link) return;
    if (entry.isIntersecting) {
      Object.values(navLinks).forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    }
  });
}, { threshold: 0.45, rootMargin: "-10% 0px -40% 0px" });

sections.forEach(sec => spy.observe(sec));

const toTop = document.getElementById("to-top");
window.addEventListener("scroll", () => {
  if (window.scrollY > 220) {
    toTop.classList.add("show");
  } else {
    toTop.classList.remove("show");
  }
});
toTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const codeCube = document.getElementById("code-cube");
if (codeCube) {
  codeCube.addEventListener("click", () => {
    codeCube.classList.remove("spin-once");
    // force reflow to restart animation
    void codeCube.offsetWidth;
    codeCube.classList.add("spin-once");
  });
  codeCube.addEventListener("animationend", () => {
    codeCube.classList.remove("spin-once");
  });
}

function toggleMenu() {
  const menu = document.getElementById("mobile-nav");
  menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}
