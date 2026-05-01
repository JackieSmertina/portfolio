document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initCardsAnimation();
  initProjectFilter();
  initContactForm();
});

function initHeader() {
  const header = document.getElementById("header");

  window.addEventListener("scroll", () => {
    header.classList.toggle("header--scrolled", window.scrollY > 40);
  });
}

function initCardsAnimation() {
  const animatedItems = document.querySelectorAll(
    ".info-card, .experience-card, .project-card, .skill-card"
  );

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    { threshold: 0.15 }
  );

  animatedItems.forEach(item => observer.observe(item));
}

function initProjectFilter() {
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".project-card");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      buttons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      cards.forEach(card => {
        const category = card.dataset.category;

        if (filter === "all" || category === filter) {
          card.classList.remove("hide");
        } else {
          card.classList.add("hide");
        }
      });
    });
  });
}

function initContactForm() {
  const form = document.getElementById("contactForm");
  const success = document.getElementById("formSuccess");

  form.addEventListener("submit", event => {
    event.preventDefault();

    const fields = [
      {
        input: document.getElementById("name"),
        validate: value => value.length >= 2,
        message: "Введите имя минимум из 2 символов"
      },
      {
        input: document.getElementById("email"),
        validate: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: "Введите корректный email"
      },
      {
        input: document.getElementById("message"),
        validate: value => value.length >= 10,
        message: "Сообщение должно быть минимум 10 символов"
      }
    ];

    let isValid = true;

    fields.forEach(field => {
      const value = field.input.value.trim();
      const error = field.input.nextElementSibling;

      if (!field.validate(value)) {
        error.textContent = field.message;
        isValid = false;
      } else {
        error.textContent = "";
      }
    });

    if (isValid) {
      form.reset();
      success.classList.add("show");

      setTimeout(() => {
        success.classList.remove("show");
      }, 3000);
    }
  });
}
