// Simple helpers
const qs = (sel) => document.querySelector(sel);
const qsa = (sel) => Array.from(document.querySelectorAll(sel));

const header = qs("#header");
const toggle = qs("#toggle");
const menu = qs("#menu");
const links = qsa("[data-link]");
const year = qs("#year");
const copyEmail = qs("#copyEmail");
const form = qs("#form");
const status = qs("#status");
const intro = qs("#intro");
const designCards = qsa(".gallery .media-card");
const restoreState = () => {
  const skipIntro = sessionStorage.getItem("skipIntroOnce") === "1";
  const restoreScroll = sessionStorage.getItem("restoreDesignScroll") === "1";
  const savedY = sessionStorage.getItem("designScrollY");

  if (skipIntro && intro) {
    intro.classList.add("intro-hide");
    sessionStorage.removeItem("skipIntroOnce");
  }

  if (restoreScroll && savedY) {
    window.scrollTo(0, Number(savedY));
    sessionStorage.removeItem("restoreDesignScroll");
  }
};

// Year
year.textContent = new Date().getFullYear();
restoreState();
window.addEventListener("pageshow", restoreState);

// Sticky nav style on scroll
const syncHeader = () => header.classList.toggle("scrolled", window.scrollY > 16);
syncHeader();
window.addEventListener("scroll", syncHeader);

// Mobile menu
toggle?.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});
links.forEach((link) =>
  link.addEventListener("click", () => {
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  })
);

// Reveal on scroll
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);
qsa(".reveal").forEach((el) => observer.observe(el));

// Remember the current position before opening a design detail page
designCards.forEach((card) => {
  card.addEventListener("click", () => {
    sessionStorage.setItem("designScrollY", String(window.scrollY));
    sessionStorage.setItem("skipIntroOnce", "1");
    sessionStorage.setItem("restoreDesignScroll", "1");
  });
});

// Intro overlay
window.addEventListener("load", () => {
  if (sessionStorage.getItem("skipIntroOnce") === "1") {
    intro?.classList.add("intro-hide");
    return;
  }
  setTimeout(() => intro?.classList.add("intro-hide"), 2200);
});
intro?.addEventListener("click", () => intro.classList.add("intro-hide"));

// Copy email
copyEmail?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("george.mwali830@gmail.com");
    status.textContent = "Email address copied to clipboard.";
    status.classList.add("ok");
  } catch {
    status.textContent = "Copy was not available on this device. Use the direct email link instead.";
    status.classList.remove("ok");
  }
});

// Contact form -> mailto
form?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) {
    status.textContent = "Please complete all fields before sending your message.";
    status.classList.remove("ok");
    return;
  }
  const name = qs("#name").value.trim();
  const email = qs("#email").value.trim();
  const subject = qs("#subject").value.trim();
  const message = qs("#message").value.trim();

  const body = ["Name: " + name, "Email: " + email, "", message].join("\n");
  window.location.href =
    "mailto:george.mwali830@gmail.com?subject=" +
    encodeURIComponent(subject) +
    "&body=" +
    encodeURIComponent(body);

  form.reset();
  status.textContent = "Your email app should open with a ready-to-send draft.";
  status.classList.add("ok");
});
