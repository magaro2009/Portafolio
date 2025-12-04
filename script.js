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

const cursorGlow = document.getElementById("cursor-glow");
if (cursorGlow) {
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  let rafId = null;

  const animate = () => {
    currentX += (targetX - currentX) * 0.18;
    currentY += (targetY - currentY) * 0.18;
    cursorGlow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    rafId = requestAnimationFrame(animate);
  };

  window.addEventListener("mousemove", (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    cursorGlow.style.opacity = "1";
    if (!rafId) rafId = requestAnimationFrame(animate);
  });

  window.addEventListener("mouseleave", () => {
    cursorGlow.style.opacity = "0";
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  });
}

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

const modal = document.getElementById("project-modal");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
const modalFunc = document.getElementById("modal-func");
const modalClose = document.getElementById("modal-close");

const openModal = (data) => {
  if (!modal) return;
  modalTitle.textContent = data.title || "";
  modalDesc.textContent = data.desc || "";
  modalFunc.innerHTML = "";
  (data.func || []).forEach(item => {
    const li = document.createElement("li");
    li.textContent = item.trim();
    modalFunc.appendChild(li);
  });
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
};

const closeModal = () => {
  if (!modal) return;
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
};

if (modalClose) {
  modalClose.addEventListener("click", closeModal);
}
if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

document.querySelectorAll(".project-card").forEach(card => {
  card.setAttribute("tabindex", "0");
  card.setAttribute("role", "button");
  const handler = () => {
    const funcs = (card.dataset.func || "").split("|").filter(Boolean);
    openModal({
      title: card.dataset.title,
      desc: card.dataset.desc,
      func: funcs
    });
  };
  card.addEventListener("click", handler);
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handler();
    }
  });
});

function toggleMenu() {
  const menu = document.getElementById("mobile-nav");
  menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}
