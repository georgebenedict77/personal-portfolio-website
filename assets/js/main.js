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
const projectModal = qs("#projectModal");
const projectModalKicker = qs("#projectModalKicker");
const projectModalTitle = qs("#projectModalTitle");
const projectModalText = qs("#projectModalText");
const projectModalImage = qs("#projectModalImage");
const projectModalMeta = qs("#projectModalMeta");
const projectModalLinks = qs("#projectModalLinks");
const closeProjectModal = qs("#closeProjectModal");
const calculatorDemo = qs("#calculatorDemo");
const calcDisplay = qs("#calcDisplay");
const projectTriggers = qsa(".project-trigger");
// Add future projects here so each card can reuse the same popup layout.
const projectData = {
  "scientific-calculator": {
    kicker: "Java desktop project",
    title: "Scientific Calculator",
    text:
      "A practical Java calculator project focused on correct computation, cleaner input handling, and a simple but reliable user experience. This popup includes a lightweight web demo so visitors can interact with the idea immediately.",
    image: "assets/img/project-scientific-calculator.svg",
    imageAlt: "Interface preview for the Scientific Calculator project",
    meta: ["Java", "Desktop app", "Error handling", "Math logic"],
    links: [
      {
        label: "View GitHub repo",
        href: "https://github.com/georgebenedict77/scientific-calculator",
      },
    ],
    calculator: true,
  },
  "notepad-desktop-app": {
    kicker: "Java desktop project",
    title: "Notepad Desktop App",
    text:
      "A Java Swing notepad desktop application built around clean text editing, document actions, and simple file handling. It shows desktop UI structure, event-driven logic, and the kind of practical productivity software I enjoy building.",
    image: "assets/img/project-notepad-main.png",
    imageAlt: "Screenshot of the Notepad Desktop App main editor",
    fit: "contain",
    meta: ["Java", "Swing UI", "Desktop app", "File handling"],
    links: [
      {
        label: "View GitHub repo",
        href: "https://github.com/georgebenedict77/notepad-desktop-app",
      },
      {
        label: "Ask for a walkthrough",
        href: "#contact",
      },
    ],
  },
  "payment-handling-system": {
    kicker: "Java workflow project",
    title: "Payment Handling System",
    text:
      "A Java project designed around multi-method payment flow. The goal is to model realistic business logic for M-Pesa, Airtel Money, card, and cash while keeping balances, receipts, and edge cases easy to follow.",
    image: "assets/img/project-payment-system.svg",
    imageAlt: "Interface preview for the Payment Handling System project",
    meta: ["Java", "Business logic", "Payment flow", "Receipts"],
    links: [
      {
        label: "Ask for a walkthrough",
        href: "#contact",
      },
    ],
  },
  "portfolio-website": {
    kicker: "Frontend project",
    title: "Personal Portfolio Website",
    text:
      "This site itself is a project: a responsive portfolio built to present work more professionally, feel more credible to recruiters and clients, and make future updates easier.",
    image: "assets/img/project-portfolio-website.svg",
    imageAlt: "Interface preview for the Personal Portfolio Website project",
    meta: ["HTML", "CSS", "JavaScript", "Responsive UI"],
    links: [
      {
        label: "View live site",
        href: "https://georgebenedict77.github.io/personal-portfolio-website/",
      },
      {
        label: "Contact about a similar build",
        href: "#contact",
      },
    ],
  },
};
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

const renderProjectModal = (project) => {
  if (!project) return;
  projectModalKicker.textContent = project.kicker;
  projectModalTitle.textContent = project.title;
  projectModalText.textContent = project.text;
  if (projectModalImage) {
    projectModalImage.src = project.image;
    projectModalImage.alt = project.imageAlt;
    projectModalImage.classList.toggle("project-image-contain", project.fit === "contain");
  }
  projectModalMeta.innerHTML = project.meta.map((item) => `<span>${item}</span>`).join("");
  projectModalLinks.innerHTML = project.links
    .map(
      (link) =>
        `<a class="btn btn-secondary" href="${link.href}"${
          link.href.startsWith("http") ? ' target="_blank" rel="noopener noreferrer"' : ""
        }>${link.label}</a>`
    )
    .join("");
  calculatorDemo.hidden = !project.calculator;
};

const openProjectModal = (projectId) => {
  renderProjectModal(projectData[projectId]);
  calculatorExpression = "0";
  updateCalculatorDisplay();
  document.body.classList.add("modal-open");
  projectModal?.classList.add("open");
  projectModal?.setAttribute("aria-hidden", "false");
};

const closeModal = () => {
  document.body.classList.remove("modal-open");
  projectModal?.classList.remove("open");
  projectModal?.setAttribute("aria-hidden", "true");
};

projectTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => openProjectModal(trigger.dataset.project));
});

closeProjectModal?.addEventListener("click", closeModal);
qsa("[data-close-modal]").forEach((el) => el.addEventListener("click", closeModal));
projectModalLinks?.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link) return;
  closeModal();
});
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && projectModal?.classList.contains("open")) closeModal();
});

let calculatorExpression = "0";
const updateCalculatorDisplay = () => {
  if (calcDisplay) calcDisplay.value = calculatorExpression;
};

const evaluateExpression = () => {
  try {
    const safeExpression = calculatorExpression.replace(/[^0-9+\-*/.() ]/g, "");
    const result = Function(`"use strict"; return (${safeExpression || 0})`)();
    calculatorExpression = Number.isFinite(result) ? String(result) : "0";
  } catch {
    calculatorExpression = "0";
  }
  updateCalculatorDisplay();
};

const applyUnary = (fn) => {
  let currentValue = 0;
  try {
    const safeExpression = calculatorExpression.replace(/[^0-9+\-*/.() ]/g, "");
    currentValue = Number(Function(`"use strict"; return (${safeExpression || 0})`)());
  } catch {
    currentValue = 0;
  }
  const result = fn(currentValue);
  calculatorExpression = Number.isFinite(result) ? String(result) : "0";
  updateCalculatorDisplay();
};

qsa("[data-calc-value]").forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.dataset.calcValue;
    calculatorExpression = calculatorExpression === "0" && ![".", "+", "-", "*", "/"].includes(value) ? value : calculatorExpression + value;
    updateCalculatorDisplay();
  });
});

qsa("[data-calc-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.calcAction;
    if (action === "clear") calculatorExpression = "0";
    if (action === "backspace") calculatorExpression = calculatorExpression.length > 1 ? calculatorExpression.slice(0, -1) : "0";
    if (action === "equals") evaluateExpression();
    if (action === "sqrt") applyUnary((value) => Math.sqrt(Math.max(0, value)));
    if (action === "square") applyUnary((value) => value ** 2);
    if (action === "sin") applyUnary((value) => Math.sin((value * Math.PI) / 180));
    if (action === "cos") applyUnary((value) => Math.cos((value * Math.PI) / 180));
    if (action === "tan") applyUnary((value) => Math.tan((value * Math.PI) / 180));
    if (action === "pi") {
      calculatorExpression = calculatorExpression === "0" ? String(Math.PI) : calculatorExpression + Math.PI;
    }
    updateCalculatorDisplay();
  });
});

updateCalculatorDisplay();
