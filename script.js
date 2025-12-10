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
const modalPages = Array.from(document.querySelectorAll(".modal-page"));
const pagePrev = document.getElementById("page-prev");
const pageNext = document.getElementById("page-next");
const pageCurrent = document.getElementById("page-current");
const modalGallery = document.getElementById("modal-gallery");
const modalMockNote = document.getElementById("modal-mock-note");
let currentPage = 1;

const imageLightbox = document.getElementById("image-lightbox");
const imageLightboxImg = document.getElementById("image-lightbox-img");
const imageLightboxClose = document.getElementById("image-lightbox-close");

const openLightbox = (src, alt = "Mockup") => {
  if (!imageLightbox || !imageLightboxImg) return;
  imageLightboxImg.src = src;
  imageLightboxImg.alt = alt;
  imageLightbox.classList.add("show");
  imageLightbox.setAttribute("aria-hidden", "false");
};

const closeLightbox = () => {
  if (!imageLightbox || !imageLightboxImg) return;
  imageLightbox.classList.remove("show");
  imageLightbox.setAttribute("aria-hidden", "true");
  imageLightboxImg.src = "";
};

if (imageLightbox) {
  imageLightbox.addEventListener("click", (e) => {
    if (e.target === imageLightbox) closeLightbox();
  });
}
if (imageLightboxClose) {
  imageLightboxClose.addEventListener("click", closeLightbox);
}
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeLightbox();
    closeModal();
  }
});

const setPage = (page) => {
  if (!modalPages.length) return;
  const maxPage = modalPages.length;
  currentPage = Math.min(Math.max(page, 1), maxPage);
  modalPages.forEach((pane, idx) => {
    pane.classList.toggle("active", idx === currentPage - 1);
  });
  if (pageCurrent) pageCurrent.textContent = currentPage;
  if (pagePrev) pagePrev.disabled = currentPage === 1;
  if (pageNext) pageNext.disabled = currentPage === maxPage;
};

const buildGallery = (mockData = {}) => {
  if (!modalGallery) return;
  modalGallery.innerHTML = "";
  const folder = mockData.folder || "";
  const files = (mockData.files && mockData.files.length) ? mockData.files : ["01.png", "02.png", "03.png"];

  files.forEach((file, idx) => {
    const cleanFolder = folder.replace(/\\/g, "/").replace(/\/+$/,"");
    const relPath = cleanFolder ? `${cleanFolder}/${file}` : file;
    const card = document.createElement("button");
    card.className = "mock-link";
    card.type = "button";
    card.dataset.path = relPath;
    card.setAttribute("aria-label", `Abrir mockup ${file}`);
    card.innerHTML = `
      <div class="mock-img"></div>
      <span class="mock-open">Abrir</span>
    `;
    modalGallery.appendChild(card);
    const holder = card.querySelector(".mock-img");
    const setThumb = () => {
      if (holder) holder.style.backgroundImage = relPath ? `url(${relPath})` : "";
    };
    // Set immediately so el fondo se pinta aunque el onload no dispare
    setThumb();
    card.addEventListener("click", () => openLightbox(relPath, `Mockup ${idx + 1}`));

    const img = new Image();
    img.alt = `Mockup ${idx + 1}`;
    img.loading = "lazy";
    img.decoding = "async";
    img.onload = () => {
      setThumb();
      card.classList.add("mock-link--with-img");
    };
    img.onerror = () => {
      if (holder) holder.style.backgroundImage = "";
      card.classList.remove("mock-link--with-img");
    };
    img.src = relPath;
  });

  if (modalMockNote) {
    modalMockNote.textContent = folder
      ? `Guarda las imágenes en ${folder}/ con estos nombres: ${files.join(", ")}`
      : "Añade un data-mock-folder en la tarjeta para indicar dónde subir los mockups.";
  }
};

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
  buildGallery({
    folder: data.mockFolder,
    files: data.mockFiles
  });
  setPage(1);
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

if (pagePrev) {
  pagePrev.addEventListener("click", () => setPage(currentPage - 1));
}
if (pageNext) {
  pageNext.addEventListener("click", () => setPage(currentPage + 1));
}

document.querySelectorAll(".project-card").forEach(card => {
  card.setAttribute("tabindex", "0");
  card.setAttribute("role", "button");
  const handler = () => {
    const funcs = (card.dataset.func || "").split("|").filter(Boolean);
    const mockFiles = (card.dataset.mockFiles || "").split("|").filter(Boolean);
    openModal({
      title: card.dataset.title,
      desc: card.dataset.desc,
      func: funcs,
      mockFolder: card.dataset.mockFolder,
      mockFiles
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
