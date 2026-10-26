// Navbar responsif: toggle animasi, tutup saat klik luar/Escape, dan status aktif.
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const siteHeader = document.querySelector(".site-header");
const mainNavLinks = navLinks ? Array.from(navLinks.querySelectorAll('a[href^="#"]')) : [];

function setMenuState(open) {
  if (!menuToggle || !navLinks) return;
  navLinks.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
  document.body.classList.toggle("nav-menu-open", open && window.innerWidth <= 760);
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    setMenuState(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  // Tutup menu jika pengguna klik di luar area navbar.
  document.addEventListener("click", (event) => {
    if (window.innerWidth <= 760 &&
        (!siteHeader || !siteHeader.contains(event.target)) &&
        menuToggle.getAttribute("aria-expanded") === "true") {
      setMenuState(false);
    }
  });

  // Dukungan tombol Escape untuk aksesibilitas keyboard.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      setMenuState(false);
      menuToggle.focus();
    }
  });

  // Jika ukuran layar berubah ke desktop, reset status menu mobile.
  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) setMenuState(false);
  });
}

// Efek header saat halaman digulir.
function updateHeaderScrollState() {
  if (siteHeader) siteHeader.classList.toggle("is-scrolled", window.scrollY > 50);
}
window.addEventListener("scroll", updateHeaderScrollState, { passive: true });
updateHeaderScrollState();

// Tandai tautan navbar sesuai bagian halaman yang sedang terlihat.
if ("IntersectionObserver" in window && mainNavLinks.length) {
  const navSections = mainNavLinks
    .map((link) => {
      const section = document.querySelector(link.getAttribute("href"));
      return section ? { link, section } : null;
    })
    .filter(Boolean);

  const navSectionObserver = new IntersectionObserver((entries) => {
    const visibleSections = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (!visibleSections.length) return;
    const current = navSections.find((item) => item.section === visibleSections[0].target);
    if (!current) return;

    mainNavLinks.forEach((link) => {
      const active = link === current.link;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }, { rootMargin: "-25% 0px -60% 0px", threshold: [0, 0.1, 0.25, 0.5] });

  navSections.forEach((item) => navSectionObserver.observe(item.section));
}

// Tahun otomatis di footer
const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// Animasi elemen saat masuk ke layar
const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

// Image Gallery: ganti gambar utama ketika thumbnail diklik
const galleryMainImage = document.getElementById("galleryMainImage");
const galleryThumbs = document.querySelectorAll(".gallery-thumb");

galleryThumbs.forEach((thumb) => {
  thumb.addEventListener("click", () => {
    if (!galleryMainImage) return;

    galleryMainImage.src = thumb.dataset.image;
    galleryMainImage.alt = thumb.dataset.alt || "Foto galeri";

    galleryThumbs.forEach((item) => {
      const active = item === thumb;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
  });
});


// Galeri: pastikan gambar dan tombol thumbnail tersedia sebelum memperbarui tampilan.
document.querySelectorAll(".gallery-thumb").forEach((thumb) => {
  thumb.setAttribute("type", "button");
  if (!thumb.hasAttribute("aria-pressed")) {
    thumb.setAttribute("aria-pressed", String(thumb.classList.contains("active")));
  }
  
/* EFEK LOGO HEADER SAAT SCROLL */
document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector(".site-header");

  if (!header) return;

  function updateHeader() {
    header.classList.toggle("scrolled", window.scrollY > 50);
  }

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });

  updateHeader();
});

});



// Form kontak: siapkan email dengan isi pesan dari formulir.
const emailContactForm = document.getElementById("emailContactForm");

if (emailContactForm) {
  emailContactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(emailContactForm);
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const senderEmail = String(formData.get("email") || "").trim();
    const service = String(formData.get("service") || "Konsultasi umum").trim();
    const message = String(formData.get("message") || "").trim();

    const subject = `Pertanyaan Website Akifa - ${service}`;
    const body = [
      "Yth. PT Akifa Multiusaha,",
      "",
      "Saya ingin menghubungi tim PT Akifa Multiusaha dengan detail berikut:",
      `Nama: ${name}`,
      `Phone number: ${phone || "-"}`,
      `Email: ${senderEmail}`,
      `Layanan: ${service}`,
      "",
      "Pesan:",
      message,
      "",
      "Terima kasih."
    ].join("\n");

    const mailto = `mailto:akifamultiusaha@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const status = document.getElementById("emailFormStatus");
    if (status) {
      status.textContent = "Aplikasi email sedang dibuka. Silakan periksa pesan sebelum mengirim.";
    }
    window.location.href = mailto;
  });
}



/* === FLUID SCROLL PORTOFOLIO CEPAT === */

const portfolioPhoto = document.querySelector(".project-photo img");

if (portfolioPhoto) {
  let ticking = false;

  function updatePortfolioFluid() {
    const rect = portfolioPhoto.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Progres foto saat masuk dan keluar viewport
    const progress =
      (windowHeight - rect.top) /
      (windowHeight + rect.height);

    // Ubah angka 35 untuk mempercepat gerakan
    const speed = 100;
    const offset = (progress - 0.5) * speed;

    portfolioPhoto.style.transform =
      `translate3d(0, ${offset}px, 0) scale(1.06)`;

    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updatePortfolioFluid);
      ticking = true;
    }
  }, { passive: true });

  updatePortfolioFluid();
}


// ========================================
// INTRO IMAGE — REVEAL & FLUID SCROLL
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  const imageContainers = document.querySelectorAll(
    ".intro-image.reveal"
  );

  const fluidImages = document.querySelectorAll(
    ".intro-image .fluid-image"
  );

  // Atur intensitas gerakan fluid di sini.
  // 0.10 = lembut, 0.20 = sedang, 0.35 = lebih terasa.
  const fluidSpeed = 0.50;

  // 1. REVEAL SAAT FOTO MASUK VIEWPORT
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  imageContainers.forEach((container) => {
    revealObserver.observe(container);
  });

  // 2. FLUID PARALLAX BERDASARKAN SCROLL
  let ticking = false;

  function updateFluidImages() {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      fluidImages.forEach((img) => {
        img.style.transform = "none";
      });
      ticking = false;
      return;
    }

    const viewportHeight = window.innerHeight;

    fluidImages.forEach((img) => {
      const container = img.closest(".intro-image");
      if (!container) return;

      const rect = container.getBoundingClientRect();

      // Abaikan gambar yang jauh dari viewport.
      if (
        rect.bottom < -100 ||
        rect.top > viewportHeight + 100
      ) {
        return;
      }

      // Posisi relatif terhadap tengah viewport.
      const distance =
        (rect.top + rect.height / 2 - viewportHeight / 2) /
        viewportHeight;

      // Gerakan vertikal halus, dibatasi agar tidak berlebihan.
      const translateY = Math.max(
        -24,
        Math.min(24, -distance * 24 * fluidSpeed * 5)
      );

      img.style.transform =
        `translate3d(0, ${translateY}px, 0) scale(1.06)`;
    });

    ticking = false;
  }

  function requestFluidUpdate() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateFluidImages);
    }
  }

  window.addEventListener("scroll", requestFluidUpdate, {
    passive: true
  });

  window.addEventListener("resize", requestFluidUpdate, {
    passive: true
  });

  updateFluidImages();
});


/* =========================================================
   BIDANG USAHA — CARD REVEAL & IMAGE MOTION
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const businessCards = document.querySelectorAll(".business-card");

  businessCards.forEach((card, index) => {
    card.style.setProperty("--card-delay", `${(index % 3) * 90}ms`);

    const image = card.querySelector(".business-card-image");
    if (image) {
      image.addEventListener("error", () => {
        card.classList.add("image-unavailable");
      }, { once: true });
    }
  });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) return;

  const visibleCards = new Set();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) visibleCards.add(entry.target);
      else visibleCards.delete(entry.target);
    });
  }, { rootMargin: "80px 0px", threshold: 0 });

  businessCards.forEach((card) => observer.observe(card));

  let framePending = false;
  function updateBusinessCardMotion() {
    visibleCards.forEach((card) => {
      const image = card.querySelector(".business-card-image");
      if (!image) return;
      const rect = card.getBoundingClientRect();
      const progress = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
      const offset = Math.max(-10, Math.min(10, -progress * 10));
      image.style.transform = `translate3d(0, ${offset}px, 0) scale(1.045)`;
    });
    framePending = false;
  }

  function requestCardMotion() {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(updateBusinessCardMotion);
  }

  window.addEventListener("scroll", requestCardMotion, { passive: true });
  window.addEventListener("resize", requestCardMotion, { passive: true });
  requestCardMotion();
});
