// ============================================================
//  Portfolio — main.js
//  Использованы: click, submit, DOM, .filter(), .map()
//  Библиотека: AOS (Animate On Scroll)
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  initAOS();
  initHeader();
  initMobileMenu();
  initProjectFilter();
  initContactForm();
});

// 1. AOS — библиотека анимаций
function initAOS() {
  if (typeof AOS !== "undefined") {
    AOS.init({ duration: 700, once: true, offset: 80, easing: "ease-out-cubic" });
  }
}

// 2. Шапка — тень при скролле
function initHeader() {
  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("header--scrolled", window.scrollY > 40);
  });
}

// 3. Мобильное меню
function initMobileMenu() {
  const toggle = document.getElementById("nav-toggle");
  const close  = document.getElementById("nav-close");
  const menu   = document.getElementById("nav-menu");

  if (!toggle || !menu) return;

  function closeMobileMenu() {
    menu.classList.remove("mobile-open");
    document.body.style.overflow = "";
  }

  toggle.addEventListener("click", () => {
    menu.classList.add("mobile-open");
    document.body.style.overflow = "hidden";
  });

  if (close) close.addEventListener("click", closeMobileMenu);

  menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMobileMenu);
  });

  menu.addEventListener("click", e => {
    if (e.target === menu) closeMobileMenu();
  });
}

// 4. Фильтр проектов — Array.prototype.filter()
function initProjectFilter() {
  const buttons = document.querySelectorAll(".filter-btn");
  const cards   = Array.from(document.querySelectorAll(".project-card"));

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      buttons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      // .filter() — отбираем карточки по категории
      const visible = cards.filter(card =>
        filter === "all" || card.dataset.category === filter
      );

      cards.forEach(card => card.classList.add("hide"));
      visible.forEach(card => card.classList.remove("hide"));
    });
  });
}

// 5. Форма — .map() + submit + отправка в Telegram Bot API
function initContactForm() {
  const form    = document.getElementById("contactForm");
  const success = document.getElementById("formSuccess");
  if (!form) return;

  // ─── TELEGRAM BOT НАСТРОЙКИ ────────────────────────────────
  // Шаг 1: напиши @BotFather → /newbot → вставь токен сюда
  // Шаг 2: напиши @userinfobot → вставь свой Chat ID сюда
  const TG_TOKEN   = "ВСТАВЬ_ТОКЕН_БОТА";   // пример: 7123456789:AAHxxx...
  const TG_CHAT_ID = "ВСТАВЬ_CHAT_ID";       // пример: 123456789
  // ──────────────────────────────────────────────────────────

  form.addEventListener("submit", event => {
    event.preventDefault();

    const fields = [
      {
        input:    document.getElementById("name"),
        validate: value => value.length >= 2,
        message:  "Введите имя минимум из 2 символов"
      },
      {
        input:    document.getElementById("email"),
        validate: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message:  "Введите корректный email"
      },
      {
        input:    document.getElementById("message"),
        validate: value => value.length >= 10,
        message:  "Сообщение должно быть минимум 10 символов"
      }
    ];

    // .map() — проверяем каждое поле, получаем массив булевых результатов
    const results = fields.map(field => {
      const value   = field.input.value.trim();
      const error   = field.input.nextElementSibling;
      const isValid = field.validate(value);

      error.textContent = isValid ? "" : field.message;
      field.input.style.borderColor = isValid
        ? "rgba(59, 130, 246, 0.26)"
        : "#fb7185";

      return isValid;
    });

    if (!results.every(r => r)) return;

    // Собираем данные формы
    const name    = document.getElementById("name").value.trim();
    const email   = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    const text = `📬 <b>Новое сообщение с портфолио!</b>\n\n` +
                 `👤 <b>Имя:</b> ${name}\n` +
                 `📧 <b>Email:</b> ${email}\n\n` +
                 `💬 <b>Сообщение:</b>\n${message}`;

    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    btn.textContent = "Отправляю...";

    // Отправка через Telegram Bot API
    fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ chat_id: TG_CHAT_ID, text, parse_mode: "HTML" })
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          form.reset();
          if (success) {
            success.textContent = "✅ Сообщение отправлено в Telegram!";
            success.classList.add("show");
            setTimeout(() => success.classList.remove("show"), 4000);
          }
        } else {
          if (success) {
            success.textContent = "⚠️ Заполни токен бота в main.js";
            success.classList.add("show");
            setTimeout(() => success.classList.remove("show"), 4000);
          }
        }
      })
      .catch(() => {
        if (success) {
          success.textContent = "❌ Ошибка отправки. Проверь токен бота.";
          success.classList.add("show");
          setTimeout(() => success.classList.remove("show"), 4000);
        }
      })
      .finally(() => {
        btn.disabled = false;
        btn.innerHTML = 'Отправить сообщение <i class="fa-solid fa-paper-plane"></i>';
      });
  });

  // Сброс ошибки при вводе
  form.querySelectorAll("input, textarea").forEach(input => {
    input.addEventListener("input", () => {
      input.style.borderColor = "rgba(59, 130, 246, 0.26)";
      const err = input.nextElementSibling;
      if (err) err.textContent = "";
    });
  });
}
