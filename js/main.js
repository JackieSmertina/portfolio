document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initHeaderScroll();
  initRevealAnimation();
  initActiveLinks();
});

function initNavigation() {
  const navToggle = document.getElementById("nav-toggle");
  const navClose = document.getElementById("nav-close");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav__link");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => navMenu.classList.add("show"));
  }

  if (navClose && navMenu) {
    navClose.addEventListener("click", () => navMenu.classList.remove("show"));
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => navMenu?.classList.remove("show"));
  });
}

function initHeaderScroll() {
  const header = document.getElementById("header");

  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 40);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader);
}

function initRevealAnimation() {
  const elements = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach((el) => observer.observe(el));
}

function initActiveLinks() {
  const sections = document.querySelectorAll("section[id]");
  const links = document.querySelectorAll(".nav__link");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      links.forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${entry.target.id}`
        );
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });

  sections.forEach((section) => observer.observe(section));
}
