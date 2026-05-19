// ─── 1. CURSOR PERSONALIZADO ───
const cursor = document.getElementById("custom-cursor");
const follower = document.querySelector(".cursor-follower");

document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
  setTimeout(() => {
    follower.style.left = e.clientX + "px";
    follower.style.top = e.clientY + "px";
  }, 60);
});

// Cursor cambia de color al pasar sobre elementos interactivos
const interactivos = document.querySelectorAll(
  "a, button, .card, .contact-card, .skill-tag, .meta-item, .dropdown-item",
);
interactivos.forEach((el) => {
  el.addEventListener("mouseenter", () =>
    document.body.classList.add("cursor-hover"),
  );
  el.addEventListener("mouseleave", () =>
    document.body.classList.remove("cursor-hover"),
  );
});

// ─── 2. MENÚ DESPLEGABLE — solo al hacer clic ───
const menuIcon = document.getElementById("menu-icon");
const dropdown = document.getElementById("dropdown-config");

menuIcon.addEventListener("click", (e) => {
  e.stopPropagation();
  dropdown.classList.toggle("show");
});

document.addEventListener("click", () => {
  dropdown.classList.remove("show");
});

dropdown.addEventListener("click", (e) => e.stopPropagation());

// ─── 3. CAMBIO DE TEMA (oscuro/claro) ───
const themeSwitch = document.getElementById("theme-switch");
const body = document.body;

// Cargar tema guardado — por defecto OSCURO
if (localStorage.getItem("theme") === "light") {
  body.classList.add("light-mode");
  themeSwitch.checked = false; // checked = light apagado (modo claro activo)
} else {
  themeSwitch.checked = true; // oscuro = switch encendido
}

themeSwitch.addEventListener("change", () => {
  if (themeSwitch.checked) {
    body.classList.remove("light-mode");
    localStorage.setItem("theme", "dark");
  } else {
    body.classList.add("light-mode");
    localStorage.setItem("theme", "light");
  }
});

// ─── 4. NAVEGACIÓN DESDE DROPDOWN ───
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
    dropdown.classList.remove("show");
  }
}

// ─── 5. NAVBAR — sombra al hacer scroll ───
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  if (window.scrollY > 40) {
    header.style.boxShadow = "0 4px 30px rgba(0,0,0,0.3)";
  } else {
    header.style.boxShadow = "none";
  }
});
